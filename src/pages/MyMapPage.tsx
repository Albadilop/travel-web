import Navigation from "@/components/Navigation";
import Map from "@/components/Map";
import { useCities } from "@/hooks/useCities";
import { useAuth } from "@/hooks/useAuth";

const MyMapPage = () => {
  const { cities, loading } = useCities();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 pt-24">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold font-poppins text-foreground mb-4">
              Inicia Sesión
            </h1>
            <p className="text-muted-foreground">
              Debes iniciar sesión para ver tu mapa personal.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-6 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-poppins text-foreground mb-4">
            Mi Mapa de Viajes
          </h1>
          <p className="text-black text-lg">
              Has visitado <span className="font-semibold text-foreground">{cities.length}</span> ciudades increíbles
            </p>
        </div>

        {loading ? (
          <div className="w-full h-96 bg-gradient-soft rounded-lg border border-border flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando tu mapa...</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-[70vh]">
            <Map cities={cities} />
          </div>
        )}

      </div>
    </div>
  );
};

export default MyMapPage;