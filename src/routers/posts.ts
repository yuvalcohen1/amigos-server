import { Request, Response, Router } from "express";
import { PostModel } from "../models/Post.model";
import { verifyJwtMiddleware } from "../helpers/verifyJwtMiddleware";
import { JwtPayloadModel } from "../models/JwtPayload.model";
import { Post } from "../collections/posts";

export const postsRouter = Router();

postsRouter.use(verifyJwtMiddleware);

postsRouter.post(
  "/create-post",
  async (
    req: Request<{}, {}, Partial<PostModel>>,
    res: Response<PostModel | string>
  ) => {
    try {
      const { userId } = req.user as JwtPayloadModel;
      const { content, attachedPhoto } = req.body;
      if (!content) {
        return res.status(400).send("The post content are missing");
      }
      if (!userId) return res.sendStatus(401);

      const post = { userId, content, attachedPhoto };

      const newPost = await Post.create(post);

      res.send(newPost);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);
