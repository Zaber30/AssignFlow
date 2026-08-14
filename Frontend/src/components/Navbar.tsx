import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (

        <div className="h-16 bg-white shadow flex justify-between items-center px-6">

            <div className="text-2xl font-bold">

                Assignment Management

            </div>

            <div className="flex items-center gap-5">

                <div>

                    <p className="font-semibold">

                        {user?.fullName}

                    </p>

                    <p className="text-gray-500 text-sm">

                        {user?.role}

                    </p>

                </div>

                <button

                    onClick={() => {

                        logout();

                        navigate("/");

                    }}

                    className="bg-red-500 text-white px-4 py-2 rounded"

                >

                    Logout

                </button>

            </div>

        </div>

    );
}