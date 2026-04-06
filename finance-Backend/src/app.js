
import express from "express";
import cors from "cors";
import errorHandler from "./utils/errorHandler.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

const app=express();


// allow frontend to call this api from a different port during development
app.use(cors());



app.use(express.json());


//check  quickly confirm server is alive
app.get("/",(req,res)=>{
    //console.log("Root route hit");
    res.json({status:"Server Running"})
})


// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);



// nknown route catch
app.use((req, res) => {
  res.status(404).json({ success: false, message: "route not found", data: null })
})


app.use(errorHandler);

export default app;