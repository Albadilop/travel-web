import Navigation from "@/components/Navigation";
import TravelHero from "@/components/TravelHero";
import MapPlaceholder from "@/components/MapPlaceholder";
import CitiesShowcase from "@/components/CitiesShowcase";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <TravelHero />
      {user && <MapPlaceholder />}
      {user && <CitiesShowcase />}
    </div>
  );
};

export default Index;
