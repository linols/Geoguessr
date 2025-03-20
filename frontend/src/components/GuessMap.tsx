import React, { useEffect, useRef, useState } from 'react';
import { Location } from '../types/maps';

interface GuessMapProps {
  onGuess: (location: Location) => void;
  disabled?: boolean;
  actualLocation?: Location;
  guessedLocation?: Location | null;
}

const GuessMap: React.FC<GuessMapProps> = ({ onGuess, disabled, actualLocation, guessedLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [guessLine, setGuessLine] = useState<google.maps.Polyline | null>(null);
  const [actualMarker, setActualMarker] = useState<google.maps.Marker | null>(null);

  const clearMapElements = () => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    if (guessLine) {
      guessLine.setMap(null);
      setGuessLine(null);
    }
    if (actualMarker) {
      actualMarker.setMap(null);
      setActualMarker(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControl: false,
        rotateControl: false,
        gestureHandling: 'greedy',
        styles: [
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'road.local',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (disabled || !e.latLng) return;

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        const svgMarker = {
          path: 'M12 0C7.31 0 3.5 3.81 3.5 8.5c0 7.1 8.5 15.5 8.5 15.5s8.5-8.4 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 11.5c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z',
          fillColor: '#EF4444',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
          scale: 1.5,
          anchor: new google.maps.Point(12, 24),
        };

        const newMarker = new google.maps.Marker({
          position: e.latLng,
          map: newMap,
          icon: svgMarker,
          animation: google.maps.Animation.DROP,
        });

        markerRef.current = newMarker;

        onGuess({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });
      });

      setMap(newMap);
    }

    return () => {
      clearMapElements();
    };
  }, [map, disabled, onGuess]);

  useEffect(() => {
    if (map && actualLocation && guessedLocation) {
      clearMapElements();

      const newLine = new google.maps.Polyline({
        path: [actualLocation, guessedLocation],
        geodesic: true,
        strokeColor: '#EF4444',
        strokeOpacity: 0.8,
        strokeWeight: 3,
      });
      newLine.setMap(map);
      setGuessLine(newLine);

      const actualSvgMarker = {
        path: 'M12 0C7.31 0 3.5 3.81 3.5 8.5c0 7.1 8.5 15.5 8.5 15.5s8.5-8.4 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 11.5c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z',
        fillColor: '#10B981',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff',
        scale: 1.5,
        anchor: new google.maps.Point(12, 24),
      };

      const newActualMarker = new google.maps.Marker({
        position: actualLocation,
        map,
        icon: actualSvgMarker,
        animation: google.maps.Animation.DROP,
      });
      setActualMarker(newActualMarker);

      const guessSvgMarker = {
        path: 'M12 0C7.31 0 3.5 3.81 3.5 8.5c0 7.1 8.5 15.5 8.5 15.5s8.5-8.4 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 11.5c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z',
        fillColor: '#EF4444',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff',
        scale: 1.5,
        anchor: new google.maps.Point(12, 24),
      };

      const newGuessMarker = new google.maps.Marker({
        position: guessedLocation,
        map,
        icon: guessSvgMarker,
        animation: google.maps.Animation.DROP,
      });
      markerRef.current = newGuessMarker;

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(actualLocation);
      bounds.extend(guessedLocation);
      map.fitBounds(bounds, 50);
    }
  }, [map, actualLocation, guessedLocation]);

  const shouldAllowExpand = !disabled;

  return (
    <div 
      ref={containerRef}
      className={`relative transition-all duration-300 ease-in-out ${
        shouldAllowExpand && isExpanded ? 'w-[600px] h-[400px]' : 'w-[300px] h-[200px]'
      }`}
      onMouseEnter={() => shouldAllowExpand && setIsExpanded(true)}
    >
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden shadow-xl" />
    </div>
  );
};

export default GuessMap;