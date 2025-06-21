import mongoose from "mongoose";

const livroSchema = new mongoose.Schema(
  {
    id: {type: String},
    titulo: {
      type: String,
       required: [true, "O titulo do livro é obrigatório"]},
    autor: {type: mongoose.Schema.Types.ObjectId, ref: 'autores', required: [true, "O(a) autor(a) é obrigatório"]},
    editora: {
      type: String,
       required: [true, "A editora é obrigatório"],
       enum: {
       values: ["Casa do Código", "Novatec"],
        message: "A editora deve ser Casa do Código ou Novatec"
      }
    },
    numeroPaginas: {
      type: Number,
      min: [10, "O numero de páginas deve estar entre 10 e 10000"],
      max: [10000, "O numero de páginas deve estar entre 10 e 10000"]
    }
  }
);

const livros= mongoose.model('livros', livroSchema);

export default livros;