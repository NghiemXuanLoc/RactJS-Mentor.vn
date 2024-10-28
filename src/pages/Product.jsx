import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import { Footer, Navbar } from "../components";
import { toast } from "react-toastify";
import { context } from "../contexts/ProviderLogin";
import axios from "axios";

const Product = () => {
  const { isLogin, getUserByUserId } = useContext(context);
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [reviewList, setReviewList] = useState([]);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    if (isLogin != -1) {
      dispatch(addCart(product));
      toast.success("Add to cart success");
    } else {
      toast.error("Please log in to use this feature!");
    }
  };

  const fetchRevews = async () => {
    const response = await axios.get('http://localhost:9999/reviews');

    let reviewByProduct = response.data.filter((review) => {
      if(review.productId == id){
        return true;
      }
    })
    setReviewList(reviewByProduct);
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`http://localhost:9999/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);

      // ve sau se sua thanh 1 bang category rieng
      // const response2 = await fetch(
      //   `https://fakestoreapi.com/products/category/${data.category}`
      // );
      // const data2 = await response2.json();

      // lay ve tat ca san pham, sau do filter theo category
      const response2 = await fetch("http://localhost:9999/products");

      let data2 = await response2.json();

      data2 = data2.filter(pro => {
        if (data.category == pro.category) {
          return true;
        }
      })
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();

    fetchRevews();
  }, [id]);



  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  console.log("review: ", reviewList);
  

  const ShowProduct = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <img
                className="img-fluid"
                src={product.image}
                alt={product.title}
                width="400px"
                height="400px"
              />
            </div>
            <div className="col-md-6 col-md-6 py-5">
              <h4 className="text-uppercase text-muted">{product.category}</h4>
              <h1 className="display-5">{product.title}</h1>
              <p className="lead">
                {product.rating && product.rating}{" "}
                <i className="fa fa-star"></i>
              </p>
              <div className="d-flex justify-content-between">
                <h3 className="display-6  my-4">${product.price}</h3>
                <p><strong>Quantity stock:</strong> {product.quantityStock}</p>
                <p> <strong>Quantity sold:</strong> {product.quantitySold}</p>
              </div>

              <p className="lead">{product.description}</p>
              <button
                className="btn btn-outline-dark"
                onClick={() => addProduct(product)}
              >
                Add to Cart
              </button>
              <Link to="/cart" className="btn btn-dark mx-3">
                Go to Cart
              </Link>
            </div>

            <div className="row">
              <h3>Reviews <span>({reviewList.length})</span></h3>
              {
                reviewList.map((review) => {
                  return (
                    <div className="mt-2">
                    <p><i className="fa-solid fa-user me-2"></i>{getUserByUserId(review.userId)?.username}</p>
                    <p className="ms-2"><i className="fa-solid fa-calendar-days"></i> {review.createdAt} - <i className="fa-solid fa-star"></i> <span>{review.rating}</span></p>
                    <p className="ms-3">{review.content} </p>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="py-4 my-4">
          <div className="d-flex">
            {similarProducts.map((item) => {
              return (
                <div key={item.id} className="card mx-4 text-center">
                  <img
                    className="card-img-top p-3"
                    src={item.image}
                    alt="Card"
                    height={300}
                    width={300}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {item.title.substring(0, 15)}...
                    </h5>
                  </div>
                  {/* <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">${product.price}</li>
                  </ul> */}
                  <div className="card-body">
                    <Link
                      to={"/product/" + item.id}
                      className="btn btn-dark m-1"
                    >
                      Buy Now
                    </Link>
                    <button
                      className="btn btn-dark m-1"
                      onClick={() => addProduct(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <h2 className="">You may also Like</h2>
            <Marquee
              pauseOnHover={true}
              pauseOnClick={true}
              speed={50}
            >
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
