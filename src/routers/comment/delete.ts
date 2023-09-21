import { Router, Request, Response, NextFunction } from "express";
import Comment from "../../models/comments";
import Post from '../../models/post';


const router = Router();

router.delete("/api/comment/:commentId/delete/:postId", async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;

    if (!commentId || !postId) {
        const error = new Error("post id and comment id are required!") as CustomeError;
        error.status = 400;
        next(error);
    };

    try {
        await Comment.findOneAndRemove({ _id: commentId });
    } catch (error) {
        next(new Error("comment cannot be updated!"))
    };

    await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { comments: commentId } }
    );

    res.status(200).json({ message: true })
});


export { router as deleteCommentRouter };