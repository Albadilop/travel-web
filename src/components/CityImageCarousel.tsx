import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Image {
  id: string;
  image_url: string;
}

interface CityImageCarouselProps {
  cityId: string;
  cityName: string;
  country: string;
  onImageClick?: (images: Image[], index: number) => void;
}

const CityImageCarousel = ({ cityId, cityName, country, onImageClick }: CityImageCarouselProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, [cityId]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('city_images')
        .select('id, image_url')
        .eq('city_id', cityId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching city images:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = () => {
    if (onImageClick && images.length > 0) {
      onImageClick(images, currentIndex);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-gradient-soft animate-pulse flex items-center justify-center">
        <MapPin className="h-12 w-12 text-muted-foreground opacity-50" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-soft flex items-center justify-center">
        <MapPin className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <img 
        src={images[currentIndex]?.image_url} 
        alt={`${cityName}, ${country}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
        onClick={handleImageClick}
      />
      
      {images.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CityImageCarousel;