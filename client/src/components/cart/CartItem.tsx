import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

type CartItemProps = {
  id: string;
  name: string;
  variant?: string;
  quantity: number;
  unit: "kg" | "pz";
  notes?: string;
};

export default function CartItem({ id, name, variant, quantity, unit, notes }: CartItemProps) {
  const { dispatch } = useCart();

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity: newQuantity }
      });
    }
  };

  const step = unit === "kg" ? 0.25 : 1;
  const minValue = unit === "kg" ? 0.25 : 1;

  return (
    <div className="flex flex-wrap items-center gap-4 py-4 border-b last:border-0">
      {/* Prima colonna: Nome prodotto e variante */}
      <div className="flex-1 min-w-[200px]">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">{name}</h3>
          {variant && <p className="text-sm">{variant}</p>}
          {notes && <p className="text-sm text-muted-foreground mt-1 italic">"{notes}"</p>}
        </div>
      </div>
      
      {/* Seconda colonna: Controlli quantità */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(quantity - step)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="relative w-24">
          <Input
            type="number"
            value={quantity}
            onChange={(e) => updateQuantity(parseFloat(e.target.value))}
            className="text-center pr-12 font-bold"
            step={step}
            min={minValue}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            {unit}
          </span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(quantity + step)}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => dispatch({ type: "REMOVE_ITEM", payload: id })}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}