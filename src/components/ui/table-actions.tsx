import { AlertCircle, AlertTriangle, Info, Loader2, MoreHorizontal } from "lucide-react";
import { Children, createContext, type ReactNode, useContext, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ButtonConfirm } from "@/components/ui/button-confirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SplitButton } from "@/components/ui/split-button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePermission } from "@/hooks/use-permission";
import type { Permission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

// ====================
// Context
// ====================

interface TableActionsContextType {
  mode: "row" | "dropdown";
  variant: "icons" | "icons-text";
}

const TableActionsContext = createContext<TableActionsContextType>({
  mode: "row",
  variant: "icons",
});

// ====================
// Types
// ====================

export interface TableActionConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  confirmVariant?: "info" | "warn" | "destructive";
  confirmText?: string;
  cancelText?: string;
  cancelVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export interface TableActionProps extends Omit<ButtonProps, "onClick" | "title"> {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  confirm?: TableActionConfirmOptions;
  hidden?: boolean;
  buttonVariant?: ButtonProps["variant"];
  permissions?: Permission[];
  permissionMode?: "any" | "all";
}

interface TableActionsProps {
  children: ReactNode;
  className?: string;

  /**
   * How actions should be displayed in row mode.
   * @default "icons"
   */
  variant?: "icons" | "icons-text";

  /**
   * If true, actions will collapse into a dropdown menu on mobile screens.
   */
  enableResponsive?: boolean;

  /**
   * Breakpoint for checking "mobile" state.
   * @default "(max-width: 768px)"
   */
  mediaQuery?: string;

  /**
   * If true, the first action will remain visible as a button even in dropdown mode (Split Button).
   */
  responsiveDefaultAction?: boolean;

  /**
   * Alignment of actions
   * @default "center"
   */
  align?: "start" | "center" | "end";
}

// ====================
// Internal Helpers
// ====================

function DropdownActionConfirm({ label, icon, confirm, className, disabled }: TableActionProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!confirm) return null;

  const {
    title,
    message,
    onConfirm,
    confirmVariant = "info",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    cancelVariant = "outline",
  } = confirm;

  const handleOpenChange = (value: boolean) => {
    if (loading) return;
    setOpen(value);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } catch {
      // Error handling is expected to be done in onConfirm
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch (confirmVariant) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "warn":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "destructive":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className={cn("gap-2 cursor-pointer", className)}
          disabled={disabled}
        >
          {icon && <span className="h-4 w-4 flex items-center justify-center">{icon}</span>}
          <span>{label}</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-full p-2 border shrink-0",
                confirmVariant === "info" &&
                  "bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900",
                confirmVariant === "warn" &&
                  "bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900",
                confirmVariant === "destructive" &&
                  "bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900",
              )}
            >
              {getIcon()}
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant={cancelVariant} disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              confirmVariant === "destructive" && "bg-red-600 hover:bg-red-700 text-white",
              confirmVariant === "warn" && "bg-amber-600 hover:bg-amber-700 text-white",
              confirmVariant === "info" && "bg-blue-600 hover:bg-blue-700 text-white",
            )}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ====================
// Components
// ====================

export function TableAction(props: TableActionProps) {
  const { mode, variant: groupVariant } = useContext(TableActionsContext);
  const { hasAny, hasAll } = usePermission();

  if (props.hidden) return null;

  if (props.permissions && props.permissions.length > 0) {
    const hasPermission =
      props.permissionMode === "all" ? hasAll(...props.permissions) : hasAny(...props.permissions);
    if (!hasPermission) return null;
  }

  // Dropdown Mode
  if (mode === "dropdown") {
    if (props.confirm) {
      return <DropdownActionConfirm {...props} />;
    }
    return (
      <DropdownMenuItem
        onClick={props.onClick}
        className={cn("gap-2 cursor-pointer", props.className)}
        disabled={props.disabled}
      >
        {props.icon && (
          <span className="h-4 w-4 flex items-center justify-center">{props.icon}</span>
        )}
        <span>{props.label}</span>
      </DropdownMenuItem>
    );
  }

  // Row Mode (Button)
  const showText = groupVariant === "icons-text";

  // Content layout
  const content = (
    <>
      {props.icon && <span className="h-4 w-4 shrink-0">{props.icon}</span>}
      {showText && <span>{props.label}</span>}
      {!showText && !props.icon && <span>{props.label}</span>}
    </>
  );

  if (props.confirm) {
    return (
      <ButtonConfirm
        {...props.confirm}
        // Pass button props
        variant={props.buttonVariant || "ghost"}
        size="sm"
        className={cn("h-8", !showText && "w-8 p-0", showText && "px-3", props.className)}
        tooltip={!showText ? props.label : undefined}
        disabled={props.disabled}
      >
        {/* ButtonConfirm renders children inside */}
        {props.icon}
      </ButtonConfirm>
    );
  }

  return (
    <Button
      variant={props.buttonVariant || "ghost"}
      size="sm"
      onClick={props.onClick}
      className={cn("h-8", !showText && "w-8 p-0", showText && "px-3", props.className)}
      disabled={props.disabled}
      tooltip={!showText ? props.label : undefined}
    >
      {content}
    </Button>
  );
}

export function TableActions({
  children,
  className,
  variant = "icons",
  enableResponsive = false,
  mediaQuery = "(max-width: 768px)",
  responsiveDefaultAction = false,
  align = "center",
}: TableActionsProps) {
  const isMobile = useMediaQuery(mediaQuery);
  const shouldCollapse = enableResponsive && isMobile;

  const childrenArray = Children.toArray(children);

  const justifyClass = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  }[align];

  if (shouldCollapse) {
    let mainAction = null;
    let dropdownActions = childrenArray;

    if (responsiveDefaultAction && childrenArray.length > 0) {
      mainAction = childrenArray[0];
      dropdownActions = childrenArray.slice(1);
    }

    // Split Button Mode (Joined Outline Styles)
    if (mainAction && dropdownActions.length > 0) {
      const mainActionElement = mainAction as React.ReactElement<TableActionProps>;
      const mainActionProps = mainActionElement.props;

      return (
        <div className={cn("flex items-center", justifyClass, className)}>
          <TableActionsContext.Provider value={{ mode: "row", variant: "icons-text" }}>
            <SplitButton
              onMainAction={mainActionProps.onClick}
              menuContent={
                <TableActionsContext.Provider value={{ mode: "dropdown", variant }}>
                  {dropdownActions}
                </TableActionsContext.Provider>
              }
              variant="outline"
              className="h-8"
            >
              {mainActionProps.icon && <span className="h-4 w-4 mr-2">{mainActionProps.icon}</span>}
              <span>{mainActionProps.label}</span>
            </SplitButton>
          </TableActionsContext.Provider>
        </div>
      );
    }

    return (
      <div className={cn("flex items-center gap-1", justifyClass, className)}>
        {mainAction && (
          <TableActionsContext.Provider value={{ mode: "row", variant }}>
            {mainAction}
          </TableActionsContext.Provider>
        )}

        {dropdownActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <TableActionsContext.Provider value={{ mode: "dropdown", variant }}>
                {dropdownActions}
              </TableActionsContext.Provider>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }

  return (
    <TableActionsContext.Provider value={{ mode: "row", variant }}>
      <div className={cn("flex items-center gap-1", justifyClass, className)}>{children}</div>
    </TableActionsContext.Provider>
  );
}
