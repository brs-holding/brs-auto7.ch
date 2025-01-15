import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
const resources = {
  de: {
    translation: {
      // Navigation
      "nav.vehicles": "Fahrzeuge",
      "nav.dealerships": "Autohäuser",
      
      // Home page
      "home.new": "NEU",
      "home.directSelling": "Auto7.ch Direkt",
      "home.mainHeading": "Verkaufen Sie Ihr Auto sicher und schnell an einen Händler",
      "home.freeService": "100% kostenlos",
      "home.search": "Suchen",
      "home.brand": "Marke",
      "home.allBrands": "Alle Marken",
      "home.model": "Modell",
      "home.allModels": "Alle Modelle",
      "home.year": "Jahr",
      "home.allYears": "Alle Jahre",
      "home.price": "Preis",
      "home.allPrices": "Alle Preise",
      "home.price.under50k": "Bis CHF 50.000",
      "home.price.50kTo100k": "CHF 50.000 - 100.000",
      "home.price.100kTo200k": "CHF 100.000 - 200.000",
      "home.price.over200k": "Über CHF 200.000",
      
      // Vehicle categories
      "category.cars": "Autos",
      "category.suv": "SUV",
      "category.trucks": "Lastwagen",
      "category.motorcycles": "Motorräder",
      "category.vans": "Transporter",
      
      // Features section
      "features.whyAuto7": "Warum Auto7.ch?",
      "features.easySearch": "Einfache Suche",
      "features.easySearchDesc": "Finden Sie das perfekte Auto mit unseren erweiterten Filtern",
      "features.qualityGuarantee": "Qualitätsgarantie",
      "features.qualityGuaranteeDesc": "Alle Fahrzeuge werden von Experten geprüft",
      "features.financing": "Finanzierung",
      "features.financingDesc": "Flexible Finanzierungsoptionen nach Ihren Bedürfnissen",
      
      // Finance Calculator
      "calculator.title": "Berechnen Sie Ihre Finanzierung",
      "calculator.vehiclePrice": "Fahrzeugpreis (CHF)",
      "calculator.downPayment": "Anzahlung (CHF)",
      "calculator.term": "Laufzeit (Monate)",
      "calculator.interestRate": "Zinssatz (%)",
      "calculator.calculate": "Berechnen",
      "calculator.monthlyPayment": "Geschätzte monatliche Rate",
      
      // Footer
      "footer.about": "Ihr vertrauenswürdiger Marktplatz für den Kauf und Verkauf von Fahrzeugen in der Schweiz.",
      "footer.links": "Links",
      "footer.searchCars": "Autos Suchen",
      "footer.contact": "Kontakt",
      "footer.followUs": "Folgen Sie uns",
      "footer.rights": "Alle Rechte vorbehalten.",
      
      // Language selector
      "language.de": "Deutsch",
      "language.en": "English",
      "language.fr": "Français",
      "language.it": "Italiano"
    }
  },
  en: {
    translation: {
      // Navigation
      "nav.vehicles": "Vehicles",
      "nav.dealerships": "Dealerships",
      
      // Home page
      "home.new": "NEW",
      "home.directSelling": "Auto7.ch Direct",
      "home.mainHeading": "Sell your car safely and quickly to a dealer",
      "home.freeService": "100% free",
      "home.search": "Search",
      "home.brand": "Brand",
      "home.allBrands": "All Brands",
      "home.model": "Model",
      "home.allModels": "All Models",
      "home.year": "Year",
      "home.allYears": "All Years",
      "home.price": "Price",
      "home.allPrices": "All Prices",
      "home.price.under50k": "Under CHF 50,000",
      "home.price.50kTo100k": "CHF 50,000 - 100,000",
      "home.price.100kTo200k": "CHF 100,000 - 200,000",
      "home.price.over200k": "Over CHF 200,000",
      
      // Vehicle categories
      "category.cars": "Cars",
      "category.suv": "SUV",
      "category.trucks": "Trucks",
      "category.motorcycles": "Motorcycles",
      "category.vans": "Vans",
      
      // Features section
      "features.whyAuto7": "Why Auto7.ch?",
      "features.easySearch": "Easy Search",
      "features.easySearchDesc": "Find the perfect car with our advanced filters",
      "features.qualityGuarantee": "Quality Guarantee",
      "features.qualityGuaranteeDesc": "All vehicles are inspected by experts",
      "features.financing": "Financing",
      "features.financingDesc": "Flexible financing options tailored to your needs",
      
      // Finance Calculator
      "calculator.title": "Calculate Your Financing",
      "calculator.vehiclePrice": "Vehicle Price (CHF)",
      "calculator.downPayment": "Down Payment (CHF)",
      "calculator.term": "Term (Months)",
      "calculator.interestRate": "Interest Rate (%)",
      "calculator.calculate": "Calculate",
      "calculator.monthlyPayment": "Estimated Monthly Payment",
      
      // Footer
      "footer.about": "Your trusted marketplace for buying and selling vehicles in Switzerland.",
      "footer.links": "Links",
      "footer.searchCars": "Search Cars",
      "footer.contact": "Contact",
      "footer.followUs": "Follow Us",
      "footer.rights": "All Rights Reserved.",
      
      // Language selector
      "language.de": "German",
      "language.en": "English",
      "language.fr": "French",
      "language.it": "Italian"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
