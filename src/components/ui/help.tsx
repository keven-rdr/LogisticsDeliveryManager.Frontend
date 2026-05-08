import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useFeatureHelpByFeatureId } from "@/queries/feature-help-queries";

interface HelpProps {
  feature: string;
  className?: string;
}

export function Help({ feature, className }: HelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  // We only fetch when the drawer is open to save resources
  const { data: help, isLoading } = useFeatureHelpByFeatureId(isOpen ? feature : undefined);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
          className,
        )}
        onClick={() => setIsOpen(true)}
        title="Ver Ajuda"
      >
        <HelpCircle size={18} />
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={help?.title || "Ajuda da Funcionalidade"}
        subtitle={help?.featureName || `Informações e dicas sobre ${feature}`}
        width="w-[600px]"
      >
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-[20px] w-full" />
                <Skeleton className="h-[20px] w-full" />
                <Skeleton className="h-[20px] w-[80%]" />
              </div>
              <Skeleton className="h-[200px] w-full mt-6" />
            </div>
          ) : help ? (
            <div className="space-y-4">
              {!help.active && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm flex items-center gap-2 mb-4">
                  <HelpCircle size={16} />
                  <span>
                    Este conteúdo está marcado como inativo e visível apenas para administradores.
                  </span>
                </div>
              )}
              <div
                className="help-content-render text-foreground leading-relaxed"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Conteúdo de ajuda vem de fonte administrativa confiável
                dangerouslySetInnerHTML={{ __html: help.content }}
              />
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
              <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground">
                <HelpCircle size={32} />
              </div>
              <div className="max-w-[250px]">
                <h3 className="font-bold text-lg">Conteúdo não disponível</h3>
                <p className="text-sm text-muted-foreground">
                  Ainda não existe um guia de ajuda configurado para esta funcionalidade ({feature}
                  ).
                </p>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
