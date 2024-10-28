import React, { useContext } from "react";
import { Footer, Navbar } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { context } from "../contexts/ProviderLogin";

import axios from "axios";
import { toast } from "react-toastify";
import { clearCart } from "../redux/action";



const schema = yup.object({
  fullName: yup.string().required("fullName is not empty!"),
  email: yup.string().email().required("Email is not empty"),
  phoneNumber: yup.string().required("PhoneNumber is not empty"),
  address: yup.string().required("address is not empty")
})


const Checkout = () => {
  const state = useSelector((state) => state.handleCart);

  const dispatch = useDispatch();

  const { isLogin, orderList, setOrderList, productList, setProductList, getProductById } = useContext(context);

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
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


  const createOrderToDatabase = async (order) => {
    await axios.post('http://localhost:9999/orders', order);

  };

  function generateRandomNumber() {
    let randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Sinh số ngẫu nhiên từ 10000000 đến 99999999
    return randomNumber.toString().substring(0, 8); // Chuyển số thành chuỗi và lấy 8 chữ số đầu tiên
  }

  const checkExitOrder = (orderId) => {
    let isOrder = false;

    orderList.forEach((order) => {
      if (order.id == orderId) {
        isOrder = true;
      }
    })

    return isOrder;
  }

  const generateRandomOrderId = () => {
    let orderId = generateRandomNumber();

    while (checkExitOrder(orderId)) {
      orderId = generateRandomNumber();
    }


    return orderId;
  }


  const updateProduct = async (product) => {
    await axios.put(`http://localhost:9999/products/${product.id}`, product);
  };


  const submit = (data) => {

    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    state.map((item) => {
      return (subtotal += item.price * item.qty);
    });

    state.map((item) => {
      return (totalItems += item.qty);
    });

    let createOrder = getCurrentDateTime();
    let userId = isLogin;

    let orderDetail = [];




    state.forEach((donHang) => {

      let productSeMua = getProductById(donHang.id);

      let quantitySeMua = donHang.qty;

      // cap nhat lai so luong stock sold cua san pham se mua

      productSeMua.quantityStock -= quantitySeMua;
      productSeMua.quantitySold += quantitySeMua;

      // cap nhat trong database
      updateProduct(productSeMua);

      // cap nhat lai productList;

      let productListAfterMua = productList.map(pro => {
        if (pro.id == productSeMua.id) {
          return productSeMua;
        } else {
          return pro;
        }
      })

      setProductList(productListAfterMua);


      let detail = {
        'productId': donHang.id,
        'quantity': donHang.qty
      }

      orderDetail.push(detail);
    })

    let order = {
      "id": generateRandomOrderId(),
      "userId": userId,
      ...data,
      orderDetail,
      "price": Math.round(subtotal),
      "shipping": Math.round(shipping),
      "totalPrice": Math.round(subtotal + shipping),
      "status": "pending",
      "createdAt": createOrder
    }


    // them vao new order vao state
    setOrderList([
      ...orderList,
      order
    ])

    // them new order vao database

    createOrderToDatabase(order);

    toast.success("Order Success");

    // xoa gio hang
    dispatch(clearCart());

    navigate("/");
  }



  const ShowCheckout = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    state.map((item) => {
      return (subtotal += item.price * item.qty);
    });

    state.map((item) => {
      return (totalItems += item.qty);
    });
    return (
      <>
        <div className="container py-5">
          <div className="row my-4">
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})<span>${Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping
                      <span>${shipping}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>${Math.round(subtotal + shipping)}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Billing address</h4>
                </div>
                <div className="card-body">
                  <form className="needs-validation" onSubmit={handleSubmit(submit)}>
                    <div className="row g-3">
                      <div className="col-sm-6 my-1">
                        <label for="firstName" className="form-label">
                          Full name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          placeholder=""
                          {...register('fullName')}
                        />

                        <span className="text-danger">{errors.fullName?.message}</span>

                        <div className="invalid-feedback">
                          Valid first name is required.
                        </div>

                      </div>

                      <div className="col-sm-6 my-1">
                        <label for="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="nghiemxuanloc02@gmail.com"
                          {...register('email')}
                        />

                        <span className="text-danger">{errors.email?.message}</span>

                        <div className="invalid-feedback">
                          Please enter a valid email address for shipping
                          updates.
                        </div>
                      </div>

                      <div className="col-sm-6 my-1">
                        <label for="address" className="form-label">
                          PhoneNumber
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="phoneNumber"
                          placeholder="0337783926"
                          {...register('phoneNumber')}
                        />

                        <span className="text-danger">{errors.phoneNumber?.message}</span>

                        <div className="invalid-feedback">
                          Please enter your shipping address.
                        </div>
                      </div>

                      <div className="col-sm-6 my-1">
                        <label for="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          placeholder="Phú Xuyên Hà Nội"
                          {...register('address')}
                        />
                        <span className="text-danger">{errors.address?.message}</span>

                        <div className="invalid-feedback">
                          Please enter your shipping address.
                        </div>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <h4 className="mb-3">Payment methods</h4>

                    <div className="row gy-3">
                      <p>COD</p>
                    </div>

                    <hr className="my-4" />

                    <button
                      className="w-100 btn btn-primary "
                      type="submit"
                    >
                      Complete order
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };


  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
