import { Router } from "express";
import { TeacherRequest } from "../models/teacherRequest";
import { AuthenticatedRequest } from "../auth";

export const router = Router();

router.post("/", async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user || !req.user.sub) {
            res.status(401).send("User not authenticated.");
            return;
        }

        const newTeacherRequest = {
            ...req.body,
            createdBy: req.user.sub
        };

        await TeacherRequest.create(newTeacherRequest);

        res.status(201).end();
    } catch (err) {
        console.error("Error creating teacher request:", err);
        res.status(500).end();
    }
});


router.get("/", async (req: AuthenticatedRequest, res) => {

    try {
        const subject = req.query.subject as string;
        let teachersPosts;

        if (subject) {
            teachersPosts = await TeacherRequest.find({ subject: new RegExp(subject, 'i') });
        } else {
            teachersPosts = await TeacherRequest.find();
        }

        if (!teachersPosts || teachersPosts.length === 0) {
             res.status(200).json([]);
             return;
        }

        res.json(teachersPosts);
    } catch (err) {
        console.error("Error in GET /teachers route:", err);
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

        
        const teacherRequest = await TeacherRequest.findOne({ _id: requestId, createdBy: req.user.sub });

        if (!teacherRequest) {
           
            res.status(404).send("Teacher request not found or you do not have permission to view/edit it.");
            return;
        }

        res.status(200).json(teacherRequest);
    } catch (err) {
        console.error("Error in GET /teachers/:id route:", err);
        
        if (err instanceof Error && err.name === 'CastError') {
             res.status(400).send("Invalid teacher request ID format.");
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


router.put("/:id", async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user || !req.user.sub) {
            res.status(401).send("User not authenticated.");
            return;
        }

        const requestId = req.params.id;
        const updatedData = req.body;

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