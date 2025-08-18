import * as yup from "yup";
import { ar } from "yup-locales";

yup.setLocale(ar);

const phoneRegExp =
  /^\+((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const passportNoRegExp = /^[A-Z0-9]{6,9}$/;

export const createPassengerSchema = yup.object({
  trip: yup.string().required().label("الرحلة"),
  fullName: yup.string().required().label("الإسم الكامل"),
  mediatorName: yup.string().label("الإسم الكامل"),
  phone: yup
    .string()
    .required()
    .matches(phoneRegExp, { message: "رقم الهاتف غير صالح" })
    .label("رقم الهاتف"),
  seatNo: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required()
    .label("رقم المقعد"),
  passportNo: yup
    .string()
    .matches(passportNoRegExp, { message: "رقم الباسبورت غير صالح" })
    .required()
    .label("رقم الباسبورت"),
  destination: yup.string().required().label("الوجهة"),
  price: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable()
    .label("سعر خاص"),
});

export type CreatePassengerType = yup.InferType<typeof createPassengerSchema>;
