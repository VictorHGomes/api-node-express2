import NaoEcontrado from "../erros/NaoEncontrado.js";
import {autores, livros} from "../models/index.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {

      const {limite=5, pagina=1} = req.query; 

      const livrosResultado = await livros.find()
        .skip((pagina - 1)* limite)
        .limit(limite)
        .populate("autor")
        .exec();

      res.status(200).json(livrosResultado);
    } catch (erro) {
     next(erro);
    }
  }

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultados = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

        if(livroResultados !== null) {
          res.status(200).send(livroResultados);
        }else{
          next(new NaoEcontrado("Id do livro nao localizado"));
        }
      res.status(200).send(livroResultados);
    } catch (erro) {
      next(erro);
    }
  }

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  }

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const novoLivro = await livros.findByIdAndUpdate(id, {$set: req.body});
      if (novoLivro !== null) {
        res.status(200).send({message: "Livro atualizado com sucesso"});
      } else {
        next(new NaoEcontrado("Id do livro nao localizado"));
      }
      
    } catch (erro) {
      next(erro);
    }
  }

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndDelete(id);
      if(livroResultado !== null) {
        res.status(200).send({message: "Livro removido com sucesso"});
      }
      else {
        next(new NaoEcontrado("Id do livro nao localizado"));
      }
      res.status(200).send({message: "Livro removido com sucesso"});
    } catch (erro) {
      next(erro);
    }
  }

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = await processaBusca(req.query);
      if(busca !== null){
        const livrosResultado = await livros.find(busca)
        .populate("autor");
        res.status(200).send(livrosResultado);
      }else{
        next(new NaoEcontrado("Autor não encontrado"));
      }
     
    } catch (erro) {
      next(erro);
    }
  }



}

async function processaBusca(parametros){
    const {editora, titulo, minPaginas, maxPaginas, nomeAutor} = parametros;
      
      let busca = {};
      if(minPaginas || maxPaginas) busca.numeroPaginas = {};
      if(editora)busca.editora = editora;
      if(titulo)busca.titulo = {$regex: titulo, $options: "i"}; 
      if(minPaginas) busca.numeroPaginas.$gte = minPaginas;
      if(maxPaginas) busca.numeroPaginas.$lte = maxPaginas;
      if(nomeAutor) {
        const autor = await autores.findOne({nome: {$regex: nomeAutor, $options: "i"}});
        if(autor !== null){
          const autorId = autor._id;
          busca.autor = autorId;
        }else{
          busca = null;
        }
      }
      return busca;
}

export default LivroController