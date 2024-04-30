export type Category = {
    id: string;
    name: string;
}

export type Item = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
};

export type OrderItem = {
    name: string;
    category: string;
    quantity: number;
    productId: string;
    unitPrice: {
        amount: number;
        currency: "JPY"
    }
};