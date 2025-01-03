import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Car, Truck, Bike, CaravanIcon, ShieldCheck, DollarSign } from "lucide-react";
import { FinanceCalculator } from "@/components/FinanceCalculator";

export function Home() {
  return (
    <div className="flex flex-col">
      {/* Search Section */}
      <section className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          {/* AutoScout24 Direct Banner */}
          <div className="mb-6 flex items-center gap-2">
            <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded">NUEVO</span>
            <span className="font-semibold">AutosRD Direct</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Vende tu carro seguro y rápido a un dealer
          </h1>
          <p className="text-muted-foreground mb-6">100% gratis</p>

          {/* Vehicle Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <Link href="/search?type=car">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <Car className="h-8 w-8 mb-2" />
                <span className="text-sm">Vehículos</span>
              </a>
            </Link>
            <Link href="/search?type=suv">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <Car className="h-8 w-8 mb-2" />
                <span className="text-sm">SUV</span>
              </a>
            </Link>
            <Link href="/search?type=truck">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <Truck className="h-8 w-8 mb-2" />
                <span className="text-sm">Camiones</span>
              </a>
            </Link>
            <Link href="/search?type=motorcycle">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <Bike className="h-8 w-8 mb-2" />
                <span className="text-sm">Motocicletas</span>
              </a>
            </Link>
            <Link href="/search?type=van">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <CaravanIcon className="h-8 w-8 mb-2" />
                <span className="text-sm">Vans</span>
              </a>
            </Link>
          </div>

          {/* Search Box */}
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardContent className="p-6">
              <form className="flex gap-2" action="/search" method="GET">
                <div className="flex-1">
                  <Input 
                    type="search" 
                    name="q"
                    placeholder="Marca y modelo, ej: Toyota Corolla"
                    className="w-full"
                  />
                </div>
                <Button type="submit" size="lg">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Top Cars Preview */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Vehículos Destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* Add CarCard components here */}
            </div>
          </div>
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