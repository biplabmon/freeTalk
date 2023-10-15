import { Router, Request, Response, NextFunction } from "express";
import Comment from "../../models/comments";
import Post from '../../models/post';
import { BadRequestError } from "../../../common";


const router = Router();

router.delete("/api/comment/:commentId/delete/:postId", async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;

    if (!commentId || !postId) {
        return next(new BadRequestError("post id and comment id are required!"));
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