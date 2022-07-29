const {Schema, model} = require ("mongoose");

const commentSchema = newSchema(
  {
    name:{
        type:String,
        required: true
    },
    recipe:{
        type: Schema.Type.ObjectId,
        ref: "Recipe"
    },
    creator: {
        type: Schema.Type.ObjectId,
        ref: "User"
    },
  },
  {
    timestamps: true,
  }
);


const Comment = model("Comment" , commentSchema);

module.exports = Comment;