export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  type: "sedan" | "suv" | "sports" | "electric";
  image: string;
  specs: {
    engine: string;
    horsepower: number;
    transmission: string;
    fuelType: string;
  };
  featured?: boolean;
}
