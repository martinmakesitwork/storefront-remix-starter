"use client"

import * as React from "react"; // Ensure React is imported
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PriceRangeSlider } from "~/components/ui/price-range-slider"; // Import PriceRangeSlider
import { cn } from "~/lib/utils"; // Assuming cn is in lib/utils

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

export interface FilterCategory { // Exporting for use in the page component
  id: string;
  name: string;
  options: FilterOption[];
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FilterCategory[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (
    categoryId: string,
    optionId: string,
    isChecked: boolean
  ) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  productCount: number;
  priceRange?: [number, number]; // Optional: current price range
  onPriceChange?: (value: [number, number]) => void; // Optional: handler for price change
  minPrice?: number; // Optional: overall min price for slider
  maxPrice?: number; // Optional: overall max price for slider
}

export function FilterSidebar({
  isOpen,
  onClose,
  categories,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  productCount,
  priceRange,
  onPriceChange,
  minPrice = 0, // Default min price
  maxPrice = 100000, // Default max price
}: FilterSidebarProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    categories.forEach((category) => {
      initialOpenState[category.id] = true; // Default to open
    });
    setOpenCategories(initialOpenState);
  }, [categories]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose} // Close when clicking on the overlay
    >
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 transform",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} // Added type for e
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold">Filter</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-10 w-10 flex items-center justify-center"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="p-4">
            {/* Price Range Slider Section */}
            {priceRange && onPriceChange && (
              <Collapsible open={openCategories['price'] !== false} onOpenChange={() => toggleCategory('price')} className="mb-4">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="p-0 hover:bg-transparent w-full justify-start">
                    <h3 className="text-sm font-medium">Preis</h3>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pt-2 pb-4 ml-1">
                    <PriceRangeSlider
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange}
                      onValueChange={onPriceChange}
                      step={10} // Or your desired step
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Attribute Filters */}
            {categories.map((category) => (
              <Collapsible
                key={category.id}
                open={openCategories[category.id]}
                onOpenChange={() => toggleCategory(category.id)}
                className="mb-4"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="p-0 hover:bg-transparent w-full justify-start">
                    <h3 className="text-sm font-medium">{category.name}</h3>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 ml-1 mt-1">
                    {category.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`${category.id}-${option.id}`}
                          checked={
                            selectedFilters[category.id]?.includes(option.id) ||
                            false
                          }
                          onCheckedChange={(checked: boolean | 'indeterminate') => { // Added type for checked
                            onFilterChange(
                              category.id,
                              option.id,
                              checked === true
                            );
                          }}
                        />
                        <label
                          htmlFor={`${category.id}-${option.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full cursor-pointer"
                        >
                          <span>{option.label}</span>
                          <span className="text-gray-500">({option.count})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Zurücksetzen
            </Button>
            <span className="text-sm text-gray-500">
              {productCount} Produkte
            </span>
          </div>
          <Button className="w-full" onClick={onApplyFilters}>
            Filter anwenden
          </Button>
        </div>
      </div>
    </div>
  );
}