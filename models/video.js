const mongoose = require('mongoose')
const fileSchema = new mongoose.Schema({
    video_name: {
        type: String,
        required: true
    },
    video_status: {
        type: String,
        required: true
    },
    video_timestamp: {
        type: Date,
        required: true
    },
    video_file: {
        type: String,
        required: true
    },
    video_path: {
        type: String,
        required: true
    },
    video_size: {
        type: String,
        required: true
    },
    video_uploadby: {
        type: String,
        required: true
    }
})

mongoose.model('Video', fileSchema)