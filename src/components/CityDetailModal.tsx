import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Calendar, MapPin, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ImageCarousel from "./ImageCarousel";
import type { City } from "@/hooks/useCities";

interface CityImage {
  id: string;
  image_url: string;
}

interface CityDetailModalProps {
  city: City | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CityDetailModal = ({ city, open, onOpenChange }: CityDetailModalProps) => {
  const [images, setImages] = useState<CityImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    if (city && open) {
      fetchCityImages();
    }
  }, [city, open]);

  const fetchCityImages = async () => {
    if (!city) return;
    
    setLoadingImages(true);
    try {
      const { data, error } = await supabase
        .from('city_images')
        .select('id, image_url')
        .eq('city_id', city.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching city images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  if (!city) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MapPin className="h-5 w-5 text-primary" />
              {city.name}, {city.country}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Rating and Visit Date */}
            <div className="flex items-center gap-4 flex-wrap">
              <Badge className="bg-accent/20 text-accent border-accent/30 flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                {city.rating}/5
              </Badge>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Visitada el {city.visit_date}</span>
              </div>
            </div>

            {/* Comment */}
            {city.comment && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Comentarios</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {city.comment}
                </p>
              </div>
            )}

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Fotos ({images.length})
                </h3>
                {images.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCarousel(true)}
                  >
                    Ver Galería
                  </Button>
                )}
              </div>

              {loadingImages ? (
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : images.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {images.slice(0, 6).map((image, index) => (
                    <div
                      key={image.id}
                      className="aspect-square relative group cursor-pointer rounded-lg overflow-hidden"
                      onClick={() => setShowCarousel(true)}
                    >
                      <img
                        src={image.image_url}
                        alt={`${city.name} - ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {index === 5 && images.length > 6 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            +{images.length - 6}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay fotos disponibles</p>
                </div>
              )}
            </div>

            {/* Location Info */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Ubicación</h3>
              <p className="text-muted-foreground text-sm">
                Coordenadas: {city.latitude}°, {city.longitude}°
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Carousel */}
      <ImageCarousel
        images={images}
        isOpen={showCarousel}
        onClose={() => setShowCarousel(false)}
      />
    </>
  );
};

export default CityDetailModal;