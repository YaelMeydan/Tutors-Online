import { createBrowserRouter, redirect } from "react-router";

import { App } from "./App";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { NotFound } from "./pages/NotFound";
import { getToken } from "./models/apiClient";
import { StudentsPosts } from "./models/studentRequest"; //add to import -   , StudentsPostsBySubject
import { ShowAllStudentsPosts } from "./pages/StudentsPosts";
import { HandleAuthorizationError } from "./HandleAuthorizationError";

export const router = createBrowserRouter([
    {
        path: "/login",
        Component: Login,
        loader: redirectHomeLoggedInUsers,
    },
    {
        path: "/register",
        Component: Register,
        loader: redirectHomeLoggedInUsers,
    },
    {
        path: "/",
        Component: App,
        loader: () => {
            if (!getToken()) {
                return redirect("/login");
            }
        },
        ErrorBoundary: HandleAuthorizationError,
        children: [
            { index: true, loader: () => redirect("/StudentsPosts") },
            { path: "*", Component: NotFound },
            {
                path: "/StudentsPosts",
                Component: ShowAllStudentsPosts,
                loader() {
                    return StudentsPosts();
                },
            },
        //  {
        //      path: "/StudentsPosts/:subject",
        //      Component: ,
        //      loader({ params }) {
        //         return StudentsPostsBySubject(params.subject as string);
        //     },
        //  },           
           ],
    },
]);

function redirectHomeLoggedInUsers() {
    if (getToken()) {
        return redirect("/"); 
    }
}