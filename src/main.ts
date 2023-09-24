import * as dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieSession from 'cookie-session';
import {
    newPostRouter,
    deletePostRouter,
    updatePostRouter,
    showPostRouter,

    newCommentRouter,
    deleteCommentRouter,


} from './routers';
import { currentUser, requireAuth } from '../common';


const app = express();

app.use(cors({
    origin: "*",
    optionsSuccessStatus: 200
}));

app.set("tust proxy", true);

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: false
}));

app.use(currentUser);

app.use(requireAuth, newPostRouter);
app.use(requireAuth, deletePostRouter);
app.use(requireAuth, updatePostRouter);
app.use(showPostRouter);

app.use(requireAuth, newCommentRouter);
app.use(requireAuth, deleteCommentRouter);

app.all('*', (req, res, next) => {
    const error = new Error('not found!') as CustomeError;
    error.status = 404;
    next(error);
});

declare global {
    interface CustomeError extends Error {
        status?: number
    }
};

app.use((error: CustomeError, req: Request, res: Response, next: NextFunction): any => {
    if (error.status) {
        return res.status(error.status).json({ message: error.message })
    }

    res.status(500).json({ message: "something went wrong" })
});

const start = async () => {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");

    if (!process.env.JWT_KEY) throw new Error("JWT_KEY is required");

    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        throw new Error('database error')
    };

    app.listen(8080, () => {
        console.log("server is up and running on port 8080")
    });
};

start();
