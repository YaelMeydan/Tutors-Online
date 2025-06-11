import { Link, useLoaderData, useNavigate } from "react-router";
import { Main } from "../components/Main";
import { timestampFormater, type  AllTeacherPosts, type TeacherRequest } from "../models/teacherRequest";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { apiClient, getCurrentUserId } from "../models/apiClient";
import { useState, useEffect } from "react";

export function ShowAllTeachersPosts(){

    const initialTeachersPosts = useLoaderData<AllTeacherPosts>(); 

    const [displayedPosts, setDisplayedPosts] = useState<AllTeacherPosts>(initialTeachersPosts); 

     const handleSearch = async () => {
        try {
            const subjectInput = document.querySelector<HTMLInputElement>("#search");
            const subject = subjectInput?.value;

            if (!subject) {
                setDisplayedPosts(initialTeachersPosts);
                return;
            }

            const res = await apiClient.get<AllTeacherPosts>((`/teachers`), { 
                params: {
                    subject: subject,
                },
            });

            setDisplayedPosts(res.data);

        } catch (err) {
            console.error("Error during teacher search:", err);
            alert("Failed to search for teachers by subject.");
        }
    };


    useEffect(() => {
        setDisplayedPosts(initialTeachersPosts);
    }, [initialTeachersPosts]);


    return(
        <Main>
            <h1>All Teachers Posts</h1>
            <div><Link to ={"/new-teacher-form"}>Add a new teacher request ➕</Link></div>
            <div>
                <Input id="search" type="search" name="search" label="Type the required subject:"/>
                <PrimaryButton onClick={handleSearch}>Search🔎</PrimaryButton>
            </div>
            <AllTeacherPosts teachersPosts={displayedPosts} currentUserId={getCurrentUserId()}/>
        </Main>
    );
}

type AllTeacherPostsProps = {
    teachersPosts: AllTeacherPosts; 
    currentUserId: string | null;
};

function AllTeacherPosts({teachersPosts, currentUserId}: AllTeacherPostsProps) { 
    if (!teachersPosts || teachersPosts.length === 0) {
        return (<p>No teacher requests found.</p>);
    }
    return (
        <ul>
            {teachersPosts
                .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
                .map((teacherRequest) =>
                    <li key={teacherRequest._id}>
                        <TeacherPost {...teacherRequest} currentUserId={currentUserId} /> 
                    </li>
                )}
        </ul>
    );
}

type TeacherPostProps =  TeacherRequest & { 
    currentUserId: string | null;
};

export function TeacherPost({ _id, createdAt, name, experience, subject, contact, createdBy, currentUserId } :TeacherPostProps) { 
     const timestamp = new Date(createdAt);
     const navigate = useNavigate();

     const isOwner = currentUserId && createdBy === currentUserId;

     const handleDelete = async () => {
         if (window.confirm("Are you sure you want to delete this teacher request?")) {
             try {
                 await apiClient.delete(`/teachers/${_id}`);
                 alert("Teacher request deleted successfully!");
                 navigate(0);
             } catch (error) {
                 console.error("Error deleting teacher request:", error);
                 alert("Failed to delete teacher request.");
             }
         }
     };

     const handleEdit = () => {
         
         navigate(`/teachers/${_id}/edit`);
     };


     return(
        <article>
            <h2>{subject}</h2>
            <p>{experience}</p>
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