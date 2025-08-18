"use client";

import { createMovables } from "@/apis/movable-crud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { apiErrorHandler } from "@/lib/handle-api-errors";
import {
  createMovableSchema,
  CreateMovableSchemaType,
} from "@/schemas/create-movable";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash } from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { useController, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function MovablesForm() {
  const {
    control,
    formState: { errors },
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
  } = useForm<CreateMovableSchemaType>({
    resolver: yupResolver(createMovableSchema),
    defaultValues: {
      movables: [{}],
    },
  });

  const { field: senderPhoneField } = useController({
    control,
    name: "senderPhone",
  });

  const [isPending, setIsPending] = useState<boolean>(false);

  const { fields, remove, append } = useFieldArray({
    name: "movables",
    control,
  });

  console.log("ERRORS", errors);

  async function onSubmit(data: CreateMovableSchemaType) {
    setIsPending(true);

    const res = await apiErrorHandler(createMovables(data));

    setIsPending(false);

    if (!res) return;

    toast.success(res.data.message);

    reset();
  }

  return (
    <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="sender-name-input">إسم المرسِل</Label>
        <Input
          className="max-w-[400px]"
          id="sender-name-input"
          placeholder="إسم المرسِل..."
          {...register("senderName")}
        />
        {!!errors?.senderName && (
          <p className="text-sm text-red-500">{errors.senderName.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 my-4">
        <Label htmlFor="sender-phone-input">رقم هاتف المرسِل</Label>
        <PhoneInput
          className="max-w-[400px]"
          id="sender-phone-input"
          placeholder="رقم هاتف المرسِل..."
          value={senderPhoneField.value}
          onChange={({ target: { value } }) => senderPhoneField.onChange(value)}
        />
        {!!errors?.senderPhone && (
          <p className="text-sm text-red-500">{errors.senderPhone.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="w-full rounded-lg bg-slate-100 border border-slate-200 md:grid md:grid-cols-2 flex flex-col p-4 gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name-input">إسم المنقول</Label>
              <Input
                id="name-input"
                placeholder="إسم المنقول..."
                {...register(`movables.${index}.name`)}
              />
              {!!errors?.movables?.[index]?.name && (
                <p className="text-sm text-red-500">
                  {errors.movables[index].name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="destination-input">الوجهة</Label>
              <Input
                id="destination-input"
                placeholder="الوجهة..."
                {...register(`movables.${index}.destination`)}
              />
              {!!errors?.movables?.[index]?.destination && (
                <p className="text-sm text-red-500">
                  {errors.movables[index].destination.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount-input">الكمية</Label>
              <Input
                type="number"
                id="amount-input"
                placeholder="الكمية..."
                onInput={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value === "") {
                    e.target.value = "0";
                  }
                  e.target.value = e.target.value.replace(/\D+/g, "");
                }}
                {...register(`movables.${index}.amount`, {
                  valueAsNumber: true,
                  value: 1,
                  min: 1,
                })}
              />
              {!!errors?.movables?.[index]?.amount && (
                <p className="text-sm text-red-500">
                  {errors.movables[index].amount.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="price-input">السعر</Label>
              <Input
                type="number"
                id="price-input"
                placeholder="السعر..."
                onInput={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value === "") {
                    e.target.value = "0";
                  }
                  e.target.value = e.target.value.replace(/\D+/g, "");
                }}
                {...register(`movables.${index}.price`, {
                  valueAsNumber: true,
                })}
              />
              {!!errors?.movables?.[index]?.price && (
                <p className="text-sm text-red-500">
                  {errors.movables[index].price.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reciever-name-input">إسم المستلم</Label>
              <Input
                id="receiver-name-input"
                placeholder="إسم المستلم..."
                {...register(`movables.${index}.receiverName`)}
              />
              {!!errors?.movables?.[index]?.receiverName && (
                <p className="text-sm text-red-500">
                  {errors.movables[index].receiverName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reciever-phone-input">رقم هاتف المستلم</Label>
              <PhoneInput
                id="receiver-phone-input"
                placeholder="رقم هاتف المستلم..."
                value={watch().movables![index].receiverPhone}
                onChange={({ target: { value } }) =>
                  setValue(`movables.${index}.receiverPhone`, value)
                }
              />
              {!!errors?.movables?.[index]?.receiverPhone && (
                <p className="text-sm text-red-500">
                  {errors.movables[index].receiverPhone.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <Label htmlFor="notes-input">ملاحظات</Label>
              <Textarea
                id="notes-input"
                placeholder="ملاحظات..."
                {...register(`movables.${index}.notes`)}
              />
              {!!errors?.movables?.[index]?.notes && (
                <p className="text-sm text-red-500">
                  {errors.movables[index].notes.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => (fields.length <= 1 ? null : remove(index))}
                disabled={fields.length <= 1}
              >
                <Trash />
                إزالة
              </Button>
            </div>
          </div>
        ))}
        {errors?.movables?.message && (
          <p className="text-sm text-red-500">{errors.movables.message}</p>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        className="mt-4"
        onClick={() =>
          append({
            name: "",
            notes: "",
            price: null as unknown as number,
            amount: 1,
            destination: "",
            receiverName: "",
            receiverPhone: "",
          })
        }
      >
        <Plus />
      </Button>
      <div className="flex gap-2 mt-4">
        <Button disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          إضافة
        </Button>
        <Button variant="outline" type="button" asChild>
          <Link href="/movables">إلغاء</Link>
        </Button>
      </div>
    </form>
  );
}
