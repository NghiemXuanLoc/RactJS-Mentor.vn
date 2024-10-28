import React, { useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { context } from "../contexts/ProviderLogin";
import axios from "axios";
// loc



const TopRatingProduct = () => {

    const [data, setData] = useState([]);

    const {productList, setProductList} = useContext(context);


    const getTop3LastProductAll = (data) => {
        let temp = [...data];

        temp.sort((a, b) => {
            if (a.rating != b.rating) {
                return b.rating - a.rating;
            } else {
                return b.id - a.id;
            }
        })


        let top3Product = temp.filter((product, index) => {
            if (index <= 3) {
                return true;
            }
        })


        return top3Product;
    }


    const [filter, setFilter] = useState([]);
    const [loading, setLoading] = useState(false);

    const { isLogin } = useContext(context);

    let componentMounted = true;

    const dispatch = useDispatch();

    const addProduct = (product) => {
        if (isLogin != -1) {
            dispatch(addCart(product))
            toast.success("Add to cart success");
        } else {
            toast.warning("Please log in to use this feature");
        }
    }


    const getProducts = async () => {
        setLoading(true);
        const response = await fetch("  http://localhost:9999/products");
        if (componentMounted) {
            setData(await response.clone().json());
            setFilter(getTop3LastProductAll(await response.json()));
            setLoading(false);
        }

        return () => {
            componentMounted = false;
        };
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:9999/products');
            setData(response.data); // Cập nhật data với dữ liệu từ API
            setFilter(getTop3LastProductAll(response.data)); // Xử lý và cập nhật filter
            setLoading(false);
        } catch (error) {
            //   setError(error); // Xử lý lỗi và cập nhật state error
            console.log(error);

            setLoading(false);
        }
    };

    useEffect(() => {
        // getProducts();
        fetchProducts();
    }, []);

    const Loading = () => {
        return (
            <>
                <div className="col-12 py-5 text-center">
                    <Skeleton height={40} width={560} />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
                    <Skeleton height={592} />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
                    <Skeleton height={592} />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
                    <Skeleton height={592} />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
                    <Skeleton height={592} />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
                    <Skeleton height={592} />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
                    <Skeleton height={592} />
                </div>
            </>
        );
    };

    const filterProduct = (cat) => {
        let updatedList = data.filter((item) => item.category === cat);

        let temp = [...updatedList];

        temp.sort((a, b) => {
            if (a.rating != b.rating) {
                return b.rating - a.rating;
            } else {
                return b.id - a.id;
            }
        })

        let top3Product = temp.filter((product, index) => {
            if (index <= 3) {
                return true;
            }
        })

        setFilter(top3Product);
    }


    const ShowProducts = () => {
        return (
            <>
                <div className="buttons text-center py-5">
                    <button className="btn btn-outline-dark btn-sm m-2" onClick={() => setFilter(getTop3LastProductAll(data))}>All</button>
                    <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("men's clothing")}>Men's Clothing</button>
                    <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("women's clothing")}>
                        Women's Clothing
                    </button>
                    <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("jewelery")}>Jewelery</button>
                    <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("electronics")}>Electronics</button>
                </div>

                {filter.map((product) => {
                    return (
                        <div id={product.id} key={product.id} className="col-md-3 col-sm-6 col-xs-8 col-12 mb-4">
                            <div className="card text-center h-100" key={product.id}>
                                <img
                                    className="card-img-top p-3"
                                    src={product.image}
                                    alt="Card"
                                    height={300}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {product.title.substring(0, 12)}...
                                    </h5>
                                    <p className="card-text">
                                        {product.description.substring(0, 90)}...
                                    </p>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item lead">$ {product.price}</li>
                                    {/* <li className="list-group-item">Dapibus ac facilisis in</li>
                    <li className="list-group-item">Vestibulum at eros</li> */}
                                </ul>
                                <div className="card-body">
                                    <Link to={"/product/" + product.id} className="btn btn-dark m-1">
                                        Buy Now
                                    </Link>
                                    <button className="btn btn-dark m-1" onClick={() => addProduct(product)}>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };
    return (
        <>
            <div className="container my-3 py-3">
                <div className="row">
                    <div className="col-12">
                        <h2 className="display-5 text-center">Top Rating Products</h2>
                        <hr />
                    </div>
                </div>
                <div className="row justify-content-center">
                    {loading ? <Loading /> : <ShowProducts />}
                </div>
            </div>
        </>
    );
};

export default TopRatingProduct;
