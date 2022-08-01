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
        enum:["Baja", "Media", "Alta"]
    },
    category:{
        type: String,
        enum:["Ensalada", "Carne", "Pescado", "Sopa", "Arroces","Pastas", "Guisos", "Postres"]
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isfavorite:{ 
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);




const Recipe = model("Recipe", recipeSchema);
module.exports = Recipe;