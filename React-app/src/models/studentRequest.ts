import { apiClient } from "./apiClient";

export type StudentRequest = {
    _id: string,
    name: string,
    subject: string,
    level?: string,
    contact: string,
    createdAt: string,
};

export type AllStudentPosts = StudentRequest[];
export async function StudentsPosts(): Promise<AllStudentPosts> {
    const res = await apiClient.get("/students");

   return res.data;
}

export type NewStudentRequest = StudentRequest[];
export async function NewStudentPost(): Promise<NewStudentRequest> {
    const res = await apiClient.get("/students")
   
    return res.data;
}

export const timestampFormater = new Intl.DateTimeFormat("he", {
    timeStyle: "short",
    dateStyle: "short",
});

