import { Button } from "@/components/ui/button";
import CityCard from "./CityCard";
import AddCityDialog from "@/components/AddCityDialog";
import { Plus, ArrowRight, MapPin } from "lucide-react";
import { useCities } from "@/hooks/useCities";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const CitiesShowcase = () => {
  const { cities, loading } = useCities();
  const { user } = useAuth();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-foreground mb-4">
              Mis Ciudades Favoritas
            </h2>
            <p className="text-lg text-muted-foreground">
              {user ? `${cities.length} destinos que han marcado tu corazón viajero` : 'Inicia sesión para ver tus destinos favoritos'}
            </p>
          </div>
          
          <div className="flex gap-3 mt-6 md:mt-0">
            {user ? (
              <AddCityDialog trigger={
                <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Ciudad
                </Button>
              } />
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
            <Link to="/cities">
              <Button className="bg-gradient-warm hover:opacity-90 transition-all duration-300">
                Ver Todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Cargando tus ciudades...</p>
          </div>
        ) : cities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <CityCard
                key={city.id}
                city={city}
              />
            ))}
          </div>
        ) : (
          /* Empty State for New Users */
          <div className="mt-12 text-center">
            <div className="bg-card border-2 border-dashed border-border rounded-lg p-8 max-w-md mx-auto">
              <div className="p-4 bg-gradient-soft rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold font-poppins text-foreground mb-2">
                {user ? '¡Comienza Tu Aventura!' : '¡Únete para comenzar!'}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {user ? 'Añade tu primera ciudad y empieza a crear tu diario de viajes personal.' : 'Inicia sesión para guardar y compartir tus destinos favoritos.'}
              </p>
              {user ? (
                <AddCityDialog trigger={
                  <Button size="sm" className="bg-gradient-warm hover:opacity-90 transition-all duration-300">
                    Añadir Primera Ciudad
                  </Button>
                } />
              ) : (
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-warm hover:opacity-90 transition-all duration-300">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CitiesShowcase;