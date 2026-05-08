import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Navigation, ChevronRight, PackageCheck } from "lucide-react";

const assignedOrders = [
  { id: '1001', status: 'Pending', customer: 'Keven Rodrigues', destination: 'Rua da Logística, 456', cargo: 'Medicamentos' },
  { id: '1002', status: 'Processing', customer: 'Empresa Alpha', destination: 'Av. Industrial, 89', cargo: 'Peças Automotivas' },
];

export default function DriverOrders() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
          <Truck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Pedidos</h1>
          <p className="text-muted-foreground">Veículo: **Vila-01 (Refrigerado)** • Placa: **ABC-1234**</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Carga Atual (2 Pedidos)
        </div>
        {assignedOrders.map((order) => (
          <Card key={order.id} className="hover:border-orange-500/50 transition-colors cursor-pointer" onClick={() => navigate(`/employee/orders/${order.id}`)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 font-bold">
                    #{order.id}
                  </div>
                  <div>
                    <div className="font-semibold">{order.customer}</div>
                    <div className="text-sm text-muted-foreground">{order.destination}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <Badge variant="outline" className="mb-1">{order.cargo}</Badge>
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
