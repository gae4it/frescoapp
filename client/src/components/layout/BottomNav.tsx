import { Home, ArrowLeft, ArrowRight, ShoppingBasket } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BottomNav() {
  const [location, setLocation] = useLocation();
  const { state } = useCart();
  const itemCount = state.items.length;

  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white">
            <Home className="h-10 w-10" />
          </Button>
        </Link>

        <Button variant="ghost" size="icon" onClick={goBack} className="text-white">
          <ArrowLeft className="h-10 w-10" />
        </Button>

        <Button variant="ghost" size="icon" onClick={goForward} className="text-white">
          <ArrowRight className="h-10 w-10" />
        </Button>

        <Link href="/cart">
          <Button variant="ghost" size="icon" className="relative text-white">
            <ShoppingBasket className="h-10 w-10" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2">
                {itemCount}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
    </nav>
  );
}