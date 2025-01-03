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
import { Menu, X, Search, Car, User, Globe } from "lucide-react";
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
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-primary mr-8">CarrosRD</a>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList className="space-x-1">
                  <NavigationMenuItem>
                    <Button variant="ghost" className="text-sm">
                      Vehículos
                      <Car className="ml-2 h-4 w-4" />
                    </Button>
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
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Globe className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
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

            <div className="flex flex-col space-y-2">
              <Link href="/search">
                <a className="flex items-center px-4 py-2 hover:bg-muted rounded-md">
                  <Car className="h-4 w-4 mr-2" />
                  Vehículos
                </a>
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