import { Link } from "wouter";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Auto7.ch</h3>
            <p className="text-sm">
              {t("footer.about")}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search">
                  <a className="text-sm hover:underline">{t("footer.searchCars")}</a>
                </Link>
              </li>
              <li>
                <Link href="/dealerships">
                  <a className="text-sm hover:underline">{t("nav.dealerships")}</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-sm">
              <li>Zürich, Schweiz</li>
              <li>Tel: +41 79 893 10 91</li>
              <li>E-Mail: info@auto7.ch</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.followUs")}</h3>
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
          <p>&copy; {new Date().getFullYear()} Auto7.ch. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}