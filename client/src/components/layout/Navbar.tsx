import { Link } from "wouter";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const { state } = useCart();
  const itemCount = state.items.length;
  const base = import.meta.env.BASE_URL;

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href={`${base}`}>
            <a className="text-2xl font-bold">Lista della Spesa</a>
          </Link>
          <Link href={`${base}cart`}>
            <a className="relative">
              <ShoppingBasket size={24} />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2">
                  {itemCount}
                </Badge>
              )}
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
