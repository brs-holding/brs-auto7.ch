import { Switch, Route } from "wouter";
import { Home } from "./pages/Home";
import { CarSearch } from "./pages/CarSearch";
import { DealershipPlans } from "./pages/DealershipPlans";
import { CarDetails } from "./pages/CarDetails";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/search" component={CarSearch} />
          <Route path="/dealerships" component={DealershipPlans} />
          <Route path="/cars/:id" component={CarDetails} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;