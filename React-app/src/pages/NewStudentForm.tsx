import { useState } from "react";
//import {NewStudentPost, type StudentRequest} from "../models/studentRequest";
import { Main } from "../components/Main";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { apiClient } from "../models/apiClient";
import { useNavigate } from "react-router";

export function NewStudentForm() {
    const navigate = useNavigate();

    type StudentFormState = {
        name: string;
        subject: string;
        level: string;
        contact: string;
    };

    const [studentRequest, setStudentRequest] = useState<StudentFormState>({
        name: "",
        subject: "",
        level: "",
        contact: ""
    });

    return(
    <Main>

            <form >
                <Input
                    id="name"
                    label="Name"
                    name="name"
                    required
                    value={studentRequest.name}
                    onChange={e => setStudentRequest({ ...studentRequest, name: e.target.value })}
                />
                <Input
                    id="subject"
                    label="Subject"
                    name="subject"
                    required
                    value={studentRequest.subject}
                    onChange={e => setStudentRequest({ ...studentRequest, subject: e.target.value })}
                />
                <Input
                    id="level"
                    label="Level (optional)"
                    name="level"
                    value={studentRequest.level}
                    onChange={e => setStudentRequest({ ...studentRequest, level: e.target.value })}
                />
                <Input
                    id="contact"
                    label="Contact Information"
                    name="contact"
                    required
                    value={studentRequest.contact}
                    onChange={e => setStudentRequest({ ...studentRequest, contact: e.target.value })}
                />
                <PrimaryButton onClick={async () => {
                try {
                    await apiClient.post("/students", studentRequest);
                    navigate("/students-posts");
                } catch (err) {
                    console.error(err);
                }
            }}>Submit Request</PrimaryButton>
            </form>

        </Main>
    );
}