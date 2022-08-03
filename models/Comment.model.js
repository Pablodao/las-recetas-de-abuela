const {Schema, model} = require ("mongoose");

const commentSchema = new Schema (
  {
    name:{
        type:String,
        required: true
    },
    recipe:{
        type: Schema.Types.ObjectId,
        ref: "Recipe"
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
  },
  {
    timestamps: true,
  }
);


const Comment = model("Comment" , commentSchema);

module.exports = Comment;