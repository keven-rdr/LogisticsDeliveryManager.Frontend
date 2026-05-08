import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, ChevronRight } from "lucide-react";

const mockOrders = [
  { id: '1001', status: 'Pending', date: '2026-05-08', destination: 'Rua A, 123', carrier: 'Logistics Delivery Manager' },
  { id: '1002', status: 'Processing', date: '2026-05-07', destination: 'Av. B, 456', carrier: 'Logistics Delivery Manager' },
  { id: '1003', status: 'Delivered', date: '2026-05-05', destination: 'Praça C, 789', carrier: 'Logistics Delivery Manager' },
  { id: '1004', status: 'Draft', date: '2026-05-08', destination: 'Rua D, 10', carrier: '-' },
];

const statusMap: Record<string, { label: string, color: string }> = {
  'Draft': { label: 'Rascunho', color: 'bg-gray-100 text-gray-800' },
  'Pending': { label: 'Aguardando Transportadora', color: 'bg-blue-100 text-blue-800' },
  'Processing': { label: 'Em Processamento', color: 'bg-orange-100 text-orange-800' },
  'Delivered': { label: 'Entregue', color: 'bg-green-100 text-green-800' },
};

export default function CustomerOrders() {
  const navigate = useNavigate();

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
        {mockOrders.map((order) => (
          <Card key={order.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate(`/customer/orders/${order.id}`)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold">
                    #{order.id}
                  </div>
                  <div>
                    <div className="font-semibold">{order.destination}</div>
                    <div className="text-sm text-muted-foreground">Data: {order.date} • Transportadora: {order.carrier}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <Badge className={statusMap[order.status].color}>
                    {statusMap[order.status].label}
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
