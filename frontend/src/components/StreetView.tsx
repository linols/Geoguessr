import React, { useEffect, useRef } from 'react';
import { Location } from '../types/maps';

interface StreetViewProps {
  position: Location;
  onLoaded?: () => void;
}

const StreetView: React.FC<StreetViewProps> = ({ position, onLoaded }) => {
  const streetViewRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    if (streetViewRef.current && !panoramaRef.current) {
      panoramaRef.current = new google.maps.StreetViewPanorama(streetViewRef.current, {
        position,
        pov: { heading: 0, pitch: 0 },
        zoom: 1,
        addressControl: false,
        showRoadLabels: false,
        motionTracking: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        panControl: true,
        panControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        streetViewControl: false,
        enableCloseButton: false,
        linksControl: false
      });
      onLoaded?.();
    } else if (panoramaRef.current) {
      panoramaRef.current.setPosition(position);
    }
  }, [position, onLoaded]);

  return <div ref={streetViewRef} className="w-full h-full rounded-lg overflow-hidden" />;
};

export default StreetView;