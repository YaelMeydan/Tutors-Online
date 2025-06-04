import { isAxiosError } from "axios";
import { useRouteError, Navigate, Link } from "react-router";
import { clearToken } from "./models/apiClient";
import { Main } from "./components/Main";

export function HandleAuthorizationError() {
    const error = useRouteError();
    
    if (isAxiosError(error) && error.status === 401) {
        clearToken();
        
        return <Navigate to="/login" />;
    }

    console.error(error);

    return (
        <Main>
            <p>Oops, something went wrong...</p>
            <Link to="/">Back home</Link>
        </Main>
    );
}
