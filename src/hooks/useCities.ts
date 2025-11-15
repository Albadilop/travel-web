import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  rating: number;
  visit_date: string;
  comment?: string;
}

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('visit_date', { ascending: false });

      if (error) throw error;
      setCities(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las ciudades. Inicia sesión para ver tus datos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCity = async (id: string, cityData: Partial<Omit<City, 'id'>>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para editar ciudades.",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase
        .from('cities')
        .update(cityData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setCities(prev => prev.map(city => 
        city.id === id ? { ...city, ...data } : city
      ));
      
      toast({
        title: "¡Éxito!",
        description: "Ciudad actualizada correctamente.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la ciudad.",
        variant: "destructive",
      });
      return false;
    }
  };

  const addCity = async (cityData: Omit<City, 'id'>): Promise<City | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para añadir ciudades.",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('cities')
        .insert([{ ...cityData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setCities(prev => [data, ...prev]);
      toast({
        title: "¡Éxito!",
        description: `${cityData.name} añadida a tu diario de viajes.`,
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo añadir la ciudad.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteCity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCities(prev => prev.filter(city => city.id !== id));
      toast({
        title: "Ciudad eliminada",
        description: "La ciudad ha sido eliminada de tu diario.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la ciudad.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCities();

    // Set up real-time subscription
    const subscription = supabase
      .channel('cities_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cities' }, 
        () => {
          fetchCities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    cities,
    loading,
    addCity,
    updateCity,
    deleteCity,
    refetch: fetchCities,
  };
};