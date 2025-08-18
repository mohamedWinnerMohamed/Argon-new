import * as yup from "yup";

export const editOfficeSchema = yup.object({
  name: yup.string().required().label("إسم المكتب"),
  username: yup.string().required().label("إسم المستخدم"),
  password: yup.string().when({
    is: (password: string) => password !== "",
    then: (schema) => schema.min(8).label("كلمة المرور"),
    otherwise: (schema) => schema.label("كلمة المرور"),
  }),
});

export type EditOfficeType = yup.InferType<typeof editOfficeSchema>;
