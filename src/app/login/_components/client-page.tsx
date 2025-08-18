"use client";
import { login } from "@/apis/auth";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiErrorHandler } from "@/lib/handle-api-errors";
import { LoginFormType, loginSchema } from "@/schemas/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ClientLogin() {
  const params = useSearchParams();
  const error = params.get("error");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginSchema),
  });
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (!error) return;

    if (error === "expired")
      toast.error("تسجيل منتهي الصلاحية", {
        description:
          "إنتهت صلاحية تسجيل الدخول الخاصة بك، الرجاء التسجيل مرة آخرى. (هذا الإجراء تأميني)",
      });
    else if (error === "invalid")
      toast.error("خطأ في جلسه الدخول", {
        description:
          "يبدوا ان جلسه الدخول الخاصة بك بها مشكلة، الرجاء عمل تسجيل دخول جديد.",
      });
    else
      toast.error("خطأ", {
        description: "حدث خطأ ما، الرجاء تسجيل الدخول من جديد",
      });
  }, [error]);

  async function onSubmit(data: LoginFormType) {
    setIsPending(true);
    const res = await apiErrorHandler(login(data));
    setIsPending(false);

    if (res) {
      toast.success("تم تسجيل الدخول بنجاح");
      router.replace("/");
    }
  }

  return (
    <Suspense>
      <div className="w-full h-[100dvh] flex justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-[350px] w-full p-4 rounded-lg border border-black/10 shadow mt-6 flex justify-center items-center flex-col gap-4 bg-white backdrop-blur"
        >
          <Image
            src="/images/logo.png"
            width={120}
            height={100}
            alt="Logo"
            className="rounded-full"
          />
          <p className="font-bold text-2xl">تسجيل الدخول</p>
          <div className="w-full flex flex-col gap-3">
            <Label className="w-full" htmlFor="username-input">
              اسم المستخدم
            </Label>
            <Input
              {...register("username")}
              placeholder="إسم المستخدم..."
              id="username-input"
            />
            <p className="text-red-500 text-xs">{errors?.username?.message}</p>
          </div>
          <div className="w-full flex flex-col gap-3">
            <Label className="w-full" htmlFor="password-input">
              كلمة المرور
            </Label>
            <PasswordInput
              {...register("password")}
              placeholder="كلمة المرور..."
              id="password-input"
            />
            <p className="text-red-500 text-xs">{errors?.password?.message}</p>
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            تسجيل
          </Button>
        </form>
      </div>
    </Suspense>
  );
}
