import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import { connectDB } from "./utils/db.js"; 

// routes
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"

const app = express();
dotenv.config({});

// app.get("/",(req,res)=>req.cookies))

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended : true}));
const corsOptions = {
    origin : 'http://localhost:5173',
    credentials : true
}
app.use(cors(corsOptions));

// API's
// app.get("/api/v1/user",(_,res)=>res.send("hello user"))
app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);


const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    connectDB();
    console.log("Listening to port ",PORT)
});
 