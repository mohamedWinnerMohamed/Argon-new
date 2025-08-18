import { editOffice } from "@/apis/office-crud";
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
import { editOfficeSchema, EditOfficeType } from "@/schemas/edit-office";
import { yupResolver } from "@hookform/resolvers/yup";
import { Pencil } from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function EditOfficeButton({
  data,
  ...props
}: {
  data: { name: string; username: string; id: string };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditOfficeType>({
    resolver: yupResolver(editOfficeSchema),
    values: {
      ...data,
    },
  });

  const { id } = data;

  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const [isPending, setIsPending] = useState<boolean>(false);

  async function onSubmit({ password, ...data }: EditOfficeType) {
    setIsPending(true);
    const res = await apiErrorHandler(
      editOffice({ ...(password ? { password } : {}), ...data, id }),
    );
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
        <Button {...props} size="icon" variant="outline">
          <Pencil size={32} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل مكتب</DialogTitle>
          <DialogDescription>
            يمكنك تعديل اي من الحقول التالية او إدخال كلمة مرور جديدة
          </DialogDescription>
          <DialogDescription className="p-2 flex-1 rounded-lg border border-yellow-400 bg-yellow-100">
            إذا تركت حقل كلمة المرور فارغاً فلن تتغير كلمة المرور
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
              تحديث
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
