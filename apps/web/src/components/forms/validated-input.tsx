import {
  useField,
  type FormScope,
  type ValueOfInputType,
} from "@rvf/react-router";
import { type ComponentPropsWithRef, forwardRef, useId } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type BaseInputProps = Omit<ComponentPropsWithRef<"input">, "type">;

interface FormInputProps<Type extends string> extends BaseInputProps {
  label: string;
  type?: Type;
  scope: FormScope<ValueOfInputType<Type>>;
  helpText?: string;
}

// We need to do this in order to get a generic type out of `forwardRef`.
// In React 19, you won't need this anymore.
type InputType = <Type extends string>(
  props: FormInputProps<Type>
) => React.ReactNode;

const FormInputImpl = forwardRef<HTMLInputElement, FormInputProps<string>>(
  ({ label, scope, type, helpText, ...rest }, ref) => {
    const field = useField(scope);
    const inputId = useId();
    const errorId = useId();

    return (
      <div className="grid gap-2">
        <Label
          htmlFor={inputId}
          className={cn({ "text-destructive": field.error() })}
        >
          {label}
        </Label>
        <Input
          {...field.getInputProps({
            type,
            id: inputId,
            ref,
            "aria-describedby": errorId,
            "aria-invalid": !!field.error(),
            ...rest,
          })}
        />
        {helpText && (
          <p className="text-muted-foreground text-sm">{helpText}</p>
        )}
        {field.error() && (
          <p id={errorId} className="text-destructive text-sm">
            {field.error()}
          </p>
        )}
      </div>
    );
  }
);

FormInputImpl.displayName = "FormInput";

export const FormInput = FormInputImpl as InputType;
