import { Check, Search, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserAvatar } from "@/components/ui/app-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useInfiniteUsers } from "@/queries/user-queries";

export interface UserSelectValue {
  id: string;
  name: string;
  email?: string;
}

interface UserSelectProps {
  value?: UserSelectValue | UserSelectValue[] | null;
  onChange: (value: UserSelectValue | UserSelectValue[] | null) => void;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  "aria-invalid"?: boolean | string;
}

export function UserSelect({
  value,
  onChange,
  multiple = false,
  placeholder,
  disabled = false,
  label,
  "aria-invalid": ariaInvalid,
}: UserSelectProps) {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tempSelection, setTempSelection] = useState<UserSelectValue[]>([]);

  const rsqlSearch = useMemo(() => {
    if (!search) return undefined;
    const term = `"*${search}*"`;
    return `(name==${term},login==${term})`;
  }, [search]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteUsers(
    20,
    "name,asc",
    rsqlSearch,
  );

  const users = useMemo(() => data?.pages.flatMap((page) => page.content) || [], [data]);

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

  const handleSelect = (user: UserSelectValue) => {
    if (multiple) {
      const exists = tempSelection.some((u) => u.id === user.id);
      if (exists) {
        setTempSelection(tempSelection.filter((u) => u.id !== user.id));
      } else {
        setTempSelection([...tempSelection, user]);
      }
    } else {
      onChange(user);
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

  const isSelected = (userId: string) => {
    return tempSelection.some((u) => u.id === userId);
  };

  const displayValue = useMemo(() => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      if (value.length === 1) {
        const v = value[0];
        return (
          <div className="flex-1 flex items-center gap-2 min-w-0 text-left">
            <UserAvatar identifier={v.email} fallbackName={v.name} className="h-6 w-6" />
            <span className="truncate">{v.name}</span>
          </div>
        );
      }
      return (
        <div className="flex -space-x-2 overflow-hidden mr-2 shrink-0">
          {value.slice(0, 5).map((v) => (
            <Tooltip key={v.id}>
              <TooltipTrigger asChild>
                <span className="rounded-full ring-2 ring-white dark:ring-slate-900 cursor-help relative z-10 hover:z-20">
                  <UserAvatar identifier={v.email} fallbackName={v.name} className="h-6 w-6" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{v.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {value.length > 5 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-medium text-slate-600 dark:border-slate-900 dark:bg-slate-800 dark:text-slate-400 relative z-0">
              +{value.length - 5}
            </div>
          )}
        </div>
      );
    }
    if (!multiple && value && !Array.isArray(value)) {
      return (
        <div className="flex-1 flex items-center gap-2 min-w-0 text-left">
          <UserAvatar identifier={value.email} fallbackName={value.name} className="h-6 w-6" />
          <span className="truncate">{value.name}</span>
        </div>
      );
    }
    return null;
  }, [value, multiple]);

  const displayLabel = useMemo(() => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      if (value.length === 1) return null;
      return `${value.length} ${t("selected")}`;
    }
    return null;
  }, [value, multiple, t]);

  const selectedCount = Array.isArray(value) ? value.length : value ? 1 : 0;

  const isInvalid = ariaInvalid === true || ariaInvalid === "true";

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
        )}
        <Button
          type="button"
          variant="select"
          size="input"
          radius="input"
          className={cn(
            "w-full min-w-0 py-0",
            isInvalid && "border-destructive ring-1 ring-destructive",
            !value && "text-muted-foreground text-sm",
          )}
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          aria-invalid={isInvalid ? "true" : undefined}
        >
          {displayValue || (
            <>
              <Users className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate flex-1">{placeholder || t("selectUser")}</span>
            </>
          )}
          {displayLabel && (
            <span className="ml-2 truncate flex-1 text-slate-900 dark:text-slate-100">
              {displayLabel}
            </span>
          )}
          {selectedCount > 0 && !disabled && (
            <X
              className="ml-auto h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
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
        title={multiple ? t("selectUsers") : t("selectUser")}
        size="md"
      >
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchUsers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="max-h-80 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-input divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">{t("noUsersFound")}</div>
            ) : (
              <>
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className={cn(
                      "w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors min-w-0",
                      isSelected(user.id) && "bg-slate-50 dark:bg-slate-800/50",
                    )}
                    onClick={() =>
                      handleSelect({ id: user.id, name: user.name, email: user.email })
                    }
                  >
                    <UserAvatar fallbackName={user.name} identifier={user.email} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    {isSelected(user.id) && <Check className="h-5 w-5 text-primary shrink-0" />}
                  </button>
                ))}

                <div
                  ref={(el) => {
                    if (el) {
                      const observer = new IntersectionObserver(
                        (entries) => {
                          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                            fetchNextPage();
                          }
                        },
                        { threshold: 0.1 },
                      );
                      observer.observe(el);
                      return () => observer.disconnect();
                    }
                  }}
                  className="h-10 flex items-center justify-center"
                >
                  {isFetchingNextPage && <Skeleton className="h-4 w-32" />}
                </div>
              </>
            )}
          </div>

          {multiple && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">
                {tempSelection.length} {t("selected")}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button size="sm" onClick={handleConfirm}>
                  {t("actions.confirm")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </TooltipProvider>
  );
}
