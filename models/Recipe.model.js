const { Schema, model } = require("mongoose");

const recipeSchema = new Schema (
  {
    name:{
        type:String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },  
    image : {
        type:String,
        default: "",  //TODO NOS FALTA URL 
    },
    ingredients: [""],
    preparationtime: Number, 
    difficulty: {
        type: String,
        enum:["baja", "media", "alta"]
    },
    category:{
        type: String,
        enum:["Ensalada", "Carne", "Pescado", "Postres", "Sopa", "Arroces", "Guisos"]
    },
    creator: {
        type: Schema.Type.ObjectId,
        ref: "User"
    }
  },
  {
    timestamps: true,
  }
);




const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;