import express from "express";
import { json } from "body-parser";
import cors from "cors";
import { useAuth } from "./auth";
import { router as studentsPostsRouter } from "./routers/studentsPosts";


export const app = express();

app.use(json());

app.use(cors({ origin: 'https://yaelmeydan.github.io/' }));

app.use((req, _, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});

app.use(express.static("public"));

useAuth(app);

app.use("/studentsPosts", studentsPostsRouter);