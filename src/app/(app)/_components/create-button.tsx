import { createOffice } from "@/apis/office-crud";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiErrorHandler } from "@/lib/handle-api-errors";
import { createOfficeSchema, CreateOfficeType } from "@/schemas/create-office";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus } from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentProps, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateOfficeButton({ ...props }: ComponentProps<"button">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateOfficeType>({
    resolver: yupResolver(createOfficeSchema),
  });

  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const [isPending, setIsPending] = useState<boolean>(false);

  async function onSubmit(data: CreateOfficeType) {
    setIsPending(true);
    const res = await apiErrorHandler(createOffice(data));
    setIsPending(false);

    if (!res) return;

    const message = res.data.message;

    toast.success(message);
    setOpen(false);

    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open === true) reset();

        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button {...props}>
          <Plus size={32} /> إنشاء
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>إنشاء مكتب جديد</DialogTitle>
          <DialogDescription>
            يرجى ملئ الحقول التالية لإنشاء مكتب جديد
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="w-full flex flex-col gap-3">
            <Label className="w-full" htmlFor="username-input">
              إسم المكتب
            </Label>
            <Input
              {...register("name")}
              placeholder="إسم المكتب"
              id="username-input"
            />
            <p className="text-red-500 text-xs">{errors?.name?.message}</p>
          </div>
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
          <DialogFooter className="gap-2 sm:justify-start">
            <Button disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              إنشاء
            </Button>
            <DialogClose disabled={isPending} asChild>
              <Button variant="outline" type="button">
                إلغاء
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
