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
    addImagesRouter,
    deleteImagesRouter,

    newCommentRouter,
    deleteCommentRouter,

    currentUserRouter,
    signinRouter,
    signoutRouter,
    signupRouter

} from './routers';
import { currentUser, requireAuth, errorHandler, NotFoundError} from '../common';


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

app.use(signupRouter);
app.use(signinRouter);
app.use(currentUserRouter);
app.use(signoutRouter);

app.use(requireAuth, newPostRouter);
app.use(requireAuth, deletePostRouter);
app.use(requireAuth, updatePostRouter);
app.use(requireAuth, addImagesRouter);
app.use(requireAuth, deleteImagesRouter);
app.use(showPostRouter);

app.use(requireAuth, newCommentRouter);
app.use(requireAuth, deleteCommentRouter);

app.all('*', (req, res, next) => {
    next(new NotFoundError());
});

app.use(errorHandler);

const start = async () => {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");

    if (!process.env.JWT_KEY) throw new Error("JWT_KEY is required");

    try {
        // await mongoose.connect(process.env.MONGO_URI);
        await mongoose.connect("mongodb+srv://biplab8629:Uwot4pyr8pg5z3EO@cluster0.figyznm.mongodb.net/?retryWrites=true&w=majority");

    } catch (error) {
        throw new Error('database error')
    };

    app.listen(8080, () => {
        console.log("server is up and running on port 8080")
    });
};

start();
