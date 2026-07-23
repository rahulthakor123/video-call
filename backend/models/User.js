

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Name:{
      type:String,
      required:true
  },
  Username:{
    type:String,
    required:true
  },
  Password:{
    type:String,
    required:true
  },
  Token:{
     type:String
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  otp:{
    type:String
  },
  resetOtp: {
    type: String,
    default: ""
}

});

export default mongoose.model("User", userSchema);

const meetingSchema = new mongoose.Schema({

  UserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  Meetingcode:{
    type:String,
    required:true
  }

},{
  timestamps:true
});