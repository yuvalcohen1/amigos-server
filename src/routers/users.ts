import bcrypt from "bcrypt";
import { config } from "dotenv";
import { Request, Response, Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import { promisify } from "util";
import { User } from "../collections/users";
import { verifyJwtMiddleware } from "../helpers/verifyJwtMiddleware";
import { RegisterBodyModel } from "../models/RegisterBody.model";
import { UserModel } from "../models/User.model";

config();

const { JWT_SECRET } = process.env;

const promisifiedSign = promisify(jsonwebtoken.sign);

export const usersRouter = Router();

usersRouter.post(
  "/sign-up",
  async (
    req: Request<{}, {}, RegisterBodyModel>,
    res: Response<UserModel | string>
  ) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send("You have missed some body properties");
    }

    try {
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return res.status(400).send("Email is already exist");
      }

      const salt = await bcrypt.genSalt(2);
      const encryptedPassword = await bcrypt.hash(password, salt);

      const user: UserModel = {
        firstName,
        lastName,
        email,
        encryptedPassword,
        profileImg:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDv94lhq4g5u-kKZvmR_zxMJOHDuViXaN0bg&usqp=CAU",
        connections: [],
        isAdmin: 0,
      };

      const newUser = await User.create(user);

      const jwt = await createJwt(user);

      res.cookie("token", jwt, { httpOnly: true, maxAge: 253370764800000 });
      res.send(newUser);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

usersRouter.post(
  "/sign-in",
  async (
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response<UserModel | string>
  ) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("You have missed some properties");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Email and password don't match");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.encryptedPassword
    );
    if (!isPasswordCorrect) {
      return res.status(401).send("Email and password don't match");
    }

    const jwt = await createJwt(user);

    res.cookie("token", jwt, { httpOnly: true, maxAge: 253370764800000 });
    res.send(user);
  }
);

usersRouter.post(
  "/delete-token-cookie",
  verifyJwtMiddleware,
  (req: Request, res: Response) => {
    res.clearCookie("token", { httpOnly: true, maxAge: 253370764800000 });
    res.end();
  }
);

async function createJwt(user: UserModel) {
  return promisifiedSign(JSON.stringify(user), JWT_SECRET!);
}
