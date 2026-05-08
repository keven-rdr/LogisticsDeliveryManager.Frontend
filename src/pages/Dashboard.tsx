import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useCustomers, useVehicles, useEmployees } from "@/hooks/useEntities";

export default function Dashboard() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { data: employees, isLoading: employeesLoading } = useEmployees();

  const isLoading = ordersLoading || customersLoading || vehiclesLoading || employeesLoading;

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  const openOrders = orders?.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length || 0;
  const inTransitOrders = orders?.filter(o => o.status === 'InTransit' || o.status === 'Shipped').length || 0;
  const deliveredToday = orders?.filter(o => o.status === 'Delivered').length || 0;
  const totalCustomers = customers?.length || 0;

  const stats = [
    { title: "Pedidos em Aberto", value: openOrders.toString(), icon: Clock, color: "text-blue-500" },
    { title: "Em Rota", value: inTransitOrders.toString(), icon: Truck, color: "text-orange-500" },
    { title: "Total Entregues", value: deliveredToday.toString(), icon: CheckCircle, color: "text-green-500" },
    { title: "Total de Clientes", value: totalCustomers.toString(), icon: Package, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Logístico</h1>
        <p className="text-muted-foreground">Visão geral das operações de entrega.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                +2.5% em relação ao mês passado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Entregas por Região</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/50">
            <span className="text-muted-foreground italic">Gráfico de desempenho regional (Recharts)</span>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardContent>
            <div className="space-y-4">
              {orders && orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Pedido #{order.id} - {order.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Destino: {order.destinationAddress.city}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-8">
                  Nenhuma atividade recente registrada.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
