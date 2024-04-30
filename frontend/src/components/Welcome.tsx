import { useNavigate } from "react-router-dom";

const Welcome = (): JSX.Element => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[90vh] gap-8 flex flex-col justify-center text-center">
            <h1 className="md:text-5xl sm:text-4xl text-2xl font-semibold">売店へようこそ！</h1>

            <div className="text-center">
                <button
                    className="btn btn-outline"
                    type="submit"
                    onClick={() => navigate("/cashier/bread/")}
                >
                    会計スタート
                </button>
            </div>
        </div>
    );
}

export default Welcome;