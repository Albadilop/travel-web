import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, MapPin } from "lucide-react";
import type { City } from "@/hooks/useCities";

interface CityRankingProps {
  cities: City[];
}

const CityRanking = ({ cities }: CityRankingProps) => {
  const topCities = cities
    .filter(city => city.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  if (topCities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Top Ciudades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Añade ciudades con valoración 4+ para ver el ranking
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          Top Ciudades
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topCities.map((city, index) => (
          <div
            key={city.id}
            className="flex items-center gap-3 p-3 bg-gradient-soft rounded-lg border border-border/50"
          >
            <div className="flex-shrink-0">
              {index < 3 ? (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white' :
                  'bg-gradient-to-r from-amber-700 to-amber-900 text-white'
                }`}>
                  {index + 1}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-medium text-sm text-muted-foreground">
                  {index + 1}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">
                {city.name}
              </h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {city.country}
              </p>
            </div>
            
            <Badge className="flex items-center gap-1 bg-accent/20 text-accent border-accent/30">
              <Star className="h-3 w-3 text-orange-500 fill-orange-500 hover:text-orange-500 hover:fill-orange-500" />
              <span className="text-black">{city.rating}</span>
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CityRanking;