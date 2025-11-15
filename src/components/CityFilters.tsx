import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CityFiltersProps {
  filters: {
    rating: number | null;
    year: number | null;
    month: number | null;
  };
  onFiltersChange: (filters: any) => void;
}

const CityFilters = ({ filters, onFiltersChange }: CityFiltersProps) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: t('filters.months.1') },
    { value: 2, label: t('filters.months.2') },
    { value: 3, label: t('filters.months.3') },
    { value: 4, label: t('filters.months.4') },
    { value: 5, label: t('filters.months.5') },
    { value: 6, label: t('filters.months.6') },
    { value: 7, label: t('filters.months.7') },
    { value: 8, label: t('filters.months.8') },
    { value: 9, label: t('filters.months.9') },
    { value: 10, label: t('filters.months.10') },
    { value: 11, label: t('filters.months.11') },
    { value: 12, label: t('filters.months.12') },
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
            <label className="text-sm font-medium text-foreground">{t('filters.minRating')}</label>
            <Select
              value={filters.rating?.toString() || "all"}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, rating: value === "all" ? null : parseInt(value) })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('filters.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.all')}</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ 5</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ 4+</SelectItem>
                <SelectItem value="3">⭐⭐⭐ 3+</SelectItem>
                <SelectItem value="2">⭐⭐ 2+</SelectItem>
                <SelectItem value="1">⭐ 1+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">{t('filters.year')}</label>
            <Select
              value={filters.year?.toString() || "all"}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, year: value === "all" ? null : parseInt(value) })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('filters.allYears')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allYears')}</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">{t('filters.month')}</label>
            <Select
              value={filters.month?.toString() || "all"}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, month: value === "all" ? null : parseInt(value) })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('filters.allMonths')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allMonths')}</SelectItem>
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
            {t('filters.clearFilters')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CityFilters;