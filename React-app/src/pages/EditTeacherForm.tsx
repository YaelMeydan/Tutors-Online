// filepath: c:\INT - Full Stack\REACT - מודול 4\Tutors-Online\React-app\src\pages\EditTeacherForm.tsx
import { type TeacherRequest} from "../models/teacherRequest"; // Import TeacherRequest type
import { Main } from "../components/Main";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { apiClient } from "../models/apiClient";
import { useNavigate, useLoaderData } from "react-router";
import { useState } from "react";

export function EditTeacherForm() {
    const navigate = useNavigate();
    // Get the initial data from the loader
    const initialTeacherRequest = useLoaderData() as TeacherRequest; // Use TeacherRequest type

    // Use state to manage the form data
    const [formData, setFormData] = useState<TeacherRequest>(initialTeacherRequest); // Use TeacherRequest type

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
            // Send a PUT request to update the teacher request
            await apiClient.put(`/teachers/${formData._id}`, formData); // Put to /teachers endpoint
            alert("Your teacher request has been updated successfully!");
            navigate("/teachers-posts"); // Navigate back to the teachers posts page
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
                        id="experience" // Changed id
                        label="Experience (optional)" // Changed label
                        name="experience" // Changed name
                        value={formData.experience || ''} // Bind value to state (handle optional)
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