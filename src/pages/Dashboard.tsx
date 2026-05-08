import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, CheckCircle, Clock } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Pedidos em Aberto", value: "0", icon: Clock, color: "text-blue-500" },
    { title: "Em Rota", value: "0", icon: Truck, color: "text-orange-500" },
    { title: "Entregues hoje", value: "0", icon: CheckCircle, color: "text-green-500" },
    { title: "Total de Clientes", value: "0", icon: Package, color: "text-purple-500" },
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
          <CardHeader>
            <CardTitle>Últimas Atualizações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground italic text-center py-8">
                Nenhuma atividade recente registrada.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
