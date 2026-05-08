import { Check, Search, UserCheck, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUserFunctions } from "@/queries/user-functions-queries";

export interface UserFunctionSelectValue {
  id: string;
  name: string;
}

interface UserFunctionSelectProps {
  value?: UserFunctionSelectValue | null;
  onChange: (value: UserFunctionSelectValue | null) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  "aria-invalid"?: boolean | string;
}

export function UserFunctionSelect({
  value,
  onChange,
  placeholder,
  disabled = false,
  label,
  "aria-invalid": ariaInvalid,
}: UserFunctionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useUserFunctions(0, 100, "name,asc");

  const functions = useMemo(() => {
    const all = data?.content || [];
    if (!search) return all;
    return all.filter((func) => func.name.toLowerCase().includes(search.toLowerCase()));
  }, [data?.content, search]);

  const handleSelect = (func: UserFunctionSelectValue) => {
    onChange(func);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
  };

  const isInvalid = ariaInvalid === true || ariaInvalid === "true";

  return (
    <>
      <div className="flex flex-col gap-1.5">
        {label && (
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        )}
        <Button
          type="button"
          variant="select"
          size="input"
          radius="input"
          className={cn(
            "py-2 h-auto",
            isInvalid && "border-destructive ring-1 ring-destructive",
            !value && "text-muted-foreground",
          )}
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          aria-invalid={isInvalid ? "true" : undefined}
        >
          <UserCheck className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate flex-1 text-sm">
            {value?.name || placeholder || "Selecione a função..."}
          </span>
          {value && !disabled && (
            <X
              className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            />
          )}
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Selecione a Função" size="md">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar função..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="max-h-80 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-input">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : functions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Nenhuma função encontrada.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-3">
                {functions.map((func) => (
                  <button
                    key={func.id}
                    type="button"
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-input text-left transition-all min-w-0",
                      "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                      value?.id === func.id
                        ? "bg-slate-50 dark:bg-slate-800/50 ring-1 ring-slate-200 dark:ring-slate-700"
                        : "border border-transparent",
                    )}
                    onClick={() => handleSelect({ id: func.id, name: func.name })}
                  >
                    <div
                      className={cn(
                        "h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                        value?.id === func.id
                          ? "bg-slate-900 border-slate-900 dark:bg-slate-50 dark:border-slate-50"
                          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900",
                      )}
                    >
                      {value?.id === func.id && (
                        <Check
                          className="h-2.5 w-2.5 text-white dark:text-zinc-900"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium truncate",
                        value?.id === func.id
                          ? "text-slate-900 dark:text-slate-50"
                          : "text-slate-600 dark:text-slate-400",
                      )}
                    >
                      {func.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
