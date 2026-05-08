import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ChevronRight, Loader2 } from "lucide-react";
import { useCustomerOrders } from '@/hooks/useOrders';

const statusMap: Record<string, { label: string, color: string }> = {
  'Pending': { label: 'Aguardando Transportadora', color: 'bg-blue-100 text-blue-800' },
  'Processing': { label: 'Em Processamento', color: 'bg-orange-100 text-orange-800' },
  'Shipped': { label: 'Saiu da Base', color: 'bg-indigo-100 text-indigo-800' },
  'InTransit': { label: 'Em Rota', color: 'bg-purple-100 text-purple-800' },
  'Delivered': { label: 'Entregue', color: 'bg-green-100 text-green-800' },
};

export default function CustomerOrders() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { data: orders, isLoading } = useCustomerOrders(Number(customerId));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Compras</h1>
          <p className="text-muted-foreground">Gerencie seus pedidos e acompanhe as entregas.</p>
        </div>
        <Button className="gap-2">
          <ShoppingBag className="h-4 w-4" /> Novo Pedido
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !orders || orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              Você ainda não possui pedidos realizados.
            </CardContent>
          </Card>
        ) : orders.map((order) => (
          <Card key={order.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate(`/customer/${customerId}/orders/${order.id}`)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold">
                    #{order.id}
                  </div>
                  <div>
                    <div className="font-semibold">{order.destinationAddress?.street || 'Endereço não disponível'}</div>
                    <div className="text-sm text-muted-foreground">Destino: {order.destinationAddress?.city || '-'} - {order.destinationAddress?.state || '-'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <Badge className={statusMap[order.status]?.color || 'bg-gray-100'}>
                    {statusMap[order.status]?.label || order.status}
                  </Badge>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
