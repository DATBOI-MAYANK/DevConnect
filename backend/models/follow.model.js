import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: String,
    },
    followee: {
      type: String,
    },
    status:{
        type:String,
        default:"Pending",
        enum:{
            values:["Pending", "Accepted","Rejected"],
            message:"Status can only be Pending ,Accepted ,Rejected"
        }
    }
  },
  {
    timestamps: true,
  },
);

followSchema.index({ follower: 1, followee: 1 }, { unique: true });

export const Follow = mongoose.model("Follow", followSchema);
