const { Schema, model } = require("mongoose");

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "/images/plato.jpg", 
    },
    ingredients: [""],
    preparationtime: Number,
    difficulty: {
      type: String,
      enum: ["Baja", "Media", "Alta"],
    },
    category: {
      type: String,
      enum: [
        "Ensalada",
        "Sopa",
        "Guiso",
        "Carne",
        "Pescado",
        "Pasta",
        "Arroz",
        "Postre",
      ],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isfavourite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);
module.exports = Recipe;
