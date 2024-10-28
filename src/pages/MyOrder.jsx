import React, { useState, useEffect, useContext } from "react";
import { Footer, Navbar } from "../components";
import { Link, useParams } from "react-router-dom";
import { context } from "../contexts/ProviderLogin";

import axios from "axios";
import { toast } from "react-toastify";

function MyOrder() {

  const { id } = useParams();

  const { orderList, setOrderList, getProductById, setProductList } = useContext(context);

  let myOrderByUser = orderList.filter(order => {
    if (order.userId == id) {
      return true;
    }
  })

  myOrderByUser.sort((a, b) => {
    // Chuyển đổi chuỗi ngày tháng thành đối tượng Date
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    // Sắp xếp theo thứ tự giảm dần
    return dateB - dateA;
  })

  const updateProduct = async (product) => {
    await axios.put(`http://localhost:9999/products/${product.id}`, product);
  };


  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:9999/products');
    setProductList(response.data);
  };



  const handleCancel = (order) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng không?")) {


      if (order != undefined) {
        for (let i = 0; i < order.orderDetail.length; i++) {
          let productId = order.orderDetail[i].productId;
          let quantity = order.orderDetail[i].quantity;

          let productAfterCancel = getProductById(productId);

          productAfterCancel.quantityStock += quantity;
          productAfterCancel.quantitySold -= quantity;

          updateProduct(productAfterCancel);
        }
      }




      order.status = 'cancel';

      updateOrderStatus(order);

      let orderListAfter = orderList.map(od => {
        if (od.id != order.id) {
          return od;
        } else {
          return order;
        }
      })

      setOrderList(orderListAfter);

      fetchProducts();

      toast.success("Update status success");

    }
  }

  const handleSuccess = (order) => {
    order.status = 'success';

    updateOrderStatus(order);

    let orderListAfter = orderList.map(od => {
      if (od.id != order.id) {
        return od;
      } else {
        return order;
      }
    })

    setOrderList(orderListAfter);

    toast.success("Update status success");
  }

  const updateOrderStatus = async (order) => {
    await axios.put(`http://localhost:9999/orders/${order.id}`, order);

  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3" style={{ minHeight: '605px' }}>
        <h3>Orders</h3>

        <table className="table table-striped table-hover">
          <thead>
            <th>OrderId</th>
            <th>UserId</th>
            <th>FullName</th>
            <th>Email</th>
            <th>PhoneNumber</th>
            <th>Address</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Order date</th>
            <th>Action</th>
          </thead>

          <tbody>
            {
              myOrderByUser.map((order) => {
                return (
                  <tr>
                    <td>#{order.id}</td>
                    <td>{order.userId}</td>
                    <td>{order.fullName}</td>
                    <td>{order.email}</td>
                    <td>{order.phoneNumber}</td>
                    <td>{order.address}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.status}</td>
                    <td>{order.createdAt}</td>
                    <td>



                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Action
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                          <li>
                            <Link to={`/orderdetail/${order.id}`} className="btn btn-sm btn-success mt-2 ms-2">Detail</Link>

                          </li>


                          <li>

                            {
                              order.status == 'pending' && (<button onClick={() => handleCancel(order)} className="btn btn-sm btn-danger mt-2 ms-2">Cancel order</button>)
                            }

                          </li>
                          <li>

                            {
                              order.status == 'pending' && (<button onClick={() => handleSuccess(order)} className="btn btn-sm btn-primary mt-2 ms-2">Payment now</button>)
                            }

                          </li>
                        </ul>
                      </div>

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

export default MyOrder;