import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, ChevronRight, Loader2 } from "lucide-react";
import { useEmployeeOrders } from '@/hooks/useOrders';

export default function DriverOrders() {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const { data: orders, isLoading } = useEmployeeOrders(employeeId!);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
          <Truck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Pedidos</h1>
          <p className="text-muted-foreground">Cargas e entregas atribuídas.</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Carga Atual ({orders?.length || 0} Pedidos)
        </div>
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : !orders || orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              Não há pedidos alocados para o seu veículo no momento.
            </CardContent>
          </Card>
        ) : orders.map((order) => (
          <Card key={order.id} className="hover:border-orange-500/50 transition-colors cursor-pointer" onClick={() => navigate(`/employee/${employeeId}/orders/${order.id}`)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="px-2 py-1 rounded bg-orange-50 text-orange-600 font-mono text-[10px] max-w-[80px] overflow-hidden truncate">
                    {order.id}
                  </div>
                  <div>
                    <div className="font-semibold">{order.destinationAddress?.street || 'Endereço Indisponível'}</div>
                    <div className="text-sm text-muted-foreground">{order.destinationAddress?.city || '-'} - {order.destinationAddress?.state || '-'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <Badge variant="outline" className="mb-1">Carga Tipo {order.cargoType}</Badge>
                    <div className="text-xs text-muted-foreground">Status: {order.status}</div>
                  </div>
                  <Button variant="secondary" size="sm" className="gap-2">
                    Iniciar Entrega <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
