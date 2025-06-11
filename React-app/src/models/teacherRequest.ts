import { apiClient } from "./apiClient";

export type TeacherRequest = {
    _id: string,
    name: string,
    subject: string,
    experience: string, 
    contact: string,
    createdAt: string,
    createdBy: string;
};


export type AllTeacherPosts = TeacherRequest[];

export async function TeachersPosts(): Promise<AllTeacherPosts> {
    const res = await apiClient.get("/teachers");
   return res.data;
}

 export async function NewTeacherPost(teacherData: Omit<TeacherRequest, '_id' | 'createdAt' | 'createdBy'>): Promise<TeacherRequest> {
     const res = await apiClient.post("/teachers", teacherData);
     return res.data;
 }

 
export const timestampFormater = new Intl.DateTimeFormat("he", {
    timeStyle: "short",
    dateStyle: "short",
});