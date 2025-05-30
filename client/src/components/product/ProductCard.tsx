import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { Link } from "wouter";

type ProductCardProps = {
  product: Product;
  category: string;
};

export default function ProductCard({ product, category }: ProductCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-4xl">{product.icon}</span>
          <span>{product.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Link
          href={`${import.meta.env.BASE_URL}product/${category}/${product.id}`}
        >
          <Button className="w-full">Seleziona</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
