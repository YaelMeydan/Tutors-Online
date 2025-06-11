import { Router } from "express";
import { StudentRequest } from "../models/studentRequest";
//import { Types } from "mongoose";

export const router = Router();

router.post("/", async (req, res) => {
    try {
        await StudentRequest.create(req.body);

        res.status(201);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
});

router.get("/", async (req, res) => { // Changed _ to req to access query parameters
    try {
        const subject = req.query.subject as string; // Get the subject from query parameters
        console.log("Received query parameter 'subject':", subject); // Log the received subject
        let studentsPosts;

        if (subject) {
            console.log("Filtering by subject:", subject); // Log when filtering is applied
            // If subject query parameter exists, filter by subject using case-insensitive regex
            studentsPosts = await StudentRequest.find({ subject: new RegExp(subject, 'i') });
        } else {
            console.log("No subject query parameter, returning all students."); // Log when returning all
            // Otherwise, return all students
            studentsPosts = await StudentRequest.find();
        }

        if (!studentsPosts || studentsPosts.length === 0) {
             console.log("No student posts found for the query."); // Log if no results
             // It's better to return an empty array with 200 OK for no results
             // rather than 404, as the request itself was successful.
             res.status(200).json([]);
             return;
        }

        console.log(`Found ${studentsPosts.length} student posts.`); // Log the number of results
        res.json(studentsPosts);
    } catch (err) {
        console.error("Error in GET /students route:", err); // Log specific error location
        res.status(500).end(); // Added .end() for consistency
    }
});

// The GET /:subject route is now redundant for the client-side search
// you implemented, as the client uses query parameters. You can keep
// it if it's used elsewhere or remove it if not needed.
// router.get("/:subject", async (req, res) => {
//     try {
//         const studentrequest = await StudentRequest.find({
//             subject: req.params.subject,
//         });
//         if (!studentrequest || studentrequest.length === 0) {
//             res.status(404);
//             res.send(`No posts found for subject ${req.params.subject}`);
//             return;
//         }

//         res.json(studentrequest);

//     } catch (err) {
//         console.error(err);
//         res.status(500);
//         res.end();
//     }
// });

