import { useParams, Link } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";

import { useItemState } from "../hooks/useItemState";

const Navbar = (props: { totalItemCount: number }): JSX.Element => {
    const { id } = useParams();
    const { categories } = useItemState();

    return (
        <div className="navbar px-4 bg-red-300">
            <div className="flex-1">
                <img src="/kumamoto-nct_symbol_HR.png"
                    alt="kumamoto-nct_symbol_HR"
                    className="w-[30px] h-[30px] absolute"
                />
                <Link className="btn btn-ghost ml-5 font-semibold text-xl text-white" to="/">
                    熊本高専八代キャンパス売店
                </Link>
            </div>


            <div role="tablist" className="flex-none tabs tabs-bordered gap-1">
                {categories.map((category) => (
                    <Link
                        className={"tab border-gray-50 text-white " + (id === category.id && "tab-active")}
                        role="tab"
                        to={`/cashier/${category.id}/`}
                        key={category.id}
                    >
                        {category.name}
                    </Link>
                ))}
            </div>

            <div className="flex-none">
                <label htmlFor="my-drawer" aria-label="open sidebar" className="btn btn-circle btn-ghost relative">
                    <MdOutlineShoppingCart className="text-2xl" />
                    <span className="badge badge-sm absolute top-1 right-0.5">{props.totalItemCount}</span>
                </label>
            </div>
        </div>
    );
}

export default Navbar;