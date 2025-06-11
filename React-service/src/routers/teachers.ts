// filepath: c:\INT - Full Stack\REACT - מודול 4\Tutors-Online\React-service\src\routers\teachers.ts
import { Router } from "express";
import { TeacherRequest } from "../models/teacherRequest"; // Import TeacherRequest
import { AuthenticatedRequest } from "../auth";

export const router = Router();

// POST route for creating a new teacher request
router.post("/", async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user || !req.user.sub) {
            res.status(401).send("User not authenticated.");
            return;
        }

        const newTeacherRequest = {
            ...req.body,
            createdBy: req.user.sub // Add the ID of the logged-in user
        };

        await TeacherRequest.create(newTeacherRequest);

        res.status(201).end();
    } catch (err) {
        console.error("Error creating teacher request:", err);
        res.status(500).end();
    }
});

// GET route for fetching teacher requests (with optional subject filter)
router.get("/", async (req: AuthenticatedRequest, res) => {
    console.log("GET /teachers route called");

    try {
        const subject = req.query.subject as string;
        console.log("Received query parameter 'subject':", subject);
        let teachersPosts;

        if (subject) {
            console.log("Filtering by subject:", subject);
            // Filter by subject using case-insensitive regex
            teachersPosts = await TeacherRequest.find({ subject: new RegExp(subject, 'i') });
        } else {
            console.log("No subject query parameter, returning all teachers.");
            // Return all teachers
            teachersPosts = await TeacherRequest.find();
        }

        if (!teachersPosts || teachersPosts.length === 0) {
             console.log("No teacher posts found for the query.");
             res.status(200).json([]);
             return;
        }

        console.log(`Found ${teachersPosts.length} teacher posts.`);
        res.json(teachersPosts);
    } catch (err) {
        console.error("Error in GET /teachers route:", err);
        res.status(500).end();
    }
});

// DELETE route for a specific teacher request
router.delete("/:id", async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user || !req.user.sub) {
            res.status(401).send("User not authenticated.");
            return;
        }

        const requestId = req.params.id;

        // Find the request and check if the logged-in user is the creator
        const teacherRequest = await TeacherRequest.findOne({ _id: requestId, createdBy: req.user.sub });

        if (!teacherRequest) {
            res.status(404).send("Teacher request not found or you do not have permission to delete it.");
            return;
        }

        await TeacherRequest.deleteOne({ _id: requestId });

        res.status(200).end();
    } catch (err) {
        console.error("Error deleting teacher request:", err);
        res.status(500).end();
    }
});

// PUT route for editing a specific teacher request
router.put("/:id", async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user || !req.user.sub) {
            res.status(401).send("User not authenticated.");
            return;
        }

        const requestId = req.params.id;
        const updatedData = req.body;

        // Find the request and check if the logged-in user is the creator
        const teacherRequest = await TeacherRequest.findOneAndUpdate(
            { _id: requestId, createdBy: req.user.sub },
            updatedData,
            { new: true }
        );

        if (!teacherRequest) {
             res.status(404).send("Teacher request not found or you do not have permission to edit it.");
            return;
        }

        res.status(200).json(teacherRequest);
    } catch (err) {
        console.error("Error editing teacher request:", err);
        res.status(500).end();
    }
});