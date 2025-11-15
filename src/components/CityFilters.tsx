import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CityFiltersProps {
  filters: {
    rating: number | null;
    year: number | null;
    month: number | null;
  };
  onFiltersChange: (filters: any) => void;
}

const CityFilters = ({ filters, onFiltersChange }: CityFiltersProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  const clearAllFilters = () => {
    onFiltersChange({ rating: null, year: null, month: null });
  };

  const hasActiveFilters = filters.rating || filters.year || filters.month;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Valoración mínima</label>
            <Select
              value={filters.rating?.toString() || ""}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, rating: value ? parseInt(value) : null })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ 5</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ 4+</SelectItem>
                <SelectItem value="3">⭐⭐⭐ 3+</SelectItem>
                <SelectItem value="2">⭐⭐ 2+</SelectItem>
                <SelectItem value="1">⭐ 1+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Año</label>
            <Select
              value={filters.year?.toString() || ""}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, year: value ? parseInt(value) : null })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Mes</label>
            <Select
              value={filters.month?.toString() || ""}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, month: value ? parseInt(value) : null })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpiar Filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default CityFilters;