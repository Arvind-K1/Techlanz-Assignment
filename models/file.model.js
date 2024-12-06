import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    // localPath: { 
    //     type: String 
    // }, // Path to file on local storage
    avatar: { 
        type: String 
    }, // Cloudinary file URL
    cloudinaryId: { 
        type: String 
    }, // Cloudinary ID for deletion
    uploadTimestamp: { 
        type: Date, 
        default: Date.now 
    },
    uploader: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }, // Reference to user
  
});

const File = mongoose.model('File',fileSchema);

export default File;