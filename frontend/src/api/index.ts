import axios from "axios";

import { OrderItem } from "../@types";

axios.defaults.baseURL = import.meta.env.VITE_DATABASE_URL || "";

export const getCategories = () => {
    return axios.get(`/categories`);
}

export const getItems = () => {
    return axios.get(`/items`);
}

export const getItemsByCategoryId = (categoryId: string) => {
    return axios.get(`/items/category/${categoryId}`);
}

export const makePayment = (orderItems: OrderItem[], description: string) => {
    return axios.post(`/payments`, orderItems, {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        params: {
            description: description,
            redirect_url: window.location.origin
        }
    });
}