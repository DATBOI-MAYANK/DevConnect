import mongoose from "mongoose";

const eventsSchema = new mongoose.Schema({
  title: {
    type: String,
    required:true,
  },
  url: {
    type: String,
    required: true,
    unique:true,
  },
  location: {
    city:String,
    country: String,
    online:Boolean,

  },
  startDate: {
    type: Date,
    required:true,
  },
  endDate : Date,
  tags: [{type:String,index:true}]
},{timestamps:true})

export const Events = mongoose.model("Events",eventsSchema)
