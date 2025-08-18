import * as yup from "yup";

export const createOfficeSchema = yup.object({
  name: yup.string().required().label("إسم المكتب"),
  username: yup.string().required().label("إسم المستخدم"),
  password: yup.string().min(8).required().label("كلمة المرور"),
});

export type CreateOfficeType = yup.InferType<typeof createOfficeSchema>;
