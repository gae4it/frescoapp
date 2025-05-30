import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/data/products";
import { Link } from "wouter";
  
export default function HomePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center">Benvenuto al Negozio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.id}`}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-center">
                  <span className="text-6xl block mb-4">{category.icon}</span>
                  <span className="text-xl">{category.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  {category.subcategories
                    ? `${category.subcategories.length} sottocategorie`
                    : `${category.products?.length || 0} prodotti`}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
