import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Item } from "../@types";
import { getItemsByCategoryId } from "../api";
import { useItemState } from "../hooks/useItemState";

const Selection = (): JSX.Element => {
    const { id } = useParams();
    const { getItemCount, increaseItemCount, decreaseItemCount } = useItemState();
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        getItemsByCategoryId(id!)
            .then((response: any) => {
                setItems(response.data);
            });
    }, [id]);

    return (
        <div className="grid m-4 gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
                <div className="card border-2" key={item.id}>
                    <div className="card-body items-center text-center">
                        <h2 className="font-bold text-2xl">{item.name}</h2>
                        <span className="pb-5 text-xl">{item.price.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })}</span>
                        <div className="card-actions w-full">
                            <div className="join flex w-full justify-center">
                                <button
                                    className="join-item btn btn-sm rounded-full"
                                    onClick={() => decreaseItemCount(item)}
                                >
                                    -
                                </button>
                                <span className="join-item w-1/3 card card-normal card-bordered justify-center text-center">
                                    {getItemCount(item)}
                                </span>
                                <button
                                    className="join-item btn btn-sm rounded-full"
                                    onClick={() => increaseItemCount(item)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Selection;