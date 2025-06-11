import { Link, useLoaderData, useNavigate } from "react-router";
import { Main } from "../components/Main";
import { timestampFormater, type  AllStudentPosts, type StudentRequest } from "../models/studentRequest";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { apiClient, getCurrentUserId } from "../models/apiClient";
import { useState, useEffect } from "react";

export function ShowAllStudentsPosts(){
    const initialStudentsPosts = useLoaderData<AllStudentPosts>();

    const [displayedPosts, setDisplayedPosts] = useState<AllStudentPosts>(initialStudentsPosts);

     const handleSearch = async () => {
        try {
            const subjectInput = document.querySelector<HTMLInputElement>("#search");
            const subject = subjectInput?.value;

            if (!subject) {
                setDisplayedPosts(initialStudentsPosts);
                return;
            }

            const res = await apiClient.get<AllStudentPosts>((`/students`), {
                params: {
                    subject: subject,
                },
            });

            setDisplayedPosts(res.data);

        } catch (err) {
            console.error("Error during search:", err);
            alert("Failed to search for students by subject.");
        }
    };

    useEffect(() => {
        setDisplayedPosts(initialStudentsPosts);
    }, [initialStudentsPosts]);


    return(
        <Main>
            <h1>All Students Posts</h1>
            <div><Link to ={"/new-student-form"}>Add a new student request ➕</Link></div>
            <div>
                <Input id="search" type="search" name="search" label="Type the required subject:"/>
                <PrimaryButton onClick={handleSearch}>Search🔎</PrimaryButton>
            </div>
            <AllStudentPosts studentsPosts={displayedPosts} currentUserId={getCurrentUserId()}/>
        </Main>
    );
}

type AllStudentPostsProps = {
    studentsPosts: AllStudentPosts;
    currentUserId: string | null; 
};

function AllStudentPosts({studentsPosts, currentUserId}: AllStudentPostsProps) { 
    if (!studentsPosts || studentsPosts.length === 0) {
        return (<p>No student requests found.</p>);
    }
    return (
        <ul>
            {studentsPosts
                .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
                .map((studentRequest) =>
                    <li key={studentRequest._id}>
                        <StudentPost {...studentRequest} currentUserId={currentUserId} />
                    </li>
                )}
        </ul>
    );
}

type StudentPostProps =  StudentRequest & {
    currentUserId: string | null;
};

export function StudentPost({ _id, createdAt, name, level, subject, contact, createdBy, currentUserId } :StudentPostProps) { 
     const timestamp = new Date(createdAt);
     const navigate = useNavigate();

     const isOwner = currentUserId && createdBy === currentUserId;

     const handleDelete = async () => {
         if (window.confirm("Are you sure you want to delete this request?")) {
             try {
                 await apiClient.delete(`/students/${_id}`);
                 alert("Request deleted successfully!");
                 navigate(0);
             } catch (error) {
                 console.error("Error deleting request:", error);
                 alert("Failed to delete request.");
             }
         }
     };

     const handleEdit = () => {
         navigate(`/students/${_id}/edit`);
     };


     return(
        <article>
            <h2>{subject}</h2>
            <p>{level}</p>
            <time dateTime={timestamp.toString()}>{timestampFormater.format(timestamp)}</time>
            <p>{name}</p>
            <p>{contact}</p>
            {isOwner && (
                <div>
                    <PrimaryButton onClick={handleEdit}>Edit</PrimaryButton>
                    <PrimaryButton onClick={handleDelete}>Delete</PrimaryButton>
                </div>
            )}
        </article>
     );
}

