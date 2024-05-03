import { ReactNode, useEffect, useState } from "react";

import Navbar from "./Navbar";

import { makePayment } from "../api";
import { OrderItem } from "../@types";
import { useItemState } from "../hooks/useItemState";

const Modal = (props: { open: boolean, message: string }): JSX.Element => {
    return (
        <dialog className={"modal " + (props.open && "modal-open")}>
            <div className="flex items-center gap-2 text-white">
                <span className="loading loading-ring loading-lg" />
                <span className="text-2xl">{props.message}</span>
            </div>
        </dialog>
    );
}

const Layout = (props: { children: ReactNode }): JSX.Element => {
    const { selectedItems, getItemCount } = useItemState();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [totalItemCount, setTotalItemCount] = useState<number>(0);

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("PayPayの準備中です...");

    useEffect(() => {
        setTotalPrice(selectedItems.reduce((sum, item) => sum + item.price * getItemCount(item), 0));
        setTotalItemCount(selectedItems.reduce((sum, item) => sum + getItemCount(item), 0));
    }, [getItemCount, selectedItems]);

    const createQRCode = () => {
        setModalOpen(true);

        const orderItems: OrderItem[] = selectedItems.map((item) => ({
            name: item.name,
            category: item.category,
            quantity: getItemCount(item),
            productId: item.id,
            unitPrice: {
                amount: item.price,
                currency: "JPY",
            }
        }));

        makePayment(orderItems, "熊本高専八代キャンパス売店 - 会計デモ")
            .then((response: any) => {
                window.location.replace(response.data.data.url);
            })
            .catch((error: any) => {
                console.error(error);
                setModalMessage("会計中にエラーが発生しました。管理者に報告をお願いします。")
            });
    }

    return (
        <div className="drawer drawer-end">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                <Navbar totalItemCount={totalItemCount} />
                {props.children}
                <Modal open={modalOpen} message={modalMessage} />
            </div>

            <div className="drawer-side overflow-x-hidden">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 gap-1 w-80 min-h-full bg-base-200">
                    <span className="text-2xl pb-2">購入リスト</span>
                    {selectedItems
                        .map((item) => (
                            <li className="font-bold text-lg" key={item.id}>
                                <div className="flex space-between p-1">
                                    <span className="w-11/12">{item.name}({item.price.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })})</span>
                                    <span>×{getItemCount(item)}</span>
                                </div>
                            </li>
                        ))}
                    <button
                        className={"btn w-11/12 fixed bottom-3 " + (selectedItems.length ? "btn-active" : "btn-disabled")}
                        onClick={() => createQRCode()}
                    >
                        合計金額: {totalPrice.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })}
                    </button>
                </ul>
            </div>
        </div>
    );
}

export default Layout;