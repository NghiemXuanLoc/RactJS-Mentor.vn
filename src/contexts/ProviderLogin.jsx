import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const context = createContext();

function ProviderLogin({ children }) {

    const [isLogin, setIsLogin] = useState(-1);

    const [userList, setUserList] = useState([]);

    const [orderList, setOrderList] = useState([]);

    const [productList, setProductList] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [reviewList, setReviewList] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchOrders();
        fetchProducts();
        fetchReviews();
    }, [])

    const fetchUsers = async () => {
        const response = await axios.get('http://localhost:9999/users');
        setUserList(response.data);
    };


    const fetchOrders = async () => {
        const response = await axios.get('http://localhost:9999/orders');
        setOrderList(response.data);
    };

    const fetchProducts = async () => {
        const response = await axios.get('http://localhost:9999/products');
        setProductList(response.data);
    };

    const fetchReviews = async () => {
        const response = await axios.get('http://localhost:9999/reviews');
        setReviewList(response.data);
      };

    const getProductById = (id) => {
        return productList.find(product => {
            if(product.id == id){
                return true;
            }
        })
    }

    const getUserByUserId = (id) => {
        return userList.find(user => {
            if(user.id == id){
                return true;
            }
        })
    }

    let value = {
        isLogin, setIsLogin,
        userList, setUserList,
        orderList, setOrderList,
        productList, setProductList,
        getProductById, getUserByUserId,
        searchTerm, setSearchTerm,
        reviewList, setReviewList
    }
    return (
        <context.Provider value={value}>
            {children}
        </context.Provider>
    )
}

export default ProviderLogin;