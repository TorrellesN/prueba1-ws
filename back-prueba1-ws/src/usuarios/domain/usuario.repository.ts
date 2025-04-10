import Usuario from "./Usuario";
export default interface UsuarioRepository {

    register (usuario: Usuario) : Promise<Usuario>,
    login (usuario: Usuario) : Promise<Usuario>,

}