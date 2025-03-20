export interface Location {
  lat: number;
  lng: number;
}

export interface GameState {
  currentLocation: Location;
  guessedLocation: Location | null;
  score: number | null;
  distance: number | null;
  isGameOver: boolean;
  currentRound: number;
  totalScore: number;
  gameStarted: boolean;
}

export interface HistoryScore {
  score: number;
  date: string;
}

// Régions du monde avec une forte couverture Street View
export const WORLD_REGIONS = [
  { minLat: 35.0, maxLat: 60.0, minLng: -10.0, maxLng: 28.0 },  // Europe
  { minLat: 25.0, maxLat: 50.0, minLng: -130.0, maxLng: -70.0 }, // USA
  { minLat: -45.0, maxLat: -20.0, minLng: 145.0, maxLng: 180.0 }, // Nouvelle-Zélande
  { minLat: -35.0, maxLat: -10.0, minLng: 110.0, maxLng: 155.0 }, // Australie
  { minLat: 20.0, maxLat: 45.0, minLng: 120.0, maxLng: 145.0 }, // Japon
  { minLat: 35.0, maxLat: 40.0, minLng: 125.0, maxLng: 130.0 }, // Corée du Sud
  { minLat: -35.0, maxLat: 5.0, minLng: -75.0, maxLng: -35.0 }, // Brésil
];

export const getRandomLocation = async (maps: typeof google.maps): Promise<Location> => {
  const sv = new google.maps.StreetViewService();
  
  while (true) {
    const region = WORLD_REGIONS[Math.floor(Math.random() * WORLD_REGIONS.length)];
    const lat = region.minLat + Math.random() * (region.maxLat - region.minLat);
    const lng = region.minLng + Math.random() * (region.maxLng - region.minLng);
    
    try {
      const result = await sv.getPanorama({
        location: { lat, lng },
        radius: 50000,
        preference: google.maps.StreetViewPreference.BEST,
        source: google.maps.StreetViewSource.OUTDOOR
      });
      
      return {
        lat: result.data.location?.latLng?.lat() || lat,
        lng: result.data.location?.latLng?.lng() || lng
      };
    } catch (error) {
      console.log('Retrying random location...');
    }
  }
};