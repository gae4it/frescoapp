import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function OrderConfirmationPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <h1 className="text-3xl font-bold text-green-600">
        Ordine Confermato!
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Grazie per il tuo ordine!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Abbiamo ricevuto il tuo ordine! Provvederemo alla sua preparazione al più presto.
          </p>
          <p className="text-gray-600">
            Riceverai una conferma via email con tutti i dettagli del tuo ordine.
          </p>
          <p className="text-lg font-medium text-green-600">
            Grazie mille e una splendida giornata!
          </p>
          
          <div className="pt-4">
            <Button 
              onClick={() => setLocation("/")}
              className="w-full"
            >
              Torna alla Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}