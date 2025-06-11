import { type TeacherRequest} from "../models/teacherRequest"; 
import { Main } from "../components/Main";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { apiClient } from "../models/apiClient";
import { useNavigate, useLoaderData } from "react-router";
import { useState } from "react";

export function EditTeacherForm() {
    const navigate = useNavigate();
    const initialTeacherRequest = useLoaderData() as TeacherRequest; 

    const [formData, setFormData] = useState<TeacherRequest>(initialTeacherRequest); 

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    async function Submit(e: React.FormEvent) {
        e.preventDefault();

        try {
            await apiClient.put(`/teachers/${formData._id}`, formData);
            alert("Your teacher request has been updated successfully!");
            navigate("/teachers-posts");
        } catch (err) {
            console.error("Error updating teacher request:", err);
            alert("Failed to update teacher request.");
        }
    }

    return(
        <Main>
             <h1>Edit Teacher Request</h1>
                <form onSubmit={Submit}>
                    <Input
                        id="name"
                        label="Name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <Input
                        id="subject"
                        label="Subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                    />
                    <Input
                        id="experience" 
                        label="Experience" 
                        name="experience"
                        value={formData.experience || ''} 
                        onChange={handleInputChange}
                    />
                    <Input
                        id="contact"
                        label="Contact"
                        name="contact"
                        required
                        value={formData.contact}
                        onChange={handleInputChange}
                    />
                <PrimaryButton>Save Changes</PrimaryButton>
                </form>

            </Main>
    );
}