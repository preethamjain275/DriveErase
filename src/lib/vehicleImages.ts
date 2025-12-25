import carCreta from "@/assets/car-creta.png";
import carInnova from "@/assets/car-innova.png";
import carCiaz from "@/assets/car-ciaz.png";
import carScorpio from "@/assets/car-scorpio.png";
import carSwift from "@/assets/car-swift.png";

const vehicleImageMap: Record<string, string> = {
  "/car-creta.png": carCreta,
  "/car-innova.png": carInnova,
  "/car-ciaz.png": carCiaz,
  "/car-scorpio.png": carScorpio,
  "/car-swift.png": carSwift,
};

export const getVehicleImage = (imageUrl: string | null): string => {
  if (!imageUrl) return carSwift;
  return vehicleImageMap[imageUrl] || carSwift;
};

export { carCreta, carInnova, carCiaz, carScorpio, carSwift };
