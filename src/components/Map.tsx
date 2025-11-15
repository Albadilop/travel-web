import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import CityDetailModal from './CityDetailModal';
import type { City } from '@/hooks/useCities';

interface MapProps {
  cities?: City[];
}

const Map = ({ cities = [] }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [tokenInput, setTokenInput] = useState<string>('');
  const [loadingToken, setLoadingToken] = useState(true);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);

  // Try to get Mapbox token from Supabase secrets
  useEffect(() => {
        const getMapboxToken = async () => {
          try {
            // Try the edge function approach
            const response = await fetch(`https://jrwzizmlybdxkmcijpug.supabase.co/functions/v1/get-mapbox-token`, {
              headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyd3ppem1seWJkeGttY2lqcHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTY0MjQsImV4cCI6MjA3MzY3MjQyNH0.bSNlseRbcivSP0-d1nZn5NwXZsshAQNeM2-ip5Pcnyg`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.token) {
                setAccessToken(data.token);
              }
            }
          } catch (error) {
            console.log('Could not get Mapbox token from server:', error);
          } finally {
            setLoadingToken(false);
          }
        };

    getMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !accessToken) return;

    // Initialize map
    mapboxgl.accessToken = accessToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [30, 15],
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Disable scroll zoom for smoother experience
    map.current.scrollZoom.disable();

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });

      // Add city markers
      cities.forEach((city) => {
        if (map.current) {
          // Create marker element
          const markerEl = document.createElement('div');
          markerEl.className = 'custom-marker';
          markerEl.style.cssText = `
            width: 20px;
            height: 20px;
            background: hsl(33 100% 50%);
            border: 2px solid white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          `;

          // Add click handler to marker
          markerEl.addEventListener('click', () => {
            setSelectedCity(city);
            setShowCityModal(true);
          });

          // Add marker to map
          new mapboxgl.Marker(markerEl)
            .setLngLat([city.longitude, city.latitude])
            .addTo(map.current);
        }
      });
    });

    // Rotation animation settings
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    // Spin globe function
    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Event listeners for interaction
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    // Start the globe spinning
    spinGlobe();

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [accessToken, cities]);

  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      setAccessToken(tokenInput.trim());
    }
  };

  if (loadingToken) {
    return (
      <div className="relative w-full h-96 bg-gradient-soft rounded-lg border border-border flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
            <MapPin className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold font-poppins text-foreground mb-2">
            Cargando Mapa...
          </h3>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="relative w-full h-96 bg-gradient-soft rounded-lg border border-border flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold font-poppins text-foreground mb-2">
            Configura tu Mapa
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Para mostrar el mapa interactivo, necesitas un token de acceso de Mapbox. 
            Visita <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a> para obtener tu token público.
          </p>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Ingresa tu token de Mapbox..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="text-center"
            />
            <Button 
              onClick={handleTokenSubmit}
              className="w-full bg-gradient-warm hover:opacity-90"
            >
              Activar Mapa
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-card">
        <div ref={mapContainer} className="absolute inset-0" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5 rounded-lg" />
      </div>
      
      <CityDetailModal
        city={selectedCity}
        open={showCityModal}
        onOpenChange={(open) => {
          setShowCityModal(open);
          if (!open) setSelectedCity(null);
        }}
      />
    </>
  );
};

export default Map;