import { useContext } from "react";

import { ItemStateContext } from "../contexts/ItemStateContext";

export const useItemState = () => {
    const context = useContext(ItemStateContext);
    if (!context) {
        throw new Error("`useItemState` must be used within a `ItemStateProvider`");
    }
    
    return context;
};