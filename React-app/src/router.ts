import { createBrowserRouter, redirect } from "react-router";

import { App } from "./App";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { NotFound } from "./pages/NotFound";
import { getToken } from "./models/apiClient";
import { StudentsPosts , StudentsPostsBySubject, NewStudentPost, type NewStudentRequest } from "./models/studentRequest"; 
import { NewStudentForm } from "./pages/NewStudentForm";
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
            { index: true, loader: () => redirect("/students-posts") },
            { path: "*", Component: NotFound },
            {
                path: "/students-posts",
                Component: ShowAllStudentsPosts,
                loader() {
                    return StudentsPosts();
                },
            },
            {
                path: "/students-posts/:subject",
                Component: ShowAllStudentsPosts ,
                loader({ params }) {
                   return StudentsPostsBySubject(params.subject as string);
                },
            },
             {
                path: "/new-student-form",
                Component: NewStudentForm,
                loader() {
                    // Pass an appropriate argument of type NewStudentRequest if needed, or remove the argument if not required
                    // Example with an empty object (replace with actual data as needed):
                    // return NewStudentPost({} as NewStudentRequest);
                    return NewStudentPost({} as NewStudentRequest);
                },
            },           
          ],
    },
]);

function redirectHomeLoggedInUsers() {
    if (getToken()) {
        return redirect("/"); 
    }
}