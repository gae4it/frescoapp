import { useCart } from "@/contexts/CartContext";
import CartItem from "@/components/cart/CartItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function CartPage() {
  const { state, dispatch } = useCart();

  if (state.items.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>La tua lista della spesa è vuota</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/">
            <Button>Inizia a fare la spesa</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">La tua Lista della Spesa</h1>
        <Button
          variant="destructive"
          onClick={() => dispatch({ type: "CLEAR_CART" })}
        >
          Svuota Lista
        </Button>
      </div>

      <Card>
        <CardContent className="divide-y">
          {state.items.map((item) => (
            <CartItem
              key={`${item.id}-${item.variant}`}
              id={item.id}
              name={item.name}
              variant={item.variant}
              quantity={item.quantity}
              unit={item.unit}
              notes={item.notes}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Link href="/checkout">
          <Button size="lg">
            Procedi all'Invio
          </Button>
        </Link>
      </div>
    </div>
  );
}
