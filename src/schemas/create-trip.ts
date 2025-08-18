import * as yup from "yup";

export const createTripSchema = yup.object({
  destination: yup.string().required().label("الوجهة"),
  price: yup.number().typeError("السعر هو حقل مطلوب").required().label("السعر"),
  arrivalDate: yup.date().required().label("موعد الحضور"),
  departureDate: yup.date().required().label("موعد القيام"),
});

export type CreateTripType = yup.InferType<typeof createTripSchema>;
