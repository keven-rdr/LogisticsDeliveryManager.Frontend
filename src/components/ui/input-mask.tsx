import * as React from "react";
import { MASKS, type MaskType, useFormatMask } from "@/hooks/use-format-mask";
import { cn } from "@/lib/utils";

interface InputMaskProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  mask: MaskType | string;
  value?: string;
  onChange?: (value: string, formattedValue: string) => void;
}

/**
 * InputMask - Input with automatic mask formatting
 *
 * @example
 * ```tsx
 * <InputMask mask="cpf" value={cpf} onChange={(raw, formatted) => setCpf(raw)} />
 * <InputMask mask="cnpj" value={cnpj} onChange={(raw, formatted) => setCnpj(raw)} />
 * <InputMask mask="phone" value={phone} onChange={(raw, formatted) => setPhone(raw)} />
 * <InputMask mask="cep" value={cep} onChange={(raw, formatted) => setCep(raw)} />
 * ```
 */
const InputMask = React.forwardRef<HTMLInputElement, InputMaskProps>(
  ({ className, mask, value = "", onChange, ...props }, ref) => {
    const { formatMask, unmask } = useFormatMask();

    // Get the mask pattern
    const maskPattern = MASKS[mask as MaskType] || mask;

    // Calculate max length from mask pattern (count # characters + format chars)
    const maxLength = maskPattern.length;

    // Format the current value for display
    const formattedValue = formatMask(value, mask);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const rawValue = unmask(inputValue);
      const newFormattedValue = formatMask(rawValue, mask);

      onChange?.(rawValue, newFormattedValue);
    };

    return (
      <input
        type="text"
        inputMode="numeric"
        className={cn(
          // Base styles with density-aware sizing
          "flex w-full px-3 py-2 theme-input file:border-0 file:bg-transparent file:font-medium disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          // Theme-aware styles
          "border border-border bg-input text-foreground",
          // Placeholder
          "placeholder:text-muted-foreground",
          // Focus states
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "ring-offset-background",
          // Validation states
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:placeholder:text-destructive aria-[invalid=true]:focus-visible:ring-destructive",
          className,
        )}
        ref={ref}
        value={formattedValue}
        onChange={handleChange}
        maxLength={maxLength}
        {...props}
      />
    );
  },
);
InputMask.displayName = "InputMask";

// Convenience components for common masks
const InputCPF = React.forwardRef<HTMLInputElement, Omit<InputMaskProps, "mask">>((props, ref) => (
  <InputMask ref={ref} {...props} mask="cpf" placeholder="000.000.000-00" />
));
InputCPF.displayName = "InputCPF";

const InputCNPJ = React.forwardRef<HTMLInputElement, Omit<InputMaskProps, "mask">>((props, ref) => (
  <InputMask ref={ref} {...props} mask="cnpj" placeholder="00.000.000/0000-00" />
));
InputCNPJ.displayName = "InputCNPJ";

const InputPhone = React.forwardRef<HTMLInputElement, Omit<InputMaskProps, "mask">>(
  (props, ref) => <InputMask ref={ref} {...props} mask="phone" placeholder="(00) 00000-0000" />,
);
InputPhone.displayName = "InputPhone";

const InputCEP = React.forwardRef<HTMLInputElement, Omit<InputMaskProps, "mask">>((props, ref) => (
  <InputMask ref={ref} {...props} mask="cep" placeholder="00000-000" />
));
InputCEP.displayName = "InputCEP";

export { InputMask, InputCPF, InputCNPJ, InputPhone, InputCEP, MASKS };
export type { InputMaskProps, MaskType };
