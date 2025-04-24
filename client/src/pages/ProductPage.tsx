import { useParams } from "wouter";
import { findProduct } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProductPage() {
  const { category, id } = useParams();
  const { dispatch } = useCart();
  const { toast } = useToast();
  // Garantiamo che category e id non siano undefined
  const product = findProduct(category || "", id || "");

  const [variant, setVariant] = useState(product?.variants?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState(0.25);
  const [notes, setNotes] = useState("");

  if (!product) return <div>Prodotto non trovato</div>;

  const handleAddToCart = (type: "kg" | "pz") => {
    const itemToAdd = {
      id: `${product.id}_${type}`,
      category: product.category,
      name: product.name,
      variant: variant || undefined,
      quantity: type === "kg" ? weight : quantity,
      unit: type,
      notes: notes.trim() || undefined
    };

    dispatch({
      type: "ADD_ITEM",
      payload: itemToAdd
    });

    toast({
      title: "Prodotto aggiunto",
      description: `${itemToAdd.name} aggiunto alla lista della spesa (${type === "kg" ? weight + " kg" : quantity + " pz"})`
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <span className="text-6xl">{product.icon}</span>
          <div>
            <h1 className="text-3xl">{product.name}</h1>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {product.variants && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Varietà</label>
            <Select value={variant} onValueChange={setVariant}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona varietà" />
              </SelectTrigger>
              <SelectContent>
                {product.variants.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex flex-col">
            <label className="text-sm font-medium">Peso</label>
            <span className="text-xs text-muted-foreground mb-2">(in chilogrammi)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setWeight(Math.max(weight - 0.25, 0.25))}
            >
              -
            </Button>
            <div className="flex-1 relative">
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                step={0.25}
                min={0.25}
                className="text-center pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                kg
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setWeight(weight + 0.25)}
            >
              +
            </Button>
          </div>
          <Button 
            className="w-full mt-2" 
            onClick={() => handleAddToCart("kg")}
          >
            Aggiungi {weight} kg alla Lista
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col">
            <label className="text-sm font-medium">Quantità</label>
            <span className="text-xs text-muted-foreground mb-2">(in pezzi)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setQuantity(Math.max(quantity - 1, 1))}
            >
              -
            </Button>
            <div className="flex-1 relative">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                min={1}
                className="text-center pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                pz
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
          <Button 
            className="w-full mt-2"
            onClick={() => handleAddToCart("pz")}
          >
            Aggiungi {quantity} pz alla Lista
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Ulteriori informazioni</label>
          <Textarea 
            placeholder="Inserisci note o istruzioni specifiche (opzionale)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}