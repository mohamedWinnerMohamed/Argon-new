import * as yup from "yup";

export const editTripSchema = yup.object({
  destination: yup.string().required().label("الوجهة"),
  price: yup.number().required().label("السعر"),
  arrivalDate: yup.date().required().label("موعد الحضور"),
  departureDate: yup.date().required().label("موعد القيام"),
});

export type EditTripType = yup.InferType<typeof editTripSchema>;
