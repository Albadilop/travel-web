import Map from "@/components/Map";
import { useCities } from "@/hooks/useCities";

const MapPlaceholder = () => {
  const { cities } = useCities();

  return (
    <section className="py-16 bg-gradient-soft">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins text-foreground mb-4">
            Tu Mapa de Aventuras
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora todas las ciudades que has visitado en un mapa interactivo. 
            Haz clic en cualquier marcador para revivir tus recuerdos.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Map cities={cities} />
        </div>
      </div>
    </section>
  );
};

export default MapPlaceholder;