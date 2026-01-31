import jwt from "jsonwebtoken";
const { TokenExpiredError } = jwt;

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

});

export default mongoose.model("User", userSchema);