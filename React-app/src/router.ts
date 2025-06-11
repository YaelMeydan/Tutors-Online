import { createBrowserRouter, redirect } from "react-router";

import { App } from "./App";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { NotFound } from "./pages/NotFound";
import { getToken, apiClient } from "./models/apiClient";
import { StudentsPosts } from "./models/studentRequest";
import { NewStudentForm } from "./pages/NewStudentForm";
import { ShowAllStudentsPosts } from "./pages/StudentsPosts";
import { HandleAuthorizationError } from "./HandleAuthorizationError";
import { EditStudentForm } from "./pages/EditStudentForm";


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
                path: "/new-student-form",
                Component: NewStudentForm,
            },
            {
                path: "/students/:id/edit",
                Component: EditStudentForm,
                loader: async ({ params }) => {
                    const id = params.id;
                    if (!id) {
                        throw new Error("Student request ID is required for editing.");
                    }
                    try {
                        const res = await apiClient.get(`/students/${id}`);
                        return res.data;
                    } catch (error) {
                        console.error("Error fetching student request for editing:", error);
                        throw new Response("Student request not found or you do not have permission to edit it.", { status: 404 });
                    }
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