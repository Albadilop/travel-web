import Map from "@/components/Map";
import { useCities } from "@/hooks/useCities";
import { useTranslation } from "react-i18next";

const MapPlaceholder = () => {
  const { cities } = useCities();
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gradient-soft">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins text-foreground mb-4">
            {t('map.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('map.description')}
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