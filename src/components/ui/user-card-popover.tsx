import { UserAvatar } from "@/components/ui/app-avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UserCardPopoverProps {
  user: {
    name: string;
    email?: string;
    function?: string | { id: string; name: string } | null;
    active?: boolean;
    status?: string;
  };
  className?: string;
}

export function UserCardPopover({ user, className }: UserCardPopoverProps) {
  const isActive = user.active !== undefined ? user.active : user.status === "ACTIVE";
  const functionName = typeof user.function === "string" ? user.function : user.function?.name;

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-2xl border border-slate-100 p-5 flex flex-col gap-4 min-w-[280px] animate-in fade-in zoom-in duration-200",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <UserAvatar
          identifier={user.email || user.name}
          fallbackName={user.name}
          className="h-14 w-14 ring-2 ring-slate-100 ring-offset-2"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 truncate text-base tracking-tight">
            {user.name}
          </h4>
          <p className="text-xs text-slate-500 truncate font-medium">{user.email || "—"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-3 border-t border-slate-50">
        {functionName && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Função
            </span>
            <span className="text-sm font-semibold text-slate-700">{functionName}</span>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Situação
          </span>
          <div className="flex mt-0.5">
            <Badge
              variant="soft"
              color={isActive ? "success" : "neutral"}
              className={cn(
                "px-2.5 py-0.5 text-[11px] font-bold rounded-full",
                !isActive && "bg-slate-100 text-slate-600 border-slate-200",
              )}
            >
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full mr-1.5",
                  isActive ? "bg-emerald-500" : "bg-slate-400",
                )}
              />
              {isActive ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
