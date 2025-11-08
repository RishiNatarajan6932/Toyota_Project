import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/CarCard";
import { CarFilters } from "@/components/CarFilters";
import { cars } from "@/data/cars";
import heroImage from "@/assets/hero-car.jpg";
import { ChevronRight } from "lucide-react";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch =
        search === "" ||
        car.brand.toLowerCase().includes(search.toLowerCase()) ||
        car.model.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = selectedType === "all" || car.type === selectedType;
      
      const matchesBrand = selectedBrand === "all" || car.brand.toLowerCase() === selectedBrand.toLowerCase();

      return matchesSearch && matchesType && matchesBrand;
    });
  }, [search, selectedType, selectedBrand]);

  const featuredCar = cars.find((car) => car.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-foreground">
              <span className="text-primary">Elite</span>Motors
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="hidden md:inline-flex">Inventory</Button>
              <Button variant="ghost" className="hidden md:inline-flex">Finance</Button>
              <Button variant="ghost" className="hidden md:inline-flex">About</Button>
              <Button variant="hero">Contact Us</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Luxury car showcase"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>
        
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Drive Your
            <span className="block text-primary mt-2">Dream Car</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover our collection of premium vehicles crafted for those who demand excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg">
              View Collection
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg">
              Schedule Test Drive
            </Button>
          </div>
        </div>

        {/* Featured Car Info */}
        {featuredCar && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 max-w-md w-full mx-4 animate-slide-up">
            <p className="text-sm text-muted-foreground mb-1">Featured Model</p>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {featuredCar.brand} {featuredCar.model}
            </h3>
            <p className="text-xl text-primary font-semibold">
              From ${featuredCar.price.toLocaleString()}
            </p>
          </div>
        )}
      </section>

      {/* Car Catalog Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Collection
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse through our curated selection of luxury and performance vehicles
            </p>
          </div>

          <CarFilters
            search={search}
            onSearchChange={setSearch}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car, index) => (
              <div
                key={car.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No vehicles match your criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                <span className="text-primary">Elite</span>Motors
              </h3>
              <p className="text-muted-foreground">
                Your destination for luxury and performance vehicles.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Inventory</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Sports Cars</li>
                <li>Sedans</li>
                <li>SUVs</li>
                <li>Electric Vehicles</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Financing</li>
                <li>Trade-In</li>
                <li>Test Drive</li>
                <li>Service Center</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>123 Luxury Lane</li>
                <li>Beverly Hills, CA 90210</li>
                <li>Phone: (555) 123-4567</li>
                <li>info@elitemotors.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 EliteMotors. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
