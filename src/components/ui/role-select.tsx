import { Check, Search, Shield, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRoles } from "@/queries/security-queries";

export interface RoleSelectValue {
  id: string;
  name: string;
}

interface RoleSelectProps {
  value?: RoleSelectValue | RoleSelectValue[] | null;
  onChange: (value: RoleSelectValue | RoleSelectValue[] | null) => void;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  "aria-invalid"?: boolean | string;
}

export function RoleSelect({
  value,
  onChange,
  multiple = false,
  placeholder,
  disabled = false,
  label,
  "aria-invalid": ariaInvalid,
}: RoleSelectProps) {
  const { t } = useTranslation("common");
  const { t: tSecurity } = useTranslation("security");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tempSelection, setTempSelection] = useState<RoleSelectValue[]>([]);

  const { data, isLoading } = useRoles({ page: 0, size: 100, sort: "name,asc" });

  const roles = useMemo(() => {
    const all = data?.content || [];
    if (!search) return all;
    return all.filter((role) => role.name.toLowerCase().includes(search.toLowerCase()));
  }, [data?.content, search]);

  useEffect(() => {
    if (isOpen) {
      if (multiple && Array.isArray(value)) {
        setTempSelection(value);
      } else if (!multiple && value && !Array.isArray(value)) {
        setTempSelection([value]);
      } else {
        setTempSelection([]);
      }
    }
  }, [isOpen, value, multiple]);

  const handleSelect = (role: RoleSelectValue) => {
    if (multiple) {
      const exists = tempSelection.some((r) => r.id === role.id);
      if (exists) {
        setTempSelection(tempSelection.filter((r) => r.id !== role.id));
      } else {
        setTempSelection([...tempSelection, role]);
      }
    } else {
      onChange(role);
      setIsOpen(false);
    }
  };

  const handleConfirm = () => {
    if (multiple) {
      onChange(tempSelection.length > 0 ? tempSelection : null);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(multiple ? [] : null);
  };

  const isSelected = (roleId: string) => {
    return tempSelection.some((r) => r.id === roleId);
  };

  const displayValue = useMemo(() => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      if (value.length <= 2) {
        return value.map((r) => r.name).join(", ");
      }
      return `${value.length} ${tSecurity("roles.selectedCount")}`;
    }
    if (!multiple && value && !Array.isArray(value)) {
      return value.name;
    }
    return null;
  }, [value, multiple, tSecurity]);

  const selectedCount = Array.isArray(value) ? value.length : value ? 1 : 0;

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
            !displayValue && "text-muted-foreground",
          )}
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          aria-invalid={isInvalid ? "true" : undefined}
        >
          <Shield className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate flex-1 text-sm">
            {displayValue || placeholder || tSecurity("roles.selectRole")}
          </span>
          {selectedCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 shrink-0 bg-zinc-100 text-zinc-900 border-none"
            >
              {selectedCount}
            </Badge>
          )}
          {selectedCount > 0 && !disabled && (
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

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={multiple ? tSecurity("roles.selectRoles") : tSecurity("roles.selectRole")}
        size="md"
      >
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={tSecurity("roles.searchRoles")}
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
            ) : roles.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {tSecurity("roles.noRolesFound")}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-input text-left transition-all min-w-0",
                      "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                      isSelected(role.id)
                        ? "bg-slate-50 dark:bg-slate-800/50 ring-1 ring-slate-200 dark:ring-slate-700"
                        : "border border-transparent",
                    )}
                    onClick={() => handleSelect({ id: role.id, name: role.name })}
                  >
                    <div
                      className={cn(
                        "h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                        isSelected(role.id)
                          ? "bg-slate-900 border-slate-900 dark:bg-slate-50 dark:border-slate-50"
                          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900",
                      )}
                    >
                      {isSelected(role.id) && (
                        <Check
                          className="h-2.5 w-2.5 text-white dark:text-zinc-900"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium truncate",
                        isSelected(role.id)
                          ? "text-slate-900 dark:text-slate-50"
                          : "text-slate-600 dark:text-slate-400",
                      )}
                    >
                      {role.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {multiple && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground font-medium">
                {tempSelection.length} {t("selected")}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-xs h-8"
                >
                  {t("cancel")}
                </Button>
                <Button size="sm" onClick={handleConfirm} className="text-xs h-8">
                  {t("actions.confirm")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
