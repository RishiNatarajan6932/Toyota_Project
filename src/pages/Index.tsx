import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/CarCard";
import { CarFilters } from "@/components/CarFilters";
import { cars } from "@/data/cars";
import heroImage from "@/assets/hero-car.jpg";
import { ChevronRight, Shield, Zap, Award, DollarSign, MessageSquare, Sparkles } from "lucide-react";

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
      
      const matchesBrand = selectedBrand === "all" || car.model.toLowerCase() === selectedBrand.toLowerCase();

      return matchesSearch && matchesType && matchesBrand;
    });
  }, [search, selectedType, selectedBrand]);

  const featuredCar = cars.find((car) => car.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-3xl font-bold text-primary tracking-tight">
              TOYOTA
            </h1>
            <div className="flex items-center gap-6">
              <Button variant="ghost" className="hidden md:inline-flex">Vehicles</Button>
              <Button variant="ghost" className="hidden md:inline-flex">Shopping Tools</Button>
              <Button variant="ghost" className="hidden md:inline-flex">Owners</Button>
              <Link to="/reviews">
                <Button variant="ghost" className="hidden md:inline-flex">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reviews
                </Button>
              </Link>
              <Link to="/matching">
                <Button variant="ghost" className="hidden md:inline-flex">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Personalized Match
                </Button>
              </Link>
              <Link to="/financial">
                <Button variant="ghost" className="hidden md:inline-flex">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Financing
                </Button>
              </Link>
              <Button variant="default">Find a Dealer</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Toyota vehicles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/50 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 animate-fade-in">
          <div className="max-w-2xl">
            <p className="text-primary font-semibold mb-4 text-lg">Welcome to Toyota</p>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Let's Go Places
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Discover the perfect Toyota for your journey. From fuel-efficient sedans to rugged SUVs, 
              we have a vehicle that fits your lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg">
                View All Vehicles
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg border-2">
                Build & Price
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Car Info */}
        {featuredCar && (
          <div className="absolute bottom-8 right-8 bg-card backdrop-blur-sm border-2 border-primary/20 rounded-lg p-6 max-w-sm animate-slide-up shadow-card hidden lg:block">
            <p className="text-sm text-muted-foreground mb-1">Featured Model</p>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              2024 {featuredCar.model}
            </h3>
            <p className="text-xl text-primary font-semibold mb-3">
              Starting at ${featuredCar.price.toLocaleString()}
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Learn More
            </Button>
          </div>
        )}
      </section>

      {/* Why Toyota Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Reliability</h3>
              <p className="text-muted-foreground">
                Trusted quality and dependability in every vehicle we build
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                Leading the way in hybrid and electric vehicle technology
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Value</h3>
              <p className="text-muted-foreground">
                Exceptional resale value and low cost of ownership
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Car Catalog Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore Our Lineup
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect Toyota vehicle to match your needs and budget
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Visit your local Toyota dealer today for a test drive or explore our inventory online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-lg">
              Find a Dealer
            </Button>
            <Button variant="outline" size="lg" className="text-lg border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              Request a Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                TOYOTA
              </h3>
              <p className="text-muted-foreground">
                Start Your Impossible
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Shop</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition-colors">All Vehicles</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Hybrid & Electric</li>
                <li className="hover:text-primary cursor-pointer transition-colors">SUVs & Trucks</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Cars & Minivans</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Owners</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition-colors">Owner Resources</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Service & Parts</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Recalls & Campaigns</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Warranty</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Find a Dealer</li>
                <li className="hover:text-primary cursor-pointer transition-colors">FAQs</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Careers</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
            <p>&copy; 2024 Toyota Motor Corporation. All rights reserved.</p>
            <p className="mt-2">Privacy Policy | Terms of Use | Legal</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
