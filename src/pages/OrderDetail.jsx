import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { context } from "../contexts/ProviderLogin";
import { Footer, Navbar } from "../components";
import axios from "axios";
import '../css/StyleMyOrder.css';
import { toast } from "react-toastify";

function OrderDetail() {
    const { id } = useParams();

    const { orderList, getProductById, isLogin, getUserByUserId, reviewList, setReviewList, productList, setProductList } = useContext(context);

    const [orderDetail, setOrderDetail] = useState([]);

    const [order, setOrder] = useState({});

    const [star, setStar] = useState(-1);

    const [content, setContent] = useState('');

    const [reviewDetail, setReviewDetail] = useState({});

    const [productId, setProductId] = useState(-1);

    const navigate = useNavigate();


    useEffect(() => {
        fetchOrderDetail();
    }, [])

    const fetchOrderDetail = async () => {
        const response = await axios.get('http://localhost:9999/orders/' + id);
        setOrderDetail(response.data.orderDetail);
        setOrder(response.data);
    };

    function getCurrentDateTime() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Thêm số 0 nếu tháng chỉ có 1 chữ số
        const day = String(now.getDate()).padStart(2, '0'); // Thêm số 0 nếu ngày chỉ có 1 chữ số
        const hours = String(now.getHours()).padStart(2, '0'); // Thêm số 0 nếu giờ chỉ có 1 chữ số
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Thêm số 0 nếu phút chỉ có 1 chữ số
        const seconds = String(now.getSeconds()).padStart(2, '0'); // Thêm số 0 nếu giây chỉ có 1 chữ số

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

    const createReview = async (review) => {
        await axios.post('http://localhost:9999/reviews', review);

    };

    const getReviewIdMax = () => {
        let idMax = -1;

        reviewList.forEach(item => {
            if (idMax < item.id) {
                idMax = item.id;
            }
        })

        return idMax;
    }


    const updateProduct = async (product) => {
        await axios.put(`http://localhost:9999/products/${product.id}`, product);
    };


    const handleSubmit = (product, e) => {



        e.preventDefault();



        if (star != -1) {

            let review = {
                "id": getReviewIdMax() + 1,
                "productId": productId,
                "userId": isLogin,
                "orderId": order.id,
                "rating": star,
                "content": content,
                "createdAt": getCurrentDateTime()
            }


            createReview(review);

            let reviewListUpdate = [...reviewList.filter((review) => {
                if(review.productId == productId){
                    return true;
                }
            }), review];

            let starAvg = 0;
            let totalStar = 0;

            for (let i = 0; i < reviewListUpdate.length; i++) {
                totalStar += reviewListUpdate[i].rating;
            }

            starAvg = totalStar / reviewListUpdate.length;

            let productUpdate = getProductById(productId);

            productUpdate.rating = starAvg;

            updateProduct(productUpdate);


            let productListAfterMua = productList.map(pro => {
                if (pro.id == productUpdate.id) {
                    return productUpdate;
                } else {
                    return pro;
                }
            })

            setProductList(productListAfterMua);


            setReviewList([
                ...reviewList,
                review
            ])

            toast.success("Add review success");

            setStar(-1);

            document.getElementById('close-popup').click();
        } else {
            toast.error("Please select number of stars");
        }

    }


    const getFeedbackByUser = (orderId, product, userId) => {

        let isExit = reviewList.find(review => {
            if (review.orderId == orderId && review.productId == product.productId && review.userId == userId) {
                return true;
            }
        })

        return isExit;
    }

    const handleFeedbackDetail = (orderId, product, isLogin) => {

        setProductId(product.productId);

        setReviewDetail(getFeedbackByUser(orderId, product, isLogin));
    }


    return (
        <>
            <Navbar />
            <div className="container my-3 py-3" style={{ minHeight: '605px' }}>
                <h3>Order Detail</h3>


                <Link to={`/myorder/${isLogin}`} className="mt-3 btn btn-success">Back to my order</Link>

                <div className="row mb-3 mt-4">
                    <div className="col-md-4">
                        <h3>Customer</h3>

                        <table>
                            <tr>
                                <td>
                                    <strong>Name:</strong>
                                </td>

                                <td>{getUserByUserId(isLogin)?.username}</td>
                            </tr>


                            <tr>
                                <td>
                                    <strong>Email:</strong>
                                </td>

                                <td>{getUserByUserId(isLogin)?.email}</td>
                            </tr>

                        </table>

                    </div>


                    <div className="col-md-4">
                        <h3>Receiver</h3>

                        <table>
                            <tr>
                                <td>
                                    <strong>Name:</strong>
                                </td>

                                <td>{order.fullName}</td>
                            </tr>


                            <tr>
                                <td>
                                    <strong>Email:</strong>
                                </td>

                                <td>{order.email}</td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>PhoneNumber:</strong>
                                </td>

                                <td>{order.phoneNumber}</td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>Address:</strong>
                                </td>

                                <td>{order.address}</td>
                            </tr>
                        </table>


                    </div>

                    <div className="col-md-4">
                        <h3>Other</h3>

                        <table>
                            <tr>
                                <td>
                                    <strong>OrderId:</strong>
                                </td>

                                <td>#{order.id}</td>
                            </tr>


                            <tr>
                                <td>
                                    <strong>Order date:</strong>
                                </td>

                                <td>{order.createdAt}</td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>Price:</strong>
                                </td>

                                <td>$ {order.price}</td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>Price shipping:</strong>
                                </td>

                                <td>$ {order.shipping}</td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>Status:</strong>
                                </td>

                                <td>{order.status}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <table className="table table-striped table-hover">
                    <thead>
                        <th>STT</th>
                        <th>Image</th>
                        <th>ProductName</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Action</th>
                    </thead>

                    <tbody>
                        {
                            orderDetail.map((product, index) => {

                                return (
                                    <tr key={index}>
                                        <td>#{index + 1}</td>
                                        <td>
                                            <img style={{ width: '80px',  textDecoration: 'none'}} src={getProductById(product.productId)?.image} alt="" />
                                        </td>
                                        <td>
                                            <Link to={`/product/${product.productId}`} style={{color: 'black'}}>
                                            {getProductById(product.productId)?.title}
                                            </Link>
                                        </td>
                                        <td>$ {getProductById(product.productId)?.price}</td>
                                        <td>{product.quantity}</td>
                                        <td>$ {(product.quantity * getProductById(product.productId)?.price).toFixed(2)}</td>
                                        <td>
                                            {
                                                order.status == 'success'
                                                &&
                                                <>
                                                    {/* Button trigger modal */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-success"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#staticBackdrop"
                                                        onClick={() => handleFeedbackDetail(order.id, product, isLogin)}
                                                    >
                                                        {
                                                            getFeedbackByUser(order.id, product, isLogin) != undefined ? 'View feedback' : 'Send feedback'
                                                        }
                                                    </button>
                                                    {/* Modal */}
                                                    <div
                                                        className="modal fade"
                                                        id="staticBackdrop"
                                                        data-bs-backdrop="static"
                                                        data-bs-keyboard="false"
                                                        tabIndex={-1}
                                                        aria-labelledby="staticBackdropLabel"
                                                        aria-hidden="true"
                                                    >
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h5 className="modal-title" id="staticBackdropLabel">
                                                                        Modal title
                                                                    </h5>
                                                                    <button
                                                                        type="button"
                                                                        className="btn-close"
                                                                        data-bs-dismiss="modal"
                                                                        aria-label="Close"
                                                                    />
                                                                </div>
                                                                <div className="modal-body">
                                                                    {
                                                                        reviewDetail == undefined
                                                                            ?
                                                                            <form onSubmit={(e) => { handleSubmit(product, e) }}>

                                                                                <div className="form-group">
                                                                                    <label htmlFor="rating"><strong>Select Rating:</strong></label>
                                                                                    <div className="rating">
                                                                                        <input onClick={() => setStar(5)} type="radio" id="star5" name="rating" defaultValue={5} />
                                                                                        <label htmlFor="star5" />
                                                                                        <input onClick={() => setStar(4)} type="radio" id="star4" name="rating" defaultValue={4} />
                                                                                        <label htmlFor="star4" />
                                                                                        <input onClick={() => setStar(3)} type="radio" id="star3" name="rating" defaultValue={3} />
                                                                                        <label htmlFor="star3" />
                                                                                        <input onClick={() => setStar(2)} type="radio" id="star2" name="rating" defaultValue={2} />
                                                                                        <label htmlFor="star2" />
                                                                                        <input onClick={() => setStar(1)} type="radio" id="star1" name="rating" defaultValue={1} />
                                                                                        <label htmlFor="star1" />
                                                                                    </div>
                                                                                </div>


                                                                                <div className="form-group">
                                                                                    <label htmlFor=""><strong>Content feedback</strong></label>
                                                                                    <textarea onInput={(e) => setContent(e.target.value)} cols="20" rows="5" className="form-control"></textarea>
                                                                                </div>

                                                                                <div className="modal-footer">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-secondary"
                                                                                        data-bs-dismiss="modal"
                                                                                        id="close-popup"
                                                                                    >
                                                                                        Close
                                                                                    </button>
                                                                                    <button type="submit" className="btn btn-primary">
                                                                                        Submit
                                                                                    </button>
                                                                                </div>

                                                                            </form>
                                                                            :
                                                                            <>

                                                                                <strong>Rating: </strong> {reviewDetail.rating}
                                                                                <br />
                                                                                <strong >Content:</strong> {reviewDetail.content}
                                                                                <br />
                                                                                <strong >Date: </strong> {reviewDetail.createdAt}
                                                                            </>
                                                                    }
                                                                </div>


                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            }



                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    )
}

export default OrderDetail;