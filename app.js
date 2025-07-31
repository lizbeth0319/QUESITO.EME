import express from "express";
import connectDB from "./config/db.js";
import Authentication from "./routers/authentication.js"
import Role from "./routers/Role.js";
import User from "./routers/User.js" 
import Tasks from "./routers/Task.js";
/*import States from "./routers/States.js" 
import Projects from "./routers/Projects.js" //ya cassi 
import Comment from "./routers/Comment.js"*/
import Category from "./routers/Category.js" 
import "dotenv/config";
const app = express();
const PORT = process.env.PORT;                                                                                                                                                                                                                                                                                                                                                               
app.use(express.json());
app.use(express.static("public"));

app.use('/api', Authentication);
app.use('/api', Role);
app.use('/api', User); 
/* app.use('/api', Tasks);
app.use('/api', States);
app.use('/api', Projects);
app.use('/api', Comment);*/
app.use('/api', Category); 

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http: ${PORT}`);
    connectDB().then(() => {
    }).catch(error => {
        console.error("Failed to start server due to DB connection error:", error);
    });
});

