import { Schema, model } from "mongoose";

const ClassSchema = new Schema({
    title: String,
    description: String,
    startDate: Date,
    endDate: Date,
    moderator: {type: Schema.Types.ObjectId, ref: 'User'},
    students: [{type: Schema.Types.ObjectId, ref: 'User'}],
    likes: [{
        _id:false,
        student: {type: Schema.Types.ObjectId, ref: 'User'},
        date: Date
    }],
    created_at: {type: Date, default: Date.now},
    updated_at: Date,
})

export default model('Class', ClassSchema)