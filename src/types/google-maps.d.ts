// src/types/google-maps.d.ts
declare namespace google {
  namespace maps {
    interface MapMouseEvent {
      latLng: google.maps.LatLng | null;
    }
    
    class LatLng {
      lat(): number;
      lng(): number;
    }
  }
}