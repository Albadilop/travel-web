import { Button } from "@/components/ui/button";
import AddCityDialog from "@/components/AddCityDialog";
import { MapPin, Camera, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import heroImage from "@/assets/travel-hero.jpg";

const TravelHero = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-primary/20 to-accent/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold font-poppins text-foreground mb-6">
            Tu Diario de
            <span className="block bg-gradient-warm bg-clip-text text-transparent">
              Aventuras
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Guarda cada momento, cada ciudad y cada experiencia de tus viajes en un mapa interactivo lleno de recuerdos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <Link to="/cities">
                <Button size="lg" className="bg-gradient-warm hover:opacity-90 transition-all duration-300 shadow-warm text-lg px-8 py-6">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explorar Mis Viajes
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-warm hover:opacity-90 transition-all duration-300 shadow-warm text-lg px-8 py-6">
                  <MapPin className="mr-2 h-5 w-5" />
                  Comenzar Aventura
                </Button>
              </Link>
            )}
            {user && (
              <AddCityDialog trigger={
                <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6">
                  <Camera className="mr-2 h-5 w-5" />
                  Añadir Nueva Ciudad
                </Button>
              } />
            )}
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-card">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Mapa Interactivo</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-card">
              <Camera className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Galería de Fotos</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-card">
              <Star className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Valoraciones</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelHero;