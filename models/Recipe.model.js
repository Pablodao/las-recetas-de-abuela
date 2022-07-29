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
        default: "",  //TODO NOS FALTA URL SEGUN EL TIPO DE CATEGORIA DE PLATO  
    },
    ingredients: [""],
    preparationtime: Number, 
    difficulty: {
        type: String,
        enum:["baja", "media", "alta"]
    },
    category:{
        type: String,
        enum:["Ensalada", "Carne", "Pescado", "Sopa", "Arroces", "Guisos", "Postres"]
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