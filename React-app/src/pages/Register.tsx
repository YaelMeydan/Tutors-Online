import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiClient, setToken } from "../models/apiClient";
import { Main } from "../components/Main";
import { PrimaryButton } from "../components/PrimaryButton";
import { Input } from "../components/Input";
import { PasswordInput } from "../components/PasswordInput";

//import styles from "./Register.module.scss";
import { isAxiosError } from "axios";

export function Register() {
    const [registerError, setRegisterError] = useState("");
    const navigate = useNavigate();

    async function register(formData: FormData) {
        try {
            const user = Object.fromEntries(formData);
            const res = await apiClient.post("/register", user);

            const { token } = res.data;

            setToken(token);
            navigate("/");
        } catch (err) {
            if (!isAxiosError(err) || err.status !== 409) {
                throw err;
            }

            setRegisterError("Email already taken.");
        }
    }

    return (
        <>
            <nav>
                <Link to="/login">Login</Link>
            </nav>
            <Main fitContent>
                <h1>Register</h1>
                <form action={register}>
                    <Input type="email" id="email" label="Email" name="email" required />
                    <Input id="fullName" label="Full name" name="fullName" required />
                    <SetPasswordField />
                    <PrimaryButton>Register</PrimaryButton>
                    {registerError && <p>{registerError}</p>}
                </form>
            </Main>
        </>
    );
}

function SetPasswordField() {
    const [password, setPassword] = useState("");

    return (
        <>
            <PasswordInput
                id="password"
                label="Password"
                name="password"
                minLength={8}
                required
                onInput={(e) => setPassword(e.currentTarget.value)}
                value={password}
            />
             <p>Password must be 8 characters long and contain at least:</p>
             <p>1 lowercase letter, 1 uppercase letter and 1 digit</p>
            
        </>
    );
}