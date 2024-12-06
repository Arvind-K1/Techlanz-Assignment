import connectToDb from "./config/db.js";
import { app } from "./app.js"
import { configDotenv } from "dotenv";
configDotenv({
    path: './.env'
})

connectToDb()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })