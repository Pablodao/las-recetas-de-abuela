const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    avatar: {
      type: String,
      enum:["/images/avatar1.jpg", "/images/avatar2.jpg", "/images/avatar3.jpg", "/images/avatar4.jpg"],
      //default:"/images/avatar1.jpg"  
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum:["user", "admin"],
      default: "user"
    },
    category:{
      type:String,
      enum:["ayudante de cocina", "cocinero", "chef"],
      default: "ayudante de cocina"
    },
    email:{
      type: String,
      required: true,
      unique: true
    },
    isbloqued: Boolean,
    favourites:[{
      type: Schema.Types.ObjectId,
      ref: "Recipe"
    }],
    comments: [""],
    score: Number
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
