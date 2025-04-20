import {z} from 'zod'

export const UserRegisterDataSchema = z.object({
    username: z.string(),
    email: z.string().email("Email no válido").min(1, "Campo requerido"),
    pwd: z.string().min(8, "Debe tener mínimo 8 caracteres"),
    pwdRep: z.string()
})

export const UserLoginDataSchema = UserRegisterDataSchema.pick({
    email: true,
    pwd: true
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
    token: z.string()}) 

  export type UserLoginData = z.infer<typeof UserLoginDataWRememberSchema>;

export type UserRegisterData = z.infer<typeof UserLoginDataSchema>;
export type UserLogedData = z.infer<typeof UserLogedSchema>;
export type User = z.infer<typeof UserSchema>;
/* export type UserLoginData = z.infer<typeof userLoginDataSchema>; */
/* export type UserLoginRememberData = UserLoginData & { rememberme: boolean }; */



export type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
}