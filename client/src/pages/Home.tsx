import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <section className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center gap-2">
            <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
              {t("home.new")}
            </span>
            <span className="font-semibold">{t("home.directSelling")}</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">{t("home.mainHeading")}</h1>
          <p className="text-muted-foreground mb-6">{t("home.freeService")}</p>

          <Card className="max-w-4xl mx-auto shadow-lg p-6">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => window.location.href = '/search'}
            >
              <Search className="h-4 w-4 mr-2" />
              {t("home.search")}
            </Button>
          </Card>

          {/* Features Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{t("features.whyAuto7")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 flex flex-col items-center text-center">
                <Search className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{t("features.easySearch")}</h3>
                <p>{t("features.easySearchDesc")}</p>
              </Card>
              <Card className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 mb-4 text-primary flex items-center justify-center">✓</div>
                <h3 className="text-xl font-semibold mb-2">{t("features.qualityGuarantee")}</h3>
                <p>{t("features.qualityGuaranteeDesc")}</p>
              </Card>
              <Card className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 mb-4 text-primary flex items-center justify-center">$</div>
                <h3 className="text-xl font-semibold mb-2">{t("features.financing")}</h3>
                <p>{t("features.financingDesc")}</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}