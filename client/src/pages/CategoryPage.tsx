import { useParams } from "wouter";
import { categories } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function CategoryPage() {
  const { category } = useParams();

  const mainCategory = categories.find((c) => c.id === category);
  if (!mainCategory) return <div>Categoria non trovata</div>;

  if (mainCategory.subcategories) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">{mainCategory.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainCategory.subcategories.map((subcat) => (
            <Link key={subcat.id} href={`/category/${subcat.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-4xl">{subcat.icon}</span>
                    <span>{subcat.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {subcat.products?.length || 0} prodotti
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">{mainCategory.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainCategory.products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            category={category || ""}
          />
        ))}
      </div>
    </div>
  );
}
