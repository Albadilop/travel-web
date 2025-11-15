import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, MapPin, Star, Upload, Loader2, X } from 'lucide-react';
import { useCities } from '@/hooks/useCities';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddCityDialogProps {
  trigger?: React.ReactNode;
}

const AddCityDialog = ({ trigger }: AddCityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    latitude: '',
    longitude: '',
    rating: 5,
    visit_date: '',
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { addCity } = useCities();
  const { toast } = useToast();

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
            title: "Coordenadas encontradas",
            description: `${data.placeName || name} geocodificado automáticamente.`,
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
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: `${file.name} no es un archivo de imagen válido.`,
          variant: "destructive",
        });
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: `${file.name} es demasiado grande. Máximo 5MB.`,
          variant: "destructive",
        });
        continue;
      }

      validFiles.push(file);
    }

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 10)); // Max 10 images
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

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
      return null;
    }
  };

  const uploadCityImages = async (cityId: string, imageUrls: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const imageRecords = imageUrls.map(imageUrl => ({
        city_id: cityId,
        image_url: imageUrl,
        user_id: user.id,
      }));

      const { error } = await supabase
        .from('city_images')
        .insert(imageRecords);

      if (error) throw error;
    } catch (error) {
      console.error('Error uploading city images:', error);
      toast({
        title: "Advertencia",
        description: "La ciudad se creó pero hubo un problema con las imágenes.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create the city
      const newCity = await addCity({
        name: formData.name,
        country: formData.country,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        rating: formData.rating,
        visit_date: formData.visit_date,
        comment: formData.comment || undefined,
      });

      if (newCity && selectedFiles.length > 0) {
        setUploading(true);
        
        // Upload all images
        const uploadPromises = selectedFiles.map(file => uploadImage(file));
        const uploadResults = await Promise.all(uploadPromises);
        const successfulUploads = uploadResults.filter(url => url !== null) as string[];
        
        if (successfulUploads.length > 0) {
          await uploadCityImages(newCity.id, successfulUploads);
        }

        if (successfulUploads.length !== selectedFiles.length) {
          toast({
            title: "Advertencia",
            description: `Solo ${successfulUploads.length} de ${selectedFiles.length} imágenes se subieron correctamente.`,
            variant: "destructive",
          });
        }
      }

      if (newCity) {
        setFormData({
          name: '',
          country: '',
          latitude: '',
          longitude: '',
          rating: 5,
          visit_date: '',
          comment: '',
        });
        setSelectedFiles([]);
        setOpen(false);
      }
    } catch (error) {
      console.error('Error adding city:', error);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const defaultTrigger = (
    <Button className="bg-gradient-warm hover:opacity-90 transition-all duration-300">
      <Plus className="h-4 w-4 mr-2" />
      Añadir Ciudad
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-poppins">
            <MapPin className="h-5 w-5 text-primary" />
            Añadir Nueva Ciudad
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ciudad *</Label>
              <div className="relative">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleCityChange(e.target.value)}
                  placeholder="París"
                  required
                />
                {geocoding && (
                  <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">País *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                placeholder="Francia"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitud *</Label>
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
              <Label htmlFor="longitude">Longitud *</Label>
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
              <Label htmlFor="rating">Valoración *</Label>
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
                <Star className="h-4 w-4 text-accent fill-current" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit_date">Fecha de Visita *</Label>
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
            <Label>Imágenes de la Ciudad</Label>
            <div>
              <Label htmlFor="image-files" className="cursor-pointer">
                <div className="flex items-center justify-center w-full h-20 border-2 border-dashed border-muted-foreground/25 rounded-md hover:border-muted-foreground/50 transition-colors">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">
                      Seleccionar imágenes ({selectedFiles.length}/10)
                    </span>
                  </div>
                </div>
              </Label>
              <input
                id="image-files"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            
            {/* Selected images preview */}
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-muted rounded-md flex items-center justify-center text-xs p-2 text-center">
                      {file.name}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comentarios</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Comparte tus recuerdos de esta ciudad..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || uploading || geocoding}
              className="flex-1 bg-gradient-warm hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Añadiendo...
                </>
              ) : uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Subiendo imágenes...
                </>
              ) : (
                'Añadir Ciudad'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCityDialog;