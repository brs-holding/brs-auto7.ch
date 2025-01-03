import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ShieldCheck, DollarSign } from "lucide-react";
import { FinanceCalculator } from "@/components/FinanceCalculator";

export function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative h-[600px] flex items-center justify-center text-white"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backgroundImage: "url('https://images.unsplash.com/photo-1678728994157-0bcb3309200f')",
          backgroundBlend: "overlay",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Encuentra Tu Carro Perfecto en RD
          </h1>
          <p className="text-xl mb-8">
            La mejor selección de vehículos en la República Dominicana
          </p>
          <Link href="/search">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Explorar Carros
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Search className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Búsqueda Fácil</h3>
                <p>Encuentra el carro perfecto con nuestros filtros avanzados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <ShieldCheck className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Garantía de Calidad</h3>
                <p>Todos los vehículos son verificados por expertos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <DollarSign className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Financiamiento</h3>
                <p>Opciones flexibles de financiamiento adaptadas a ti</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Calcula Tu Financiamiento
          </h2>
          <FinanceCalculator />
        </div>
      </section>
    </div>
  );
}
