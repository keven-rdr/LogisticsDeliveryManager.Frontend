import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, CheckCircle, Package, MapPin, Star, MessageSquare } from "lucide-react";
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

const steps = [
  { status: 'Pending', label: 'Pedido Recebido', icon: Package },
  { status: 'Processing', label: 'Separado/Embarcado', icon: CheckCircle },
  { status: 'Shipped', label: 'Saiu da Base', icon: Truck },
  { status: 'InTransit', label: 'Em Rota', icon: MapPin },
  { status: 'Delivered', label: 'Entregue', icon: CheckCircle },
];

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStatus] = useState('Delivered'); // For presentation demo
  const [rating, setRating] = useState(0);

  const currentIndex = steps.findIndex(s => s.status === currentStatus);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <CheckCircle className="h-4 w-4 rotate-180" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Pedido #{id}</h1>
      </div>

      {/* Horizontal Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Status da Entrega</CardTitle>
          <CardDescription>Acompanhe o progresso em tempo real.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative flex justify-between">
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-muted -z-0" />
            <div 
              className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 -z-0" 
              style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step.status} className="flex flex-col items-center gap-3 relative z-10">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background transition-colors",
                    isCompleted ? "border-primary text-primary" : "border-muted text-muted-foreground",
                    isCurrent && "ring-4 ring-primary/20 bg-primary text-white border-primary"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "text-xs font-medium text-center max-w-[80px]",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Destinatário:</span>
              <span className="font-medium">Keven Rodrigues</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Endereço:</span>
              <span className="font-medium">Rua da Logística, 456 - São Paulo</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Tipo de Carga:</span>
              <span className="font-medium">Medicamentos (Refrigerado)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Previsão:</span>
              <span className="font-medium text-primary">Hoje, até as 18:00 (Premium)</span>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Section */}
        {currentStatus === 'Delivered' && (
          <Card className="border-primary/50 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                Avaliar Entrega
              </CardTitle>
              <CardDescription>Como foi sua experiência com nossa entrega?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setRating(s)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={cn(
                      "h-8 w-8 transition-colors",
                      s <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted border-muted"
                    )} />
                  </button>
                ))}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Deixe um comentário (opcional)</label>
                <Textarea placeholder="O que achou do atendimento e da rapidez?" />
              </div>

              <Button className="w-full">Enviar Avaliação</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
