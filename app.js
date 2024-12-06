import express from "express";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js"
import fileRoutes from "./routes/file.routes.js"

const app = express();

// Middleware for JSON parsing
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("uploads"));
app.use(cookieParser());

// Routes
app.use('/api/users',userRoutes );
app.use('/api/files', fileRoutes);


// Catch-all route for any undefined routes
app.use('*',(req,res) => {
    res.status(404).send("OPPS!! 404 page not found")
});

export {app}