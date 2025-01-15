import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Car, User, Globe } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-primary mr-8">AutosRD</a>
            </Link>
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
          <div className="md:hidden py-4 space-y-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link href="/search">
                <a className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md">
                  <Car className="h-4 w-4 mr-2" />
                  Fahrzeuge
                </a>
              </Link>
              <Link href="/dealerships">
                <a className="px-4 py-2 hover:bg-gray-100 rounded-md">Autohäuser</a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}