import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from "lucide-react";

interface CityCardImageProps {
  cityId: string;
  cityName: string;
  country: string;
}

const CityCardImage = ({ cityId, cityName, country }: CityCardImageProps) => {
  const [firstImage, setFirstImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFirstImage();
  }, [cityId]);

  const fetchFirstImage = async () => {
    try {
      const { data, error } = await supabase
        .from('city_images')
        .select('image_url')
        .eq('city_id', cityId)
        .order('created_at', { ascending: true })
        .limit(1);

      if (error) throw error;
      setFirstImage(data && data.length > 0 ? data[0].image_url : null);
    } catch (error) {
      console.error('Error fetching city image:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-gradient-soft animate-pulse flex items-center justify-center">
        <MapPin className="h-12 w-12 text-muted-foreground opacity-50" />
      </div>
    );
  }

  return firstImage ? (
    <img 
      src={firstImage} 
      alt={`${cityName}, ${country}`}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  ) : (
    <div className="w-full h-full bg-gradient-soft flex items-center justify-center">
      <MapPin className="h-12 w-12 text-muted-foreground" />
    </div>
  );
};

export default CityCardImage;