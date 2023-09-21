import { Router, Request, Response, NextFunction } from "express";
import Post from '../../models/post';


const router = Router();

router.post("/api/post/update/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { content, title } = req.body;

    if (!id) {
        const error = new Error("post id is required") as CustomeError;
        error.status = 400;
        next(error);
    };

    let updatePost;

    try {
        updatePost = await Post.findOneAndUpdate(
            { _id: id },
            { $set: { content, title } },
            { new: true }
        );
    } catch (err) {
        const error = new Error("post cannot be updated!") as CustomeError
        error.status = 400;
        next(error)
    };

    res.status(200).send(updatePost);

});


export { router as updatePostRouter };