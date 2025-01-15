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

      // Search page
      "search.title": "Gefundene Fahrzeuge",
      "search.brand": "Marke",
      "search.allBrands": "Alle Marken",
      "search.year": "Jahr",
      "search.allYears": "Alle Jahre",
      "search.priceRange": "Preisbereich",
      "search.allPrices": "Alle Preise",
      "search.search": "Suchen",
      "search.noResults": "Keine Fahrzeuge gefunden",

      // Dealership Plans
      "plans.title": "Händler-Pakete",
      "plans.subtitle": "Finden Sie das perfekte Paket für Ihr Geschäft",
      "plans.monthly": "/Monat",
      "plans.mostPopular": "Beliebteste Wahl",
      "plans.selectPlan": "Paket wählen",
      "plans.registration": "Anmeldung für",
      "plans.package": "-Paket",
      "plans.dealershipName": "Name des Autohauses",
      "plans.email": "E-Mail",
      "plans.phone": "Telefon",
      "plans.address": "Adresse",
      "plans.required": "Dieses Feld ist erforderlich",
      "plans.processing": "Wird verarbeitet...",
      "plans.confirm": "Anmeldung bestätigen",
      "plans.success": "Anmeldung erfolgreich!",
      "plans.successMessage": "Wir werden uns in Kürze mit Ihnen in Verbindung setzen.",
      "plans.error": "Fehler",
      "plans.errorMessage": "Die Anmeldung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.",

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
      "category.suv": "SUVs",
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

      // Footer
      "footer.about": "Ihr vertrauenswürdiger Marktplatz für den Kauf und Verkauf von Fahrzeugen in der Schweiz.",
      "footer.links": "Links",
      "footer.searchCars": "Autos suchen",
      "footer.contact": "Kontakt",
      "footer.followUs": "Folgen Sie uns",
      "footer.rights": "Alle Rechte vorbehalten.",

      // Language selector
      "language.de": "Deutsch",
      "language.en": "Englisch",
      "language.fr": "Französisch", 
      "language.it": "Italienisch",

      // Error messages
      "error.notFound": "Seite nicht gefunden",
      "error.serverError": "Serverfehler aufgetreten",
      "error.tryAgain": "Bitte versuchen Sie es später erneut"
    }
  },
  en: {
    translation: {
      // Navigation
      "nav.vehicles": "Vehicles",
      "nav.dealerships": "Dealerships",

      // Search page
      "search.title": "Found Vehicles",
      "search.brand": "Brand",
      "search.allBrands": "All Brands",
      "search.year": "Year",
      "search.allYears": "All Years",
      "search.priceRange": "Price Range",
      "search.allPrices": "All Prices",
      "search.search": "Search",
      "search.noResults": "No vehicles found",

      // Dealership Plans
      "plans.title": "Dealership Plans",
      "plans.subtitle": "Find the perfect plan for your business",
      "plans.monthly": "/month",
      "plans.mostPopular": "Most Popular",
      "plans.selectPlan": "Select Plan",
      "plans.registration": "Registration for",
      "plans.package": "Package",
      "plans.dealershipName": "Dealership Name",
      "plans.email": "Email",
      "plans.phone": "Phone",
      "plans.address": "Address",
      "plans.required": "This field is required",
      "plans.processing": "Processing...",
      "plans.confirm": "Confirm Registration",
      "plans.success": "Registration Successful!",
      "plans.successMessage": "We will contact you shortly.",
      "plans.error": "Error",
      "plans.errorMessage": "Registration could not be processed. Please try again.",

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
      "category.suv": "SUVs",
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
      "language.it": "Italian",

      // Error messages
      "error.notFound": "Page not found",
      "error.serverError": "Server error occurred",
      "error.tryAgain": "Please try again later"
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