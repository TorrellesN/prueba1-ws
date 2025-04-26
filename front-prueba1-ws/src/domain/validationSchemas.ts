import { z } from 'zod'

export const UserRegisterDataSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener más de 3 caracteres").max(20, "El nombre de usuario no puede tener más de 20 caracteres"),
  email: z.string().min(1, "Campo requerido").email("Email no válido"),
  pwd: z.string().min(8, "Debe tener mínimo 8 caracteres"),
  pwdRep: z.string()
}).refine(data => data.pwd === data.pwdRep, {
  message: "Las contraseñas no coinciden",
  path: ["pwdRep"]
})


export const UserLoginDataSchema = z.object({
  email: z.string().min(1, "Campo requerido"),
  pwd: z.string().min(1, "Campo requerido")
})

export const UserLoginDataWRememberSchema = UserLoginDataSchema.extend({
  rememberme: z.boolean(),
});

export const UserSchema = z.object({
  username: z.string(),
  email: z.string(),
  profileImg: z.string()

})

export const UserLogedSchema = z.object({
  user: UserSchema,
  token: z.string()
})









