import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { apiClient, setToken } from "../models/apiClient";
import { Main } from "../components/Main";
import { PrimaryButton } from "../components/PrimaryButton";
import { Input } from "../components/Input";
import { PasswordInput } from "../components/PasswordInput";



export function Login() {
    const [loginError, setLoginError] = useState("")
    const navigate = useNavigate();

    
    async function login(formData: FormData) {
        try {
            const user = Object.fromEntries(formData);
            const res = await apiClient.post("/login", user);

            const { token } = res.data;

            setToken(token);
            navigate("/");
        } catch (err) {
            if (!isAxiosError(err) || err.status !== 401) {
                throw err;
            }

            setLoginError("Email or password doesn't match.");
        }
    }

    return (
        <>
            <nav>
                <Link to="/register">Register</Link>
            </nav>
            <Main >
                <h1>Login</h1>
                <form action={login}>
                    <Input type="email" id="email" label="Email" name="email" required />
                    <PasswordInput id="password" label="Password" name="password" required />
                    <PrimaryButton>Login</PrimaryButton>
                    {loginError && <p>{loginError}</p>}
                </form>
            </Main>
        </>
    );
}