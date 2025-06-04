import { Link, useLoaderData } from "react-router";
import { Main } from "../components/Main";
import { timestampFormater, type AllStudentPosts } from "../models/studentrequest";

export function ShowAllStudentsPosts(){
    const studentsPosts = useLoaderData<AllStudentPosts>();

    return(
        <Main>
            <h1>All Students Posts</h1>
            <Link to ="/NewStudentForm"></Link>
            <AllStudentPosts studentsPosts={studentsPosts}/>
        </Main>

    );
}

type AllStudentPostsProps = {studentsPosts: AllStudentPosts};
function AllStudentPosts({studentsPosts}: AllStudentPostsProps) {
    

    return (
        <ul>
            {studentsPosts
                .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
                .map((studentRequest) => <li key={studentRequest._id}><StudentRequest {...studentRequest} /></li>)}
        </ul>
    );
}

type StudentRequestProps =  AllStudentPosts[number];
function StudentRequest({ createdAt, name, level, subject } :StudentRequestProps) {
     const timestamp = new Date(createdAt);

     return(
        <article>
            <h2>{subject}</h2>
            <p>{level}</p>
            <time dateTime={timestamp.toString()}>{timestampFormater.format(timestamp)}</time>
            <p>{name}</p>
        </article>
     );
}