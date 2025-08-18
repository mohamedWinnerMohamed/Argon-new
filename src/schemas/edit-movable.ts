import * as yup from "yup";

const phoneRegExp =
  /^\+((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const editMovableSchema = yup.object({
  senderName: yup.string().required().label("إسم المرسِل"),
  senderPhone: yup
    .string()
    .required()
    .matches(phoneRegExp, { message: "رقم الهاتف غير صالح" })
    .label("رقم هاتف المرسِل"),
  movables: yup
    .array(
      yup.object({
        name: yup.string().required().label("إسم المنقول"),
        receiverName: yup.string().required().label("إسم المستلم"),
        receiverPhone: yup
          .string()
          .required()
          .matches(phoneRegExp, { message: "رقم الهاتف غير صالح" })
          .label("رقم هاتف المستلم"),
        amount: yup
          .number()
          .transform((value) => (Number.isNaN(value) ? null : value))
          .nullable()
          .min(1)
          .required()
          .label("الكمية"),
        price: yup
          .number()
          .transform((value) => (Number.isNaN(value) ? null : value))
          .nullable()
          .required()
          .label("السعر"),
        destination: yup.string().required().label("الوجهة"),
        notes: yup.string().label("ملاحظات"),
      }),
    )
    .min(1),
});

export type EditMovableSchemaType = yup.InferType<typeof editMovableSchema>;
