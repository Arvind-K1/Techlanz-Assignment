import mongoose from "mongoose";

// Disable strict query mode to allow querying with fields not defined in the schema
mongoose.set("strictQuery", false);

// Function to connect to MongoDB database using Mongoose
const connectToDb = async () => {
    try {
        const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB Connection Failed",error);

        // Exit the process with failure (non-zero status) if the connection is unsuccessful
        process.exit(1);
    }
};

export default connectToDb;