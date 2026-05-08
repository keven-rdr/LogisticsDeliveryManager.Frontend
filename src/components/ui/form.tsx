import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Loading Context
type FormLoadingContextValue = {
  isLoading: boolean;
};

const FormLoadingContext = React.createContext<FormLoadingContextValue>({ isLoading: false });

function useFormLoading() {
  return React.useContext(FormLoadingContext);
}

// Form Root with Loading Support
interface FormRootProps<TFieldValues extends FieldValues>
  extends React.ComponentProps<typeof FormProvider<TFieldValues>> {
  isLoading?: boolean;
  minLoadingDuration?: number;
}

function FormRoot<TFieldValues extends FieldValues>({
  isLoading = false,
  minLoadingDuration = 500,
  children,
  ...props
}: FormRootProps<TFieldValues>) {
  // Smooth Loading State Logic
  const [showLoading, setShowLoading] = React.useState(isLoading);
  const loadingStartTime = React.useRef<number>(0);
  const loadingTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (isLoading) {
      // Start Loading
      loadingStartTime.current = Date.now();
      setShowLoading(true);
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
    } else {
      // Stop Loading (with minimum duration check)
      const elapsed = Date.now() - loadingStartTime.current;
      const remaining = minLoadingDuration - elapsed;

      if (remaining > 0 && showLoading) {
        // If loaded too fast, wait remaining time
        loadingTimer.current = setTimeout(() => {
          setShowLoading(false);
        }, remaining);
      } else {
        // Otherwise stop immediately
        setShowLoading(false);
      }
    }

    return () => {
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
    };
  }, [isLoading, minLoadingDuration, showLoading]);

  return (
    <FormLoadingContext.Provider value={{ isLoading: showLoading }}>
      <FormProvider {...props}>{children}</FormProvider>
    </FormLoadingContext.Provider>
  );
}

const Form = FormRoot;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  const { isLoading } = useFormLoading();

  if (isLoading) {
    return <Skeleton className="h-4 w-24 mb-1" />;
  }

  return (
    <Label
      ref={ref}
      className={cn(error && "text-red-500", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  const { isLoading } = useFormLoading();

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  const { isLoading } = useFormLoading();

  if (isLoading) {
    return <Skeleton className="h-3 w-48" />;
  }

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const { isLoading } = useFormLoading();
  const body = error ? String(error?.message) : children;

  if (isLoading || !body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-red-500", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  useFormLoading,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
