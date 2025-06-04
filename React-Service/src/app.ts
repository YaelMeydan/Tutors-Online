import express from "express";
import { json } from "body-parser";
import cors from "cors";
import { useAuth } from "./auth";
import { router as studentsPostsRouter } from "./routers/studentsPosts";


export const app = express();

app.use(cors());

app.use((req, _, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});
 
app.use(json());

app.use(express.static("public"));

useAuth(app);

app.use("/studentsPosts", studentsPostsRouter);