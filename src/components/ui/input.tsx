import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-white/0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
  // eslint-disable-next-line
>(({ type, ...props }, ref) => {
  const [view, setView] = React.useState<boolean>();

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => inputRef.current!, []);

  const [disabled, setDisabled] = React.useState<boolean>(!props.disabled);

  React.useEffect(() => {
    inputRef.current!.oninput = () => {
      const isDisabled =
        inputRef.current!.value === "" || inputRef.current!.value === undefined;

      setDisabled(!!isDisabled);
    };
  }, []);

  return (
    <div className="relative">
      <Input ref={inputRef} type={view ? "text" : "password"} {...props} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setView((prev) => !prev)}
        disabled={disabled}
      >
        {view && !disabled ? (
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {view ? "Hide password" : "Show password"}
        </span>
      </Button>
      {/* hides browsers password toggles */}
      <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
