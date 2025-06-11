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
        let studentsPosts;

        if (subject) {
            // If subject query parameter exists, filter by subject
            studentsPosts = await StudentRequest.find({ subject: subject });
        } else {
            // Otherwise, return all students
            studentsPosts = await StudentRequest.find();
        }

        if (!studentsPosts || studentsPosts.length === 0) {
             // It's better to return an empty array with 200 OK for no results
             // rather than 404, as the request itself was successful.
             res.status(200).json([]);
             return;
        }


        res.json(studentsPosts);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
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

