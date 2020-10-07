import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AsyncHandler from "express-async-handler";

const protect = AsyncHandler(async (req, res, next) => {
  let token;

  if (
    req.header.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await (await User.findById(decoded.id)).isSelected(
        "-password"
      );
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Errow("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
