import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  
  UserId:{
      //type: String
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       required:true
  },
  Meetingcode:{
        type:String,
        required:true,
        unique:true   //meeting codes are unique
  },
  Date:{
        type:Date,
        required:true,
        default:Date.now
  }
});

export default mongoose.model("Meeting", meetingSchema);
