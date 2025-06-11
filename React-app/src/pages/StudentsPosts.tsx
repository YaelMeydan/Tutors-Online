import { Link, useLoaderData } from "react-router";
import { Main } from "../components/Main";
import { timestampFormater, type  AllStudentPosts } from "../models/studentRequest";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";
import { apiClient } from "../models/apiClient";
import { useState, useEffect } from "react"; // Import useState and useEffect

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
            <AllStudentPosts studentsPosts={displayedPosts}/>
            {/* Remove the incorrect rendering of StudentsBySubject here */}
            {/* <StudentsBySubject studentsPostsSubjects={studentsPostsSubjects}/> */}
        </Main>
    );
}

type AllStudentPostsProps = {studentsPosts: AllStudentPosts};
function AllStudentPosts({studentsPosts}: AllStudentPostsProps) {
    if (!studentsPosts || studentsPosts.length === 0) { // Added check for null/undefined
        return (<p>No student requests found.</p>);
    }
    return (
        <ul>
            {studentsPosts
                .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
                .map((studentRequest) => <li key={studentRequest._id}><StudentPost {...studentRequest} /></li>)}
        </ul>
    );
}

// The StudentsBySubject component seems redundant if AllStudentPosts is used for filtered results.
// You can keep it if it serves a different purpose or remove it if not needed.
// type StudentsBySubjectProps = {studentsPostsSubjects: StudentsBySubject};
// export function StudentsBySubject({studentsPostsSubjects}: StudentsBySubjectProps) {
//     if (studentsPostsSubjects.length === 0) {
//         return (<p>No students requests found for this subject.</p>);
//     }
//     return (
//         <ul>
//             {studentsPostsSubjects
//                 .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
//                 .map((studentRequest) => <li key={studentRequest._id}><StudentPost {...studentRequest} /></li>)}
//         </ul>
//     );
// }

type StudentPostProps =  AllStudentPosts[number];
export function StudentPost({ createdAt, name, level, subject, contact } :StudentPostProps) {
     const timestamp = new Date(createdAt);

     return(
        <article>
            <h2>{subject}</h2>
            <p>{level}</p>
            <time dateTime={timestamp.toString()}>{timestampFormater.format(timestamp)}</time>
            <p>{name}</p>
            <p>{contact}</p>
        </article>
     );
}

