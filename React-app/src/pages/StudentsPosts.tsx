import { Link, useLoaderData, useNavigate } from "react-router"; // Import useNavigate
import { Main } from "../components/Main";
import { timestampFormater, type  AllStudentPosts, type StudentRequest } from "../models/studentRequest"; // Import StudentRequest type
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { apiClient, getCurrentUserId } from "../models/apiClient"; // Import getCurrentUserId
import { useState, useEffect } from "react";

export function ShowAllStudentsPosts(){
    // Get initial data from the loader
    const initialStudentsPosts = useLoaderData<AllStudentPosts>();

    // Use state to manage the posts currently being displayed
    const [displayedPosts, setDisplayedPosts] = useState<AllStudentPosts>(initialStudentsPosts);

     const handleSearch = async () => { // Renamed for clarity
        try {
            const subjectInput = document.querySelector<HTMLInputElement>("#search");
            const subject = subjectInput?.value;

            if (!subject) {
                // If search input is empty, show all initial posts
                setDisplayedPosts(initialStudentsPosts);
                return;
            }

            // Make the API call to filter by subject
            const res = await apiClient.get<AllStudentPosts>((`/students`), { // Corrected endpoint if filtering is done on /students
                params: {
                    subject: subject,
                },
            });

            // Update the state with the filtered data
            setDisplayedPosts(res.data);

        } catch (err) {
            console.error("Error during search:", err);
            // Optionally, display an error message to the user
            alert("Failed to search for students by subject.");
        }
    };

    // Optional: Reset displayed posts if initial data changes (e.g., on route change)
    useEffect(() => {
        setDisplayedPosts(initialStudentsPosts);
    }, [initialStudentsPosts]);


    return(
        <Main>
            <h1>All Students Posts</h1>
            <div><Link to ={"/new-student-form"}>Add a new student request ➕</Link></div>
            <div>
                <Input id="search" type="search" name="search" label="Type the required subject:"/>
                {/* Attach the search logic to the button's onClick */}
                <PrimaryButton onClick={handleSearch}>Search🔎</PrimaryButton>
            </div>
            {/* Render the list using the state variable that gets updated by the search */}
            {/* Pass the current user ID to AllStudentPosts */}
            <AllStudentPosts studentsPosts={displayedPosts} currentUserId={getCurrentUserId()}/>
        </Main>
    );
}

type AllStudentPostsProps = {
    studentsPosts: AllStudentPosts;
    currentUserId: string | null; // Add currentUserId prop
};

function AllStudentPosts({studentsPosts, currentUserId}: AllStudentPostsProps) { // Receive currentUserId
    if (!studentsPosts || studentsPosts.length === 0) {
        return (<p>No student requests found.</p>);
    }
    return (
        <ul>
            {studentsPosts
                .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
                .map((studentRequest) =>
                    <li key={studentRequest._id}>
                        {/* Pass currentUserId to StudentPost */}
                        <StudentPost {...studentRequest} currentUserId={currentUserId} />
                    </li>
                )}
        </ul>
    );
}

type StudentPostProps =  StudentRequest & { // Use StudentRequest type and add currentUserId
    currentUserId: string | null;
};

export function StudentPost({ _id, createdAt, name, level, subject, contact, createdBy, currentUserId } :StudentPostProps) { // Receive createdBy and currentUserId
     const timestamp = new Date(createdAt);
     const navigate = useNavigate(); // Use useNavigate for editing

     const isOwner = currentUserId && createdBy === currentUserId;

     const handleDelete = async () => {
         if (window.confirm("Are you sure you want to delete this request?")) {
             try {
                 await apiClient.delete(`/students/${_id}`);
                 // Optionally, update the UI by refetching or removing the item from state
                 alert("Request deleted successfully!");
                 // A simple way to refresh is to navigate to the same page
                 navigate(0); // This forces a page reload and loader refetch
             } catch (error) {
                 console.error("Error deleting request:", error);
                 alert("Failed to delete request.");
             }
         }
     };

     const handleEdit = () => {
         // Navigate to an edit page/form
         navigate(`/students/${_id}/edit`);
     };


     return(
        <article>
            <h2>{subject}</h2>
            <p>{level}</p>
            <time dateTime={timestamp.toString()}>{timestampFormater.format(timestamp)}</time>
            <p>{name}</p>
            <p>{contact}</p>
            {isOwner && ( // Conditionally render buttons if the current user is the owner
                <div>
                    <PrimaryButton onClick={handleEdit}>Edit</PrimaryButton>
                    <PrimaryButton onClick={handleDelete}>Delete</PrimaryButton>
                </div>
            )}
        </article>
     );
}

