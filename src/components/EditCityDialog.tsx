import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Star, Upload, Loader2, X } from 'lucide-react';
import { useCities, type City } from '@/hooks/useCities';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface EditCityDialogProps {
  city: City;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditCityDialog = ({ city, open, onOpenChange }: EditCityDialogProps) => {
  const [formData, setFormData] = useState({
    name: city.name,
    country: city.country,
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    rating: city.rating,
    visit_date: city.visit_date,
    comment: city.comment || '',
  });
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { updateCity } = useCities();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Auto-geocode when city name and country change
  const handleCityChange = useCallback(async (name: string) => {
    setFormData(prev => ({ ...prev, name }));
    
    if (name.trim().length > 2 && formData.country.trim().length > 0) {
      setGeocoding(true);
      try {
        const { data, error } = await supabase.functions.invoke('geocode-city', {
          body: { cityName: name.trim(), country: formData.country.trim() }
        });

        if (error) throw error;

        if (data && data.latitude && data.longitude) {
          setFormData(prev => ({
            ...prev,
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString()
          }));
          toast({
            title: t('editCity.coordinatesFound'),
            description: t('editCity.coordinatesFoundDesc', { placeName: data.placeName || name }),
          });
        }
      } catch (error) {
        console.log('Geocoding failed:', error);
      } finally {
        setGeocoding(false);
      }
    }
  }, [formData.country, toast]);

  const handleCountryChange = useCallback(async (country: string) => {
    setFormData(prev => ({ ...prev, country }));
    
    if (country.trim().length > 0 && formData.name.trim().length > 2) {
      setGeocoding(true);
      try {
        const { data, error } = await supabase.functions.invoke('geocode-city', {
          body: { cityName: formData.name.trim(), country: country.trim() }
        });

        if (error) throw error;

        if (data && data.latitude && data.longitude) {
          setFormData(prev => ({
            ...prev,
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString()
          }));
          toast({
            title: "Coordenadas encontradas",
            description: `${data.placeName || formData.name} geocodificado automáticamente.`,
          });
        }
      } catch (error) {
        console.log('Geocoding failed:', error);
      } finally {
        setGeocoding(false);
      }
    }
  }, [formData.name, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: t('editCity.error'),
          description: t('editCity.invalidImage'),
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t('editCity.error'),
          description: t('editCity.fileTooLarge'),
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('city-images')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('city-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      toast({
        title: t('editCity.error'),
        description: t('editCity.uploadError'),
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image if file selected and add to city_images table
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (uploadedUrl) {
          // Add new image to city_images table
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('city_images')
              .insert({
                city_id: city.id,
                image_url: uploadedUrl,
                user_id: user.id,
              });
          }
        }
      }

      const success = await updateCity(city.id, {
        name: formData.name,
        country: formData.country,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        rating: formData.rating,
        visit_date: formData.visit_date,
        comment: formData.comment || undefined,
      });

      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating city:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-poppins">
            <MapPin className="h-5 w-5 text-primary" />
            {t('editCity.title')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('editCity.city')} {t('common.required')}</Label>
              <div className="relative">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleCityChange(e.target.value)}
                  placeholder={t('editCity.cityPlaceholder')}
                  required
                />
                {geocoding && (
                  <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">{t('editCity.country')} {t('common.required')}</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                placeholder={t('editCity.countryPlaceholder')}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">{t('editCity.latitude')} {t('common.required')}</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                placeholder="48.8566"
                required
                readOnly={geocoding}
                className={geocoding ? "bg-muted" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">{t('editCity.longitude')} {t('common.required')}</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                placeholder="2.3522"
                required
                readOnly={geocoding}
                className={geocoding ? "bg-muted" : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">{t('editCity.rating')} {t('common.required')}</Label>
              <div className="flex items-center gap-2">
                <select
                  id="rating"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <Star className="h-4 w-4 text-orange-500 fill-orange-500 hover:text-orange-500 hover:fill-orange-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit_date">{t('editCity.visitDate')} {t('common.required')}</Label>
              <Input
                id="visit_date"
                type="date"
                value={formData.visit_date}
                onChange={(e) => setFormData(prev => ({ ...prev, visit_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('editCity.changeImage')}</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="image-file" className="cursor-pointer">
                  <div className="flex items-center justify-center w-full h-20 border-2 border-dashed border-muted-foreground/25 rounded-md hover:border-muted-foreground/50 transition-colors">
                    {selectedFile ? (
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">{selectedFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedFile(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">{t('editCity.selectNewImage')}</span>
                      </div>
                    )}
                  </div>
                </Label>
                <input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">{t('editCity.comment')}</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder={t('editCity.commentPlaceholder')}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {t('editCity.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading || uploading || geocoding}
              className="flex-1 bg-gradient-warm hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('editCity.saving')}
                </>
              ) : uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('editCity.uploading')}
                </>
              ) : (
                t('editCity.save')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCityDialog;