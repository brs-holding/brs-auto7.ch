import { Link } from "wouter";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CarrosRD</h3>
            <p className="text-sm">
              Tu marketplace de confianza para comprar y vender vehículos en la República Dominicana.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search">
                  <a className="text-sm hover:underline">Buscar Carros</a>
                </Link>
              </li>
              <li>
                <Link href="/dealerships">
                  <a className="text-sm hover:underline">Concesionarios</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>Santo Domingo, República Dominicana</li>
              <li>Tel: (809) 555-0123</li>
              <li>Email: info@carrosrd.com</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-foreground/80">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-primary-foreground/80">
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-primary-foreground/80">
                <TwitterIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} CarrosRD. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
