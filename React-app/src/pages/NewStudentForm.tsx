import { useState } from "react";

import { type StudentRequest } from "../models/studentRequest";
import { Main } from "../components/Main";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { apiClient } from "../models/apiClient";
import { useNavigate } from "react-router";

export function NewStudentForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        level: "",
        contact: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post("/students", formData as StudentRequest);
            navigate("/students-posts");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Main>
            <h1>New Student Request</h1>
            <form onSubmit={handleSubmit}>
                <Input id="name" label="Name" name="name" required value={formData.name} onChange={handleChange} />
                <Input id="subject" label="Subject" name="subject" required value={formData.subject} onChange={handleChange} />
                <Input id="level" label="Level (optional)" name="level" value={formData.level} onChange={handleChange} />
                <Input id="contact" label="Contact Information" name="contact" required value={formData.contact} onChange={handleChange} />
                <PrimaryButton>Submit Request</PrimaryButton>
            </form>
        </Main>
    );
}