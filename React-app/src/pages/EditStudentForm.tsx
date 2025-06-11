
import { type StudentRequest} from "../models/studentRequest";
import { Main } from "../components/Main";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { apiClient } from "../models/apiClient";
import { useNavigate, useLoaderData } from "react-router"; 
import { useState } from "react"; 

export function EditStudentForm() {
    const navigate = useNavigate();
    
    const initialStudentRequest = useLoaderData() as StudentRequest;

    const [formData, setFormData] = useState<StudentRequest>(initialStudentRequest);

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
            
            await apiClient.put(`/students/${formData._id}`, formData);
            alert("Your request has been updated successfully!");
            navigate("/students-posts"); 
        } catch (err) {
            console.error("Error updating student request:", err);
            alert("Failed to update request.");
        }
    }

    return(
        <Main>
             <h1>Edit Student Request</h1>
                <form onSubmit={Submit}>
                    <Input
                        id="name"
                        label="Name"
                        name="name"
                        required
                        value={formData.name} // Bind value to state
                        onChange={handleInputChange} // Handle input changes
                    />
                    <Input
                        id="subject"
                        label="Subject"
                        name="subject"
                        required
                        value={formData.subject} // Bind value to state
                        onChange={handleInputChange} // Handle input changes
                    />
                    <Input
                        id="level"
                        label="Level (optional)"
                        name="level"
                        value={formData.level || ''} // Bind value to state (handle optional)
                        onChange={handleInputChange} // Handle input changes
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