import { Link, useLoaderData } from "react-router";
import { Main } from "../components/Main";
import { timestampFormater, type  AllStudentPosts , type StudentsBySubject} from "../models/studentRequest";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/PrimaryButton";

export function ShowAllStudentsPosts(){
    const studentsPosts = useLoaderData<AllStudentPosts>();
    const studentsPostsSubjects = useLoaderData<StudentsBySubject>()

    return(
        <Main>
            <h1>All Students Posts</h1>
            <div><Link to ="/NewStudentForm">Add a new student request ➕</Link></div>
            <div>
            <Input id="search" type="search" name="Type the required subject to search:" label="search"/>
            <PrimaryButton onClick= {() =>{
            <StudentsBySubject studentsPostsSubjects={studentsPostsSubjects}/>
            }}>🔎</PrimaryButton>
            </div>
            <AllStudentPosts studentsPosts={studentsPosts}/>
        </Main>

    );
}

type AllStudentPostsProps = {studentsPosts: AllStudentPosts};
function AllStudentPosts({studentsPosts}: AllStudentPostsProps) {
    if (studentsPosts.length === 0) {
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

type StudentsBySubjectProps = {studentsPostsSubjects: StudentsBySubject};
export function StudentsBySubject({studentsPostsSubjects}: StudentsBySubjectProps) {
    if (studentsPostsSubjects.length === 0) {
        return (<p>No students requests found for this subject.</p>);
    }
    return (
        <ul>
            {studentsPostsSubjects
                .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
                .map((studentRequest) => <li key={studentRequest._id}><StudentPost {...studentRequest} /></li>)}
        </ul>
    );
}

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

