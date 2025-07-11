import { type StudentRequest} from "../models/studentRequest";
import { Main } from "../components/Main";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { apiClient } from "../models/apiClient";
import { useNavigate } from "react-router";

export function NewStudentForm() {
    const navigate = useNavigate();
    const studentRequest ={} as StudentRequest;

    async function Submit(e: React.FormEvent) {
        e.preventDefault();
        const formEntries = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
        studentRequest.name = formEntries.name as string;
        studentRequest.subject = formEntries.subject as string;
        studentRequest.level = formEntries.level as string;
        studentRequest.contact = formEntries.contact as string;

        try {
            await apiClient.post("/students", studentRequest);
            alert("Your request has been submitted successfully!");
            navigate("/students-posts");
        } catch (err) {
            console.error(err);
        }
    }

    return(
    <Main>
         <h1>New Student Request</h1>
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
                    id="level"
                    label="Level"
                    name="level"
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