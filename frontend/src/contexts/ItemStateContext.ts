import { createContext } from "react";

import { Category, Item } from "../@types";

export type ItemCountMap = Map<string, number>;

export type ItemState = {
    categories: Category[];
    selectedItems: Item[];
    getItemCount: (item: Item) => number;
    increaseItemCount: (item: Item) => void;
    decreaseItemCount: (item: Item) => void;
};
  
export const ItemStateContext = createContext<ItemState>({} as ItemState);