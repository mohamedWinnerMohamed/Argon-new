import * as yup from "yup";

export const loginSchema = yup.object({
  username: yup.string().required().label("إسم المستخدم"),
  password: yup.string().required().min(8).label("كلمة المرور"),
});

export type LoginFormType = yup.InferType<typeof loginSchema>;
