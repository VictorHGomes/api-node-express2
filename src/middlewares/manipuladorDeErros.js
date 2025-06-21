import mongoose from "mongoose";
import ErroBase from "../erros/erroBase.js";
import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";
import ErroValidacao from "../erros/ErroValidacao.js";
import NaoEcontrado from "../erros/NaoEncontrado.js";

function manipuladorDeErros(erro, req, res, next) {
  console.log(erro);

  if (erro instanceof mongoose.Error.CastError) {
    new RequisicaoIncorreta().enviarResposta(res)
  } else if (erro instanceof mongoose.Error.ValidationError && erro.errors) {
    new ErroValidacao(erro).enviarResposta(res)
  }else if (erro instanceof NaoEcontrado) {
    erro.enviarResposta(res);
  } else {
    new ErroBase().enviarResposta(res);
  }
}


export default manipuladorDeErros