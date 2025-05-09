"use client"

import { Link } from "@remix-run/react";
import { Card, CardContent } from "~/components/ui/card" // Ensure Card component exists
import { Badge } from "~/components/ui/badge" // Ensure Badge component exists

// Sample product data - in a real app, this would come from your database
const products = [
  {
    id: 1,
    name: "Industrial Robot Arm XR-5",
    category: "Robots",
    subcategory: "Industrial",
    price: "€12,500",
    image: "/placeholder.svg?key=2cq66",
  },
  {
    id: 2,
    name: "Collaborative Robot Assistant CR-2",
    category: "Robots",
    subcategory: "Collaborative",
    price: "€8,750",
    image: "/collaborative-robot.png",
  },
  {
    id: 3,
    name: "Advanced Sensor Array S-100",
    category: "Sensors & Controls",
    price: "€2,300",
    image: "/placeholder.svg?height=300&width=300&query=industrial sensor array",
  },
  {
    id: 4,
    name: "Automation Control System ACS-X",
    category: "Automation Systems",
    price: "€15,800",
    image: "/placeholder.svg?height=300&width=300&query=factory automation system",
  },
  {
    id: 5,
    name: "Humanoid Robot Model H-1",
    category: "Robots",
    subcategory: "Humanoid",
    price: "€35,000",
    image: "/placeholder.svg?height=300&width=300&query=humanoid robot",
  },
  {
    id: 6,
    name: "Process Optimization Software",
    category: "Software Solutions",
    price: "€4,200/year",
    image: "/placeholder.svg?height=300&width=300&query=industrial software dashboard",
  },
]

export default function ProductGrid() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Showing {products.length} products</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select className="text-sm border rounded-md px-2 py-1">
            <option>Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id} className="group">
            <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex flex-col h-full">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs font-normal">
                      {product.category}
                    </Badge>
                    {product.subcategory && (
                      <Badge variant="outline" className="ml-2 text-xs font-normal">
                        {product.subcategory}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-base mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-auto pt-2 font-semibold">{product.price}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}