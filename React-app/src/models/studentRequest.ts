import { apiClient } from "./apiClient";

export type StudentRequest = {
    _id: string,
    name: string,
    subject: string,
    level?: string,
    contact?: string,
    createdAt: string,
};

export type AllStudentPosts = Omit<StudentRequest, "contact">[];

export async function StudentsPosts(): Promise<AllStudentPosts> {
    const res = await apiClient.get("/studentsPosts");

   return res.data;
}

export async function StudentsPostsBySubject(subject: string): Promise<StudentRequest> {
    const res = await apiClient.get(`/studentsPosts/${subject}`);

    return res.data;
}

export const timestampFormater = new Intl.DateTimeFormat("he", {
    timeStyle: "short",
    dateStyle: "short",
});

