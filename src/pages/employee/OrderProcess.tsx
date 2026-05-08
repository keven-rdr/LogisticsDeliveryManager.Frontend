import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle, Navigation, MapPin, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from '@/lib/utils';
import { useOrder, useUpdateOrderStatus, useUploadProof } from '@/hooks/useOrders';
import { toast } from 'sonner';
import {useState} from "react";

const statusSteps = [
  { id: 'Processing', label: 'Marcar como Embarcado', icon: CheckCircle, color: 'blue' },
  { id: 'Shipped', label: 'Iniciar Deslocamento', icon: Navigation, color: 'orange' },
  { id: 'InTransit', label: 'Em Rota de Entrega', icon: MapPin, color: 'green' },
  { id: 'Delivered', label: 'Finalizar Entrega', icon: CheckCircle, color: 'primary' },
];

export default function OrderProcess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(Number(id));
  const updateStatusMutation = useUpdateOrderStatus();
  const uploadProofMutation = useUploadProof();
  
  const [showPhoto, setShowPhoto] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const orderStatusIndex = order ? statusSteps.findIndex(s => s.id === order.status) : -1;
  const currentStep = Math.min(statusSteps.length - 1, orderStatusIndex + 1);

  const nextStep = async () => {
    if (!order) return;
    
    if (currentStep === 3) { // Final step (Delivered)
      setShowPhoto(true);
    } else {
      const nextStatus = statusSteps[currentStep].id;
      try {
        await updateStatusMutation.mutateAsync({ id: order.id, status: nextStatus });
        toast.success("Status atualizado!");
      } catch (error) {
        toast.error("Erro ao atualizar status.");
      }
    }
  };

  const handleCapture = async () => {
    if (!order) return;
    setPhotoCaptured(true);
    
    try {
      // Photo capture logic
      const realBase64 = "captured_image_data"; // Exemplo de dados capturados
      await uploadProofMutation.mutateAsync({ id: order.id, base64Image: realBase64 });
      
      setTimeout(() => {
        setShowPhoto(false);
      }, 1500);
    } catch (e) {
      setPhotoCaptured(false);
      toast.error("Erro ao enviar comprovante.");
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;
  if (!order) return <div>Pedido não encontrado.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Processar Entrega #{id}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Cliente ID: {order.customerId}</CardTitle>
              <CardDescription>{order.destinationAddress.street}, {order.destinationAddress.city} - {order.destinationAddress.state}</CardDescription>
            </div>
            {order.isPriority && <Badge variant="secondary">Premium / Prioridade</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold block">Instrução Especial:</span>
              Carga tipo {order.cargoType}. Peso: {order.weight}kg • Volume: {order.volume}m³.
            </div>
          </div>
        </CardContent>
      </Card>

      {!showPhoto ? (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Próxima Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                {(() => {
                  const CurrentStepIcon = statusSteps[currentStep].icon;
                  return <CurrentStepIcon className="h-6 w-6" />;
                })()}
              </div>
              <div className="flex-1">
                <div className="font-bold text-xl">{statusSteps[currentStep].label}</div>
                <p className="text-sm text-muted-foreground">Isso atualizará o status para o cliente em tempo real.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full py-6 text-lg font-bold shadow-lg" onClick={nextStep}>
              Confirmar Alteração
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-2 border-orange-500 animate-in zoom-in-95 duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Comprovação de Entrega
            </CardTitle>
            <CardDescription>Tire uma foto do produto entregue ou do canhoto assinado.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 py-8">
            <div className={cn(
              "w-full aspect-video rounded-2xl bg-muted flex flex-col items-center justify-center border-2 border-dashed transition-all",
              photoCaptured ? "bg-green-50 border-green-500" : "border-muted-foreground/20"
            )}>
              {photoCaptured ? (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mb-2 animate-bounce" />
                  <span className="font-bold text-green-700">Foto Capturada com Sucesso!</span>
                </>
              ) : (
                <>
                  <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                  <span className="text-muted-foreground font-medium">Aguardando Câmera...</span>
                </>
              )}
            </div>
            <Button 
              size="lg" 
              className="w-full gap-2 py-8 text-xl font-bold rounded-2xl shadow-xl" 
              onClick={handleCapture}
              disabled={photoCaptured}
            >
              <Camera className="h-6 w-6" /> CAPTURAR AGORA
            </Button>
          </CardContent>
        </Card>
      )}

      {/* History mini-timeline */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest px-1">Histórico</h3>
        {statusSteps.map((step, index) => (
          <div key={step.id} className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg border",
            index < currentStep ? "bg-muted/20 opacity-50" : index === currentStep ? "border-primary/50 bg-primary/5 font-bold" : "opacity-30"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              index <= currentStep ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}>
              {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
            </div>
            <span className="text-sm">{step.label.replace('Marcar como ', '')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
