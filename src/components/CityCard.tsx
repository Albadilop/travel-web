import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Calendar, Edit, Trash2 } from "lucide-react";
import { useCities, type City } from "@/hooks/useCities";
import EditCityDialog from "@/components/EditCityDialog";
import CityImageCarousel from "@/components/CityImageCarousel";
import ImageCarousel from "@/components/ImageCarousel";
import { useState } from "react";

interface CityCardProps {
  city: City;
}

const CityCard = ({ city }: CityCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselImages, setCarouselImages] = useState<Array<{id: string; image_url: string}>>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const { deleteCity } = useCities();

  const handleDelete = async () => {
    if (confirm(`¿Estás seguro de que quieres eliminar ${city.name}?`)) {
      await deleteCity(city.id);
    }
  };

  const handleImageClick = (images: Array<{id: string; image_url: string}>, index: number) => {
    setCarouselImages(images);
    setCarouselIndex(index);
    setShowCarousel(true);
  };
  return (
    <Card className="group hover:shadow-elevation transition-all duration-300 cursor-pointer bg-card border-border overflow-hidden">
      {/* City Image */}
      <div className="relative h-48 overflow-hidden">
        <CityImageCarousel 
          cityId={city.id} 
          cityName={city.name} 
          country={city.country}
          onImageClick={handleImageClick}
        />
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-card/90 backdrop-blur-sm border-0 shadow-card h-8 w-8 p-0"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="bg-destructive/90 backdrop-blur-sm border-0 shadow-card h-8 w-8 p-0"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-card/90 backdrop-blur-sm border-0 shadow-card">
            <Star className="h-3 w-3 text-accent mr-1 fill-current" />
            <span className="text-black">{city.rating}</span>
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold font-poppins text-foreground group-hover:text-primary transition-colors">
              {city.name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {city.country}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {city.comment && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {city.comment}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {city.visit_date}
          </div>
        </div>
      </CardContent>
      
      <EditCityDialog
        city={city}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
      
      <ImageCarousel
        images={carouselImages}
        isOpen={showCarousel}
        onClose={() => setShowCarousel(false)}
        initialIndex={carouselIndex}
      />
    </Card>
  );
};

export default CityCard;