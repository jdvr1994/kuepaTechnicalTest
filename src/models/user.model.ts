import { Schema, model } from "mongoose";
import {ADMIN_AUTHORIZATION, MODERATOR_AUTHORIZATION, STUDENT_AUTHORIZATION} from "../config"

const UserSchema = new Schema({
    type: {type: String, enum: [ADMIN_AUTHORIZATION,MODERATOR_AUTHORIZATION,STUDENT_AUTHORIZATION]},
    names: String,
    lastNames: String,
    userName: {type: String, unique: true, required: true},
    password: {type:String, select:false, required: true},
    phone: String,
    created_at: {type: Date, default: Date.now},
    updated_at: Date,
    login_at: [{type: Date}]
})

export default model('User', UserSchema)