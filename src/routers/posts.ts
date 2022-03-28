import { Request, Response, Router } from "express";
import { PostModel } from "../models/Post.model";
import { verifyJwtMiddleware } from "../helpers/verifyJwtMiddleware";
import { JwtPayloadModel } from "../models/JwtPayload.model";
import { Post } from "../collections/posts";
import { User } from "../collections/users";

export const postsRouter = Router();

postsRouter.use(verifyJwtMiddleware);

postsRouter.get(
  "/fetch-all-posts",
  async (req: Request, res: Response<PostModel[]>) => {
    try {
      const { userId } = req.user as JwtPayloadModel;
      if (!userId) return res.sendStatus(401);

      const user = await User.findOne(
        { _id: userId },
        { connectedWith: 1, _id: 0 }
      );
      if (!user) {
        return res.sendStatus(400);
      }

      const { connectedWith: userConnections } = user;

      const connectionsPosts = await Post.find({
        userId: { $in: userConnections },
      });
      const userPosts = await Post.find({ userId });

      const concatenatedPosts = connectionsPosts.concat(userPosts);

      res.send(concatenatedPosts);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

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
