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

router.get("/", async (_, res) => {
    try {
        const studentsPosts = await StudentRequest.find();

        res.json(studentsPosts);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
});
router.get("/:subject", async (req, res) => {
    try {
        const studentrequest = await StudentRequest.find({
            subject: req.params.subject,
        });
        if (!studentrequest || studentrequest.length === 0) {
            res.status(404);
            res.send(`No posts found for subject ${req.params.subject}`);
            return;
        }

        res.json(studentrequest);

    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
});

router.get