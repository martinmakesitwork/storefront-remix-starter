"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"

// Sample filter data - in a real app, this would be dynamic based on available products
const filterCategories = [
  {
    id: "category",
    name: "Category",
    options: [
      {
        id: "robots",
        name: "Robots",
        count: 24,
        subcategories: [
          { id: "humanoid", name: "Humanoid", count: 8 },
          { id: "industrial", name: "Industrial", count: 12 },
          { id: "collaborative", name: "Collaborative", count: 4 },
        ],
      },
      { id: "automation", name: "Automation Systems", count: 18 },
      { id: "sensors", name: "Sensors & Controls", count: 32 },
      { id: "software", name: "Software Solutions", count: 15 },
    ],
  },
  {
    id: "availability",
    name: "Availability",
    options: [
      { id: "in-stock", name: "In Stock", count: 64 },
      { id: "pre-order", name: "Pre-order", count: 12 },
      { id: "custom", name: "Custom Order", count: 8 },
    ],
  },
  {
    id: "certification",
    name: "Certification",
    options: [
      { id: "iso", name: "ISO Certified", count: 42 },
      { id: "ce", name: "CE Marking", count: 56 },
      { id: "ul", name: "UL Listed", count: 28 },
    ],
  },
]

export default function ProductFilters() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    category: [],
    subcategory: [],
    availability: [],
    certification: [],
  })

  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(categoryId)
    }
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = [...prev[filterType]]
      if (current.includes(value)) {
        return { ...prev, [filterType]: current.filter((item) => item !== value) }
      } else {
        return { ...prev, [filterType]: [...current, value] }
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Filter Products</h3>
      </div>

      {filterCategories.map((category) => (
        <Accordion key={category.id} type="single" collapsible defaultValue={category.id}>
          <AccordionItem value={category.id} className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium">{category.name}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1 pb-2">
                {category.options.map((option) => (
                  <div key={option.id}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${category.id}-${option.id}`}
                        checked={selectedFilters[category.id]?.includes(option.id)}
                        onCheckedChange={() => handleFilterChange(category.id, option.id)}
                      />
                      <Label
                        htmlFor={`${category.id}-${option.id}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                        onClick={() => option.subcategories && handleCategoryChange(option.id)}
                      >
                        {option.name} <span className="text-gray-500 text-xs">({option.count})</span>
                      </Label>
                    </div>

                    {/* Show subcategories if this category is selected */}
                    {option.subcategories && selectedCategory === option.id && (
                      <div className="ml-6 mt-2 space-y-2">
                        {option.subcategories.map((sub) => (
                          <div key={sub.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`subcategory-${sub.id}`}
                              checked={selectedFilters.subcategory?.includes(sub.id)}
                              onCheckedChange={() => handleFilterChange("subcategory", sub.id)}
                            />
                            <Label htmlFor={`subcategory-${sub.id}`} className="text-sm font-normal cursor-pointer">
                              {sub.name} <span className="text-gray-500 text-xs">({sub.count})</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  )
}