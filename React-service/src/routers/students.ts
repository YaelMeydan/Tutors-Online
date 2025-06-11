import { Router } from "express";
import { StudentRequest } from "../models/studentRequest";
// Assuming your auth middleware adds user info to req.user
import { AuthenticatedRequest } from "../auth"; // You might need to define this type

export const router = Router();

// Update the POST route to include the createdBy user ID
router.post("/", async (req: AuthenticatedRequest, res) => { // Use AuthenticatedRequest type
    try {
        // Ensure req.user exists and has an _id
        if (!req.user || !req.user.sub) {
            res.status(401).send("User not authenticated.");
            return;
        }

        const newStudentRequest = {
            ...req.body,
            createdBy: req.user.sub // Add the ID of the logged-in user
        };

        await StudentRequest.create(newStudentRequest);

        res.status(201).end();
    } catch (err) {
        console.error("Error creating student request:", err);
        res.status(500).end();
    }
});

router.get("/", async (req, res) => {// Changed _ to req to access query parameters
    console.log("GET /students route called"); 
    
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

// Add DELETE route for a specific student request
router.delete("/:id", async (req: AuthenticatedRequest, res) => { // Use AuthenticatedRequest type
    try {
        // Ensure req.user exists and has an _id
        if (!req.user || !req.user.sub) {
            res.status(401).send("User not authenticated.");
            return;
        }

        const requestId = req.params.id;

        // Find the request and check if the logged-in user is the creator
        const studentRequest = await StudentRequest.findOne({ _id: requestId, createdBy: req.user.sub });

        if (!studentRequest) {
            // If not found or user is not the creator, return 404 or 403
            res.status(404).send("Student request not found or you do not have permission to delete it.");
            return;
        }

        await StudentRequest.deleteOne({ _id: requestId });

        res.status(200).end(); // Or 204 No Content
    } catch (err) {
        console.error("Error deleting student request:", err);
        res.status(500).end();
    }
});

// Add PUT route for editing a specific student request
router.put("/:id", async (req: AuthenticatedRequest, res) => { // Use AuthenticatedRequest type
    try {
        // Ensure req.user exists and has an _id
        if (!req.user || !req.user.sub) {
            res.status(401).send("User not authenticated.");
            return;
        }

        const requestId = req.params.id;
        const updatedData = req.body;

        // Find the request and check if the logged-in user is the creator
        const studentRequest = await StudentRequest.findOneAndUpdate(
            { _id: requestId, createdBy: req.user.sub },
            updatedData,
            { new: true } // Return the updated document
        );

        if (!studentRequest) {
             // If not found or user is not the creator, return 404 or 403
            res.status(404).send("Student request not found or you do not have permission to edit it.");
            return;
        }

        res.status(200).json(studentRequest);
    } catch (err) {
        console.error("Error editing student request:", err);
        res.status(500).end();
    }
});

