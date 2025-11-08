import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface CarFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedBrand: string;
  onBrandChange: (value: string) => void;
}

export const CarFilters = ({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedBrand,
  onBrandChange,
}: CarFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search by brand or model..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-card border-border focus:border-primary"
        />
      </div>
      
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full md:w-[180px] bg-card border-border">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="sedan">Sedan</SelectItem>
          <SelectItem value="suv">SUV</SelectItem>
          <SelectItem value="sports">Sports</SelectItem>
          <SelectItem value="electric">Electric</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={selectedBrand} onValueChange={onBrandChange}>
        <SelectTrigger className="w-full md:w-[180px] bg-card border-border">
          <SelectValue placeholder="All Brands" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Brands</SelectItem>
          <SelectItem value="bmw">BMW</SelectItem>
          <SelectItem value="mercedes-benz">Mercedes-Benz</SelectItem>
          <SelectItem value="porsche">Porsche</SelectItem>
          <SelectItem value="tesla">Tesla</SelectItem>
          <SelectItem value="audi">Audi</SelectItem>
          <SelectItem value="maserati">Maserati</SelectItem>
          <SelectItem value="lamborghini">Lamborghini</SelectItem>
          <SelectItem value="range rover">Range Rover</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
