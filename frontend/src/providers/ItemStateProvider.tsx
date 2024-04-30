import { useState, ReactNode, useEffect, useCallback } from "react";

import { Category, Item } from "../@types";
import { getCategories, getItems } from "../api";
import { ItemCountMap } from "../contexts/ItemStateContext";
import { ItemStateContext } from "../contexts/ItemStateContext";

export const ItemStateProvider = (props: { children: ReactNode }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [itemCountMap, setItemCountMap] = useState<ItemCountMap>(new Map());

    const getItemCount = useCallback((item: Item): number => {
        return itemCountMap.get(item.id) ?? 0;
    }, [itemCountMap]);

    const increaseItemCount = useCallback((item: Item): void => {
        setItemCountMap((prevMap) => {
            const prevCount = prevMap.get(item.id);
            if (prevCount === undefined) {
                throw new Error(`Selected item id \`${item.id}\` does not exist`);
            }

            const newMap = new Map(prevMap);
            newMap.set(item.id, Math.min(prevCount + 1, item.quantity));
            return newMap;
        });
    }, []);

    const decreaseItemCount = useCallback((item: Item): void => {
        setItemCountMap((prevMap) => {
            const prevCount = prevMap.get(item.id);
            if (prevCount === undefined) {
                throw new Error(`Selected item id \`${item.id}\` does not exist`);
            }

            const newMap = new Map(prevMap);
            newMap.set(item.id, Math.max(prevCount - 1, 0));
            return newMap;
        });
    }, []);

    useEffect(() => {
        getCategories()
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error(`Error fetching categories: ${error}`);
            });

        getItems()
            .then((response) => {
                response.data = response.data.map((value: any) => ({
                    ...value,
                    category: value.category_id
                }));
                const initialMap = response.data.reduce((mp: ItemCountMap, item: Item) =>
                    mp.set(item.id, 0), new Map()
                );
                setItems(response.data);
                setItemCountMap(initialMap);
            })
            .catch((error) => {
                console.error(`Error fetching items: ${error}`);
            });
    }, []);

    useEffect(() => {
        setSelectedItems(items.filter((item) => getItemCount(item)));
    }, [items, getItemCount, increaseItemCount, decreaseItemCount]);

    const value = {
        categories,
        selectedItems,
        getItemCount,
        increaseItemCount,
        decreaseItemCount,
    };

    return (
        <ItemStateContext.Provider value={value}>
            {props.children}
        </ItemStateContext.Provider>
    );
}