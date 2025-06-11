import { type TeacherRequest} from "../models/teacherRequest"; 
import { Main } from "../components/Main";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { apiClient } from "../models/apiClient";
import { useNavigate } from "react-router";

export function NewTeacherForm() {
    const navigate = useNavigate();
    const teacherRequest ={} as TeacherRequest; 

    async function Submit(e: React.FormEvent) {
        e.preventDefault();
        const formEntries = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
        teacherRequest.name = formEntries.name as string;
        teacherRequest.subject = formEntries.subject as string;
        teacherRequest.experience = formEntries.experience as string; 
        teacherRequest.contact = formEntries.contact as string;

        try {
            await apiClient.post("/teachers", teacherRequest); 
            alert("Your teacher request has been submitted successfully!");
            navigate("/teachers-posts"); 
        } catch (err) {
            console.error(err);
            alert("Failed to submit teacher request.");
        }
    }

    return(
    <Main>
         <h1>New Teacher Request</h1>
            <form onSubmit={Submit}>
                <Input
                    id="name"
                    label="Name"
                    name="name"
                    required
                />
                <Input
                    id="subject"
                    label="Subject"
                    name="subject"
                    required

                />
                <Input
                    id="experience"
                    label="Experience (optional)"
                    name="experience"
                />
                <Input
                    id="contact"
                    label="Contact"
                    name="contact"
                    required
                />
            <PrimaryButton>Submit Request</PrimaryButton>
            </form>

        </Main>
    );
}