import { Request, Response, Router } from "express";
import { Post } from "../collections/posts";
import { verifyJwtMiddleware } from "../helpers/verifyJwtMiddleware";
import { PostModel } from "../models/Post.model";
import { UserModel } from "../models/User.model";

export const postsRouter = Router();

postsRouter.use(verifyJwtMiddleware);

postsRouter.get(
  "/fetch-all-posts",
  async (req: Request, res: Response<PostModel[]>) => {
    try {
      const user = req.user as UserModel;
      if (!user) {
        return res.sendStatus(401);
      }

      const { connections: userConnections } = user;

      const connectionsPosts = await Post.find({
        userId: { $in: userConnections },
      }).populate("userId");

      const userPosts = await Post.find({ userId: user._id }).populate(
        "userId"
      );

      const concatenatedPosts = connectionsPosts.concat(userPosts);
      console.log(concatenatedPosts);

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
      const { _id: userId } = req.user as UserModel;
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
