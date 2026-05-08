import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, CheckCircle, Package, MapPin, Star, Loader2 } from "lucide-react";
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useOrder, useEvaluateOrder } from '@/hooks/useOrders';
import { toast } from 'sonner';
import {useState} from "react";

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
  const { data: order, isLoading } = useOrder(id!);
  const evaluateMutation = useEvaluateOrder();
  
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleEvaluate = async () => {
    if (!order || rating === 0) return;
    try {
      await evaluateMutation.mutateAsync({ id: order.id, rating, feedback });
      toast.success("Avaliação enviada com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar avaliação.");
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
  if (!order) return <div>Pedido não encontrado.</div>;

  const currentIndex = steps.findIndex(s => s.status === order.status);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <CheckCircle className="h-4 w-4 rotate-180" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Pedido</h1>
        <Badge variant="soft" color="neutral" className="font-mono">{id}</Badge>
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
              <span className="text-muted-foreground">Cliente ID:</span>
              <span className="font-medium font-mono text-xs">{order.customerId}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Endereço:</span>
              <span className="font-medium">{order.destinationAddress.street}, {order.destinationAddress.city}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Tipo de Carga:</span>
              <span className="font-medium">{order.cargoType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peso / Volume:</span>
              <span className="font-medium text-primary">{order.weight}kg / {order.volume}m³</span>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Section */}
        {order.status === 'Delivered' && (
          <Card className="border-primary/50 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                {order.rating ? 'Sua Avaliação' : 'Avaliar Entrega'}
              </CardTitle>
              <CardDescription>
                {order.rating ? 'Obrigado pelo seu feedback!' : 'Como foi sua experiência com nossa entrega?'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => !order.rating && setRating(s)}
                    disabled={!!order.rating}
                    className={cn("transition-transform", !order.rating && "hover:scale-110")}
                  >
                    <Star className={cn(
                      "h-8 w-8 transition-colors",
                      s <= (order.rating || rating) ? "text-yellow-500 fill-yellow-500" : "text-muted border-muted"
                    )} />
                  </button>
                ))}
              </div>
              
              {!order.rating ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deixe um comentário (opcional)</label>
                    <Textarea 
                      placeholder="O que achou do atendimento e da rapidez?" 
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleEvaluate} 
                    disabled={rating === 0 || evaluateMutation.isPending}
                  >
                    {evaluateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                    Enviar Avaliação
                  </Button>
                </>
              ) : (
                <div className="bg-muted p-4 rounded-lg italic text-sm">
                  "{order.feedback || 'Sem comentário'}"
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
