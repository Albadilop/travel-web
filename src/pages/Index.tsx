import Navigation from "@/components/Navigation";
import TravelHero from "@/components/TravelHero";
import MapPlaceholder from "@/components/MapPlaceholder";
import CitiesShowcase from "@/components/CitiesShowcase";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <TravelHero />
      <MapPlaceholder />
      <CitiesShowcase />
    </div>
  );
};

export default Index;
