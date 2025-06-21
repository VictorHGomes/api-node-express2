import mongoose from "mongoose";

mongoose.Schema.Types.String.set("validate", {
    validator: (valor) => valor !== " " && valor !== "",
    message: "O campo não pode ser vazio"
});