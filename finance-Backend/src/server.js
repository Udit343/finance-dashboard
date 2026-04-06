
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "../.env" });


const PORT=process.env.PORT || 8000;


// connect to mongo first, then start listening
mongoose.connect(process.env.MONGO_URL)

        .then(()=>{
            console.log("Database Connected");
            app.listen(PORT,()=>{
                console.log(`Server Running on ${PORT}`)
            })
        })
        .catch((err)=>{
            console.log("Mongo connection fail",err.message);
            process.exit(1);
        })