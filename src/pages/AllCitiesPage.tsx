import Navigation from "@/components/Navigation";
import CityCard from "@/components/CityCard";
import CityFilters from "@/components/CityFilters";
import CityRanking from "@/components/CityRanking";
import { useCities } from "@/hooks/useCities";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const AllCitiesPage = () => {
  const { cities, loading } = useCities();
  const { user, loading: authLoading } = useAuth();
  const [filters, setFilters] = useState({
    rating: null as number | null,
    year: null as number | null,
    month: null as number | null,
  });

  const filteredCities = cities.filter(city => {
    if (filters.rating && city.rating && city.rating < filters.rating) return false;
    if (filters.year) {
      const cityYear = new Date(city.visit_date).getFullYear();
      if (cityYear !== filters.year) return false;
    }
    if (filters.month) {
      const cityMonth = new Date(city.visit_date).getMonth() + 1;
      if (cityMonth !== filters.month) return false;
    }
    return true;
  });

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 pt-24">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

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
              Debes iniciar sesión para ver todas tus ciudades.
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
            Todas Mis Ciudades
          </h1>
          <p className="text-lg text-black mb-6">
            <span className="font-semibold text-foreground">{cities.length}</span> destinos en tu diario de viajes
          </p>
        </div>

        <CityFilters filters={filters} onFiltersChange={setFilters} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg"></div>
                    <div className="p-4 bg-card rounded-b-lg">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCities.map((city) => (
                  <CityCard key={city.id} city={city} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No se encontraron ciudades
                </h3>
                <p className="text-muted-foreground">
                  Ajusta los filtros o añade más ciudades a tu diario.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <CityRanking cities={cities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCitiesPage;