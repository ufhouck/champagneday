export interface PhotoPost {
  id: string;
  imageUrl: string;
  timestamp: number;
  weather: {
    temp: number;
    windSpeed: number;
    precipMm: number;
    condition: string;
  };
}

export interface PhotoUploadData {
  imageData: string;
  weather: PhotoPost['weather'];
}