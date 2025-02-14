import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoShema = new mongoose.Schema({

    videoFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    duration:{
        type:Number,
        required:true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps:true
})

videoShema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoShema)