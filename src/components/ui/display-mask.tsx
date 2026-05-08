import * as React from "react";
import { MASKS, type MaskType, useFormatMask } from "@/hooks/use-format-mask";
import { cn } from "@/lib/utils";

interface DisplayMaskProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string | null | undefined;
  mask: MaskType | string;
  fallback?: string;
}

/**
 * DisplayMask - Displays a masked value (CPF, CNPJ, phone, etc.)
 *
 * @example
 * ```tsx
 * <DisplayMask value="12345678901" mask="cpf" />
 * <DisplayMask value="11999998888" mask="phone" />
 * <DisplayMask value="12345678" mask="cep" />
 * <DisplayMask value="1234" mask="##-##" />
 * ```
 */
const DisplayMask = React.forwardRef<HTMLSpanElement, DisplayMaskProps>(
  ({ value, mask, fallback = "—", className, ...props }, ref) => {
    const { formatMask } = useFormatMask();

    const formattedValue = value ? formatMask(value, mask) : fallback;

    return (
      <span ref={ref} className={cn(className)} {...props}>
        {formattedValue || fallback}
      </span>
    );
  },
);
DisplayMask.displayName = "DisplayMask";

// Convenience components for common masks
const DisplayCPF = React.forwardRef<HTMLSpanElement, Omit<DisplayMaskProps, "mask">>(
  (props, ref) => <DisplayMask ref={ref} {...props} mask="cpf" />,
);
DisplayCPF.displayName = "DisplayCPF";

const DisplayCNPJ = React.forwardRef<HTMLSpanElement, Omit<DisplayMaskProps, "mask">>(
  (props, ref) => <DisplayMask ref={ref} {...props} mask="cnpj" />,
);
DisplayCNPJ.displayName = "DisplayCNPJ";

const DisplayPhone = React.forwardRef<HTMLSpanElement, Omit<DisplayMaskProps, "mask">>(
  ({ value, ...props }, ref) => {
    const { formatPhone } = useFormatMask();
    const formattedValue = value ? formatPhone(value) : (props.fallback ?? "—");

    return (
      <span ref={ref} className={cn(props.className)} {...props}>
        {formattedValue}
      </span>
    );
  },
);
DisplayPhone.displayName = "DisplayPhone";

const DisplayCEP = React.forwardRef<HTMLSpanElement, Omit<DisplayMaskProps, "mask">>(
  (props, ref) => <DisplayMask ref={ref} {...props} mask="cep" />,
);
DisplayCEP.displayName = "DisplayCEP";

export { DisplayMask, DisplayCPF, DisplayCNPJ, DisplayPhone, DisplayCEP, MASKS };
export type { DisplayMaskProps, MaskType };
