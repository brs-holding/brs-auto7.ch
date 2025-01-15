import { Switch, Route } from "wouter";
import { Home } from "./pages/Home";
import { CarSearch } from "./pages/CarSearch";
import { DealershipPlans } from "./pages/DealershipPlans";
import { CarDetails } from "./pages/CarDetails";
import { CarRegistration } from "./pages/CarRegistration";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { useUser } from "@/hooks/use-user";

function App() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/search" component={CarSearch} />
          <Route path="/dealerships" component={DealershipPlans} />
          <Route path="/cars/:id" component={CarDetails} />
          <Route path="/register-car">
            {user ? <CarRegistration /> : <div>Please login to register a car</div>}
          </Route>
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;