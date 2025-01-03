import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu, X, Search } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/">
            <a className="text-2xl font-bold text-primary">CarrosRD</a>
          </Link>

          {/* Search Bar - Desktop */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Buscar marca, modelo o año..."
                className="w-full pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button type="submit" className="ml-2">
              Buscar
            </Button>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Inicio
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/search">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Buscar Carros
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/dealerships">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Concesionarios
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {/* Search Bar - Mobile */}
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Buscar marca, modelo o año..."
                className="w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <div className="flex flex-col space-y-4">
              <Link href="/">
                <a className="px-4 py-2 hover:bg-muted rounded-md">Inicio</a>
              </Link>
              <Link href="/search">
                <a className="px-4 py-2 hover:bg-muted rounded-md">Buscar Carros</a>
              </Link>
              <Link href="/dealerships">
                <a className="px-4 py-2 hover:bg-muted rounded-md">Concesionarios</a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}