// filepath: c:\INT - Full Stack\REACT - מודול 4\Tutors-Online\React-app\src\pages\TeachersPosts.tsx
import { Link, useLoaderData, useNavigate } from "react-router";
import { Main } from "../components/Main";
import { timestampFormater, type  AllTeacherPosts, type TeacherRequest } from "../models/teacherRequest"; // , TeachersPosts
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { apiClient, getCurrentUserId } from "../models/apiClient";
import { useState, useEffect } from "react";

export function ShowAllTeachersPosts(){
    // Get initial data from the loader
    const initialTeachersPosts = useLoaderData<AllTeacherPosts>(); // Use AllTeacherPosts type

    // Use state to manage the posts currently being displayed
    const [displayedPosts, setDisplayedPosts] = useState<AllTeacherPosts>(initialTeachersPosts); // Use AllTeacherPosts type

     const handleSearch = async () => {
        try {
            const subjectInput = document.querySelector<HTMLInputElement>("#search");
            const subject = subjectInput?.value;

            if (!subject) {
                // If search input is empty, show all initial posts
                setDisplayedPosts(initialTeachersPosts);
                return;
            }

            // Make the API call to filter by subject for teachers
            const res = await apiClient.get<AllTeacherPosts>((`/teachers`), { // Call /teachers endpoint
                params: {
                    subject: subject,
                },
            });

            // Update the state with the filtered data
            setDisplayedPosts(res.data);

        } catch (err) {
            console.error("Error during teacher search:", err);
            alert("Failed to search for teachers by subject.");
        }
    };

    // Optional: Reset displayed posts if initial data changes (e.g., on route change)
    useEffect(() => {
        setDisplayedPosts(initialTeachersPosts);
    }, [initialTeachersPosts]);


    return(
        <Main>
            <h1>All Teachers Posts</h1>
            <div><Link to ={"/new-teacher-form"}>Add a new teacher request ➕</Link></div> {/* Link to new teacher form */}
            <div>
                <Input id="search" type="search" name="search" label="Type the required subject:"/>
                <PrimaryButton onClick={handleSearch}>Search🔎</PrimaryButton>
            </div>
            {/* Render the list using the state variable that gets updated by the search */}
            {/* Pass the current user ID to AllTeacherPosts */}
            <AllTeacherPosts teachersPosts={displayedPosts} currentUserId={getCurrentUserId()}/> {/* Use AllTeacherPosts component */}
        </Main>
    );
}

type AllTeacherPostsProps = {
    teachersPosts: AllTeacherPosts; // Use AllTeacherPosts type
    currentUserId: string | null;
};

function AllTeacherPosts({teachersPosts, currentUserId}: AllTeacherPostsProps) { // Receive teachersPosts
    if (!teachersPosts || teachersPosts.length === 0) {
        return (<p>No teacher requests found.</p>);
    }
    return (
        <ul>
            {teachersPosts
                .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
                .map((teacherRequest) =>
                    <li key={teacherRequest._id}>
                        {/* Pass currentUserId to TeacherPost */}
                        <TeacherPost {...teacherRequest} currentUserId={currentUserId} /> {/* Use TeacherPost component */}
                    </li>
                )}
        </ul>
    );
}

type TeacherPostProps =  TeacherRequest & { // Use TeacherRequest type
    currentUserId: string | null;
};

export function TeacherPost({ _id, createdAt, name, experience, subject, contact, createdBy, currentUserId } :TeacherPostProps) { // Receive experience
     const timestamp = new Date(createdAt);
     const navigate = useNavigate();

     const isOwner = currentUserId && createdBy === currentUserId;

     const handleDelete = async () => {
         if (window.confirm("Are you sure you want to delete this teacher request?")) {
             try {
                 await apiClient.delete(`/teachers/${_id}`); // Delete from /teachers endpoint
                 alert("Teacher request deleted successfully!");
                 navigate(0);
             } catch (error) {
                 console.error("Error deleting teacher request:", error);
                 alert("Failed to delete teacher request.");
             }
         }
     };

     const handleEdit = () => {
         // Navigate to an edit page/form for teachers
         navigate(`/teachers/${_id}/edit`);
     };


     return(
        <article>
            <h2>{subject}</h2>
            <p>{experience}</p> {/* Display experience */}
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