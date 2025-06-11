import { Router } from "express";
import { StudentRequest } from "../models/studentRequest";
import { AuthenticatedRequest } from "../auth";

export const router = Router();

router.post("/", async (req: AuthenticatedRequest, res) => { 
    try {
        if (!req.user || !req.user.sub) {
            res.status(401).send("User not authenticated.");
            return;
        }

        const newStudentRequest = {
            ...req.body,
            createdBy: req.user.sub 
        };

        await StudentRequest.create(newStudentRequest);

        res.status(201).end();
    } catch (err) {
        console.error("Error creating student request:", err);
        res.status(500).end();
    }
});

router.get("/", async (req, res) => {
    
    try {
        const subject = req.query.subject as string; 
        let studentsPosts;

        if (subject) {
            studentsPosts = await StudentRequest.find({ subject: new RegExp(subject, 'i') });
        } else {
            studentsPosts = await StudentRequest.find();
        }

        if (!studentsPosts || studentsPosts.length === 0) {
             res.status(200).json([]);
             return;
        }

        res.json(studentsPosts);
    } catch (err) {
        console.error("Error in GET /students route:", err); 
        res.status(500).end(); 
    }
});

router.get("/:id", async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user || !req.user.sub) {
            res.status(401).send("User not authenticated.");
            return;
        }

        const requestId = req.params.id;

        const studentRequest = await StudentRequest.findOne({ _id: requestId, createdBy: req.user.sub });

        if (!studentRequest) {
            res.status(404).send("Student request not found or you do not have permission to view/edit it.");
            return;
        }

        res.status(200).json(studentRequest);
    } catch (err) {
        console.error("Error in GET /students/:id route:", err);
        if (err instanceof Error && err.name === 'CastError') {
             res.status(400).send("Invalid student request ID format.");
        } else {
            res.status(500).end();
        }
    }
});

router.delete("/:id", async (req: AuthenticatedRequest, res) => { 
    try {
        if (!req.user || !req.user.sub) {
            res.status(401).send("User not authenticated.");
            return;
        }

        const requestId = req.params.id;

        const studentRequest = await StudentRequest.findOne({ _id: requestId, createdBy: req.user.sub });

        if (!studentRequest) {
            res.status(404).send("Student request not found or you do not have permission to delete it.");
            return;
        }

        await StudentRequest.deleteOne({ _id: requestId });

        res.status(200).end();
    } catch (err) {
        console.error("Error deleting student request:", err);
        res.status(500).end();
    }
});

router.put("/:id", async (req: AuthenticatedRequest, res) => { 
    try {
        if (!req.user || !req.user.sub) {
            res.status(401).send("User not authenticated.");
            return;
        }

        const requestId = req.params.id;
        const updatedData = req.body;

        const studentRequest = await StudentRequest.findOneAndUpdate(
            { _id: requestId, createdBy: req.user.sub },
            updatedData,
            { new: true } 
        );

        if (!studentRequest) {
            res.status(404).send("Student request not found or you do not have permission to edit it.");
            return;
        }

        res.status(200).json(studentRequest);
    } catch (err) {
        console.error("Error editing student request:", err);
        res.status(500).end();
    }
});

