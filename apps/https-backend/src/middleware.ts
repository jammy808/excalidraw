import { NextFunction , Request , Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { adminAuth } from "./lib/firebase-admin";


export function middleware(req : Request , res: Response , next : NextFunction){

    const token = req.headers["authorization"] ?? "";

    try{
        const decoded = jwt.verify(token , JWT_SECRET);

        if(decoded){
            //@ts-ignore : fix this properly usig global ts file something..
            req.userId = decoded.userId;
            next();
        }else{
            res.status(403).json({ message : "Unauthorized" });
        }

    }catch(e){
        res.status(403).json({ message : "Invalid Token" });
    }

}

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token as string);
    // @ts-ignore - add custom user property
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};