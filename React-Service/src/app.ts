import express from "express";
import { json } from "body-parser";
import cors from "cors";
import { useAuth } from "./auth";
import { router as studentsRouter } from "./routers/students";


export const app = express();

app.use(cors());

app.use((req, _, next) => {
    console.log(new Date(), req.method, req.url, "yael");
    next();
});

app.use(json());

app.use(express.static("public"));

useAuth(app);

app.use("/students", studentsRouter);

