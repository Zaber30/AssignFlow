import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { login as loginApi } from "../../api/authApi";
import type {LoginRequest} from "../../types/LoginRequest.tsx";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginRequest>();

    const onSubmit = async (data: LoginRequest) => {

        setError("");

        try {

            const response = await loginApi(data);
            console.log("Response:", response);

            login(response);

            console.log("After login");

            console.log(response.user.role);

            login(response);

            switch (response.user.role) {
                
                case "Admin":
                    navigate("/admin");
                    break;

                case "Teacher":
                    navigate("/teacher");
                    break;

                case "Student":
                    navigate("/student");
                    break;

                default:
                    navigate("/");
                    break;
            }

        }
        catch (err: any) {

            setError(
                err.response?.data?.message ??
                "Login failed."
            );
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white w-96 rounded-lg shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center mb-8">

                    Assignment Management

                </h1>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >

                    <div>

                        <label>Email</label>

                        <input
                            type="email"
                            className="w-full border rounded p-2 mt-1"
                            {...register("email", {
                                required: "Email is required"
                            })}
                        />

                        <p className="text-red-500 text-sm">

                            {errors.email?.message}

                        </p>

                    </div>

                    <div>

                        <label>Password</label>

                        <input
                            type="password"
                            className="w-full border rounded p-2 mt-1"
                            {...register("password", {
                                required: "Password is required"
                            })}
                        />

                        <p className="text-red-500 text-sm">

                            {errors.password?.message}

                        </p>

                    </div>

                    {

                        error &&

                        <div className="text-red-600">

                            {error}

                        </div>

                    }

                    <button
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >

                        {

                            isSubmitting
                                ? "Logging in..."
                                : "Login"

                        }

                    </button>

                </form>

            </div>

        </div>

    );
}