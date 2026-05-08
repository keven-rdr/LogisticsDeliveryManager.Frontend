import { Building2, Check, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClientAvatar } from "@/components/ui/app-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useInfiniteClients } from "@/queries/client-queries";

export interface ClientSelectValue {
  id: string;
  name: string;
  logo?: { id: string } | null;
}

interface ClientSelectProps {
  value?: ClientSelectValue | ClientSelectValue[] | null;
  onChange: (value: ClientSelectValue | ClientSelectValue[] | null) => void;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  "aria-invalid"?: boolean | string;
}

export function ClientSelect({
  value,
  onChange,
  multiple = false,
  placeholder,
  disabled = false,
  label,
  "aria-invalid": ariaInvalid,
}: ClientSelectProps) {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tempSelection, setTempSelection] = useState<ClientSelectValue[]>([]);

  const rsqlSearch = useMemo(() => {
    if (!search) return undefined;
    const term = `"*${search}*"`;
    return `name==${term}`;
  }, [search]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteClients(
    20,
    "name,asc",
    rsqlSearch,
  );

  const clients = useMemo(() => data?.pages.flatMap((page) => page.content) || [], [data]);

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

  const handleSelect = (client: ClientSelectValue) => {
    if (multiple) {
      const exists = tempSelection.some((c) => c.id === client.id);
      if (exists) {
        setTempSelection(tempSelection.filter((c) => c.id !== client.id));
      } else {
        setTempSelection([...tempSelection, client]);
      }
    } else {
      onChange(client);
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

  const isSelected = (clientId: string) => {
    return tempSelection.some((c) => c.id === clientId);
  };

  const displayValue = useMemo(() => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex -space-x-2 overflow-hidden mr-2 shrink-0">
          {value.slice(0, 3).map((v) => (
            <ClientAvatar
              key={v.id}
              logoId={v.logo?.id}
              fallbackName={v.name}
              className="h-6 w-6 border-2 border-white dark:border-slate-900"
            />
          ))}
        </div>
      );
    }
    if (!multiple && value && !Array.isArray(value)) {
      return (
        <div className="flex-1 flex items-center gap-2 min-w-0 text-left">
          <ClientAvatar logoId={value.logo?.id} fallbackName={value.name} className="h-6 w-6" />
          <span className="truncate">{value.name}</span>
        </div>
      );
    }
    return null;
  }, [value, multiple]);

  const displayLabel = useMemo(() => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      if (value.length === 1) return value[0].name;
      return `${value.length} ${t("selected")}`;
    }
    return null;
  }, [value, multiple, t]);

  const selectedCount = Array.isArray(value) ? value.length : value ? 1 : 0;
  const isInvalid = ariaInvalid === true || ariaInvalid === "true";

  return (
    <>
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
            !value && "text-muted-foreground",
          )}
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          aria-invalid={isInvalid ? "true" : undefined}
        >
          {displayValue || (
            <>
              <Building2 className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate flex-1">{placeholder || t("selectOption")}</span>
            </>
          )}
          {displayLabel && (
            <span className="ml-2 truncate flex-1 text-slate-900 dark:text-slate-100">
              {displayLabel}
            </span>
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
        title={multiple ? t("selectClients") : t("selectClient")}
        size="md"
      >
        <div className="flex flex-col gap-4 h-[60vh] sm:h-[500px] w-full max-w-full">
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchClients")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-input divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : clients.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">{t("noClientsFound")}</div>
            ) : (
              <>
                {clients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    className={cn(
                      "w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors min-w-0",
                      isSelected(client.id) && "bg-slate-50 dark:bg-slate-800/50",
                    )}
                    onClick={() =>
                      handleSelect({ id: client.id, name: client.name, logo: client.logo })
                    }
                  >
                    <ClientAvatar logoId={client.logo?.id} fallbackName={client.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{client.name}</p>
                    </div>
                    {isSelected(client.id) && <Check className="h-5 w-5 text-primary shrink-0" />}
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
                  className="h-10 flex items-center justify-center shrink-0"
                >
                  {isFetchingNextPage && <Skeleton className="h-4 w-32" />}
                </div>
              </>
            )}
          </div>

          {multiple && (
            <div className="flex items-center justify-between pt-2 shrink-0">
              <span className="text-sm text-muted-foreground">
                {tempSelection.length} {t("selected")}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
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
    </>
  );
}
