import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware, verifyFirebaseToken } from "./middleware";
import { CreateUserSchema , SigninSchema , CreateRoomSchema} from "@repo/common/types"
import { prismaClient } from "@repo/db/client"
import cors from "cors"
import { adminAuth } from "./lib/firebase-admin";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", verifyFirebaseToken, async (req, res) => {
    const { name , email } = req.body;
    try {
        const user = await prismaClient.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: name || "",
            password : ""
        },
        });
        
        res.json({ userId: user.id });
    } catch (e) {
        res.status(500).json({ message: "Failed to create user in DB" });
    }
});

app.post("/signin" , verifyFirebaseToken , async (req , res) => { 
    const {email , user_id} = (req as any).user;

    try{
        const user = await prismaClient.user.findUnique({
            where: {email}
        })

        res.json({userId : user?.id});
    } catch (e) {
        res.status(500).json({ message: "Failed to find user in DB" });
    }
})

app.post("/auth/google", async (req, res) => {
    const { idToken } = req.body;
  
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
  
      const user = await prismaClient.user.upsert({
        where: { email: decoded.email },
        update: {}, // or update name/photo if needed
        create: {
          email: decoded.email || "",
          name: decoded.name || "No Name",
          password : ""
        },
      });
  
      // Optionally, create your own JWT or session here
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  
      res.json({ token, userId: user.id });
  
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Invalid Google token" });
    }
});
  
app.post("/room" , middleware , async (req , res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    
    if(!parsedData.success){
        res.json({
            message : "Incorrect Inputs"
        })
        return;
    }

    //@ts-ignore : fix this properly usig global ts file something..
    const userId = req.userId;

    try{
        const room = await prismaClient.room.create({
            data : {
                slug : parsedData.data.name,
                adminId : userId 
            }
        })
    
        res.json({
            roomId : room.id
        })

    }catch(e){
        res.status(411).json({
            message : "Error creating room"
        })
    }
})

app.get("/chats/:roomId" , async (req , res) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where :{
            roomId : roomId
        },
        orderBy :{
            id : "desc"
        },
        take: 50
    });

    res.json({
        messages
    })
})

app.get("/room/:slug" , async (req , res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where :{
            slug
        }
    });

    res.json({
        room
    })
})

app.listen(3001);