import { Link } from "@remix-run/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"; // Ensure Tabs component exists
import { Button } from "~/components/ui/button"; // Ensure Button component exists
import { Badge } from "~/components/ui/badge"; // Ensure Badge component exists
import { Check, ExternalLink, MessageSquare, Phone } from "lucide-react";
import SupplierMap from "./supplier-map";
import ProductFilters from "./product-filters";
import ProductGrid from "./product-grid";

// This would typically come from your database / loader in Remix
const supplierData = {
  id: "acme-corp",
  name: "Acme Corporation",
  slaLevel: "GOLD",
  tagline: "Leading provider of industrial automation solutions and robotics systems.",
  industry: "Manufacturing",
  location: "Munich",
  productCount: "328",
  employees: "5K+",
  phone: "+49 123 456 7890",
  contacts: [
    { name: "Sarah Johnson", title: "Sales Director" },
    { name: "Michael Chen", title: "Technical Support" },
    { name: "Anna Schmidt", title: "Account Manager" },
  ],
  about:
    "Acme Corporation is a global leader in industrial automation, robotics, and manufacturing solutions. With over 30 years of experience, we provide cutting-edge technology to optimize production processes and increase efficiency across various industries.",
  videoUrl: "https://www.example.com/company-video.mp4", // Consider using a public placeholder video
  returnPolicy:
    "Our standard return policy allows for returns within 30 days of purchase. All items must be in original packaging and undamaged. Custom orders are non-returnable. Contact customer service to initiate a return.",
  certifications: [
    { name: "ISO 9001:2015", description: "Quality Management Systems" },
    { name: "ISO 14001:2015", description: "Environmental Management Systems" },
    { name: "ISO 45001:2018", description: "Occupational Health and Safety" },
    { name: "CE Marking", description: "European Conformity" },
  ],
  locations: [
    { id: 1, name: "Headquarters", city: "Munich, Germany", type: "headquarters", lat: 48.1351, lng: 11.5820 },
    { id: 2, name: "Manufacturing Plant", city: "Stuttgart, Germany", type: "factory", lat: 48.7758, lng: 9.1829 },
    { id: 3, name: "R&D Center", city: "Berlin, Germany", type: "office", lat: 52.5200, lng: 13.4050 },
    { id: 4, name: "Distribution Center", city: "Hamburg, Germany", type: "warehouse", lat: 53.5511, lng: 9.9937 },
  ],
  // Placeholder images - replace with actual image paths or a service like Unsplash/Pexels
  coverImage: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27100%27%20height%3D%27100%27%20viewBox%3D%270%200%20100%20100%27%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23f0f0f0%27%2F%3E%3Cpattern%20id%3D%27p%27%20width%3D%2710%27%20height%3D%2710%27%20patternUnits%3D%27userSpaceOnUse%27%3E%3Cpath%20d%3D%27M0%200L10%2010M10%200L0%2010%27%20stroke%3D%27%23e0e0e0%27%20stroke-width%3D%271%27%2F%3E%3C%2Fpattern%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27url(%23p)%27%2F%3E%3C%2Fsvg%3E", // Default SVG pattern
  logoImage: "/images/example-company-logo.png", // Default if no specific logo
  contactImage: "/images/placeholder-profile.png", // Default for contact images
  videoThumbnail: "/industrial-robots-thumbnail.png", // e.g., https://via.placeholder.com/640x360.png?text=Video+Thumbnail
};

export default function SupplierProfile() {
  // In Remix, you would get supplierData from a loader function based on the $slug param
  // For example: const { supplierData } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cover Image Section */}
      <div className="relative">
        <div className="h-48 md:h-64 lg:h-80 w-full overflow-hidden">
          <img
            src={supplierData.coverImage}
            alt="Cover image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Container for both Logo and Content - ensures consistent width */}
      <div className="container mx-auto px-4 relative">
        {/* Logo - positioned relative to this container */}
        <div className="absolute left-4 -top-24 border-4 border-white bg-white rounded-md overflow-hidden shadow-lg">
          <img
            src={supplierData.logoImage}
            alt={`${supplierData.name} logo`}
            className="w-32 h-32"
          />
        </div>
        
        {/* Main Content - in same container as logo */}
        <div className="pt-20 pb-10">
        {/* Company Info */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2"> {/* Reverted to gap-2 */}
                <h1 className="text-3xl font-bold">{supplierData.name}</h1>
                {supplierData.slaLevel && (
                  <Badge
                    variant="outline"
                    className={`
                      px-3 py-2 font-medium text-xs shadow-sm flex items-center gap-1
                      ${supplierData.slaLevel === "BASIC" ? "bg-gray-100 text-gray-800 border-gray-300" : ""}
                      ${supplierData.slaLevel === "SILVER" ? "bg-gray-200 text-gray-800 border-gray-400 shadow-inner" : ""}
                      ${supplierData.slaLevel === "GOLD" ? "bg-green-100 text-green-800 border-green-300" : ""}
                      ${supplierData.slaLevel === "PLATIN" ? "bg-green-100 text-green-800 border-green-300" : ""}
                      ${supplierData.slaLevel === "Exclusive" ? "bg-green-100 text-green-800 border-green-300" : ""}
                    `}
                  >
                    <span className="font-bold">SLA-Level</span> {supplierData.slaLevel}
                  </Badge>
                )}
              </div>
              <p className="text-lg text-gray-700 mt-1">{supplierData.tagline}</p>
              <div className="text-sm text-gray-500 mt-2">
                <span>{supplierData.industry}</span> · <span>{supplierData.location}</span> ·
                <span>{supplierData.productCount} Products</span> · <span>{supplierData.employees} Employees</span>
              </div>

              {/* Contacts */}
              <div className="flex items-center mt-3 text-sm text-gray-600">
                <span className="flex items-center">
                  <img
                    src={supplierData.contactImage}
                    alt="Contact"
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  {supplierData.contacts[0].name} &amp; {supplierData.contacts.length - 1} more contacts work here
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Button variant="default" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Send message
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                Quote request
              </Button>
              {supplierData.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{supplierData.phone}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" asChild aria-label="Call">
                    <Link to={`tel:${supplierData.phone.replace(/\s+/g, "")}`}>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Using simple Links for now, can be enhanced with active states */}
        <div className="border-b mb-8">
          <nav className="flex space-x-8">
            <Link to="#" className="border-b-2 border-primary px-1 py-4 text-sm font-medium text-primary">
              Overview
            </Link>
            <Link
              to="#products" // Example: link to a section ID or a sub-route
              className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Products
            </Link>
            <Link
              to="#services"
              className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Services
            </Link>
            <Link
              to="#locations"
              className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Locations
            </Link>
            <Link
              to="#about"
              className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              About
            </Link>
          </nav>
        </div>

        {/* About Section */}
        <div id="about" className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-700">{supplierData.about}</p>
          <Button variant="link" className="mt-2 p-0">
            See more
          </Button>
        </div>

        {/* Company Video */}
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8">
          <video className="w-full h-full object-cover" controls poster={supplierData.videoThumbnail}>
            <source src={supplierData.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Return Handling and Certifications Tabs */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <Tabs defaultValue="return-handling">
            <TabsList className="mb-4">
              <TabsTrigger value="return-handling">Return Handling Info</TabsTrigger>
              <TabsTrigger value="certifications">Certifications &amp; Compliance</TabsTrigger>
            </TabsList>
            <TabsContent value="return-handling" className="text-gray-700">
              <h3 className="text-lg font-medium mb-2">Return Policy</h3>
              <p>{supplierData.returnPolicy}</p>
            </TabsContent>
            <TabsContent value="certifications">
              <h3 className="text-lg font-medium mb-2">Certifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supplierData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-md">
                    <div className="bg-green-50 p-2 rounded-full">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Products Section */}
        <div id="products" className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">All Products</h2>
          </div>
          <div className="flex flex-col md:flex-row">
            {/* Side Filters */}
            <div className="w-full md:w-64 border-r p-4">
              <ProductFilters />
            </div>

            {/* Product Grid */}
            <div className="flex-1 p-6">
              <ProductGrid />
            </div>
          </div>
        </div>

        {/* Locations Map */}
        <div id="locations" className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Locations</h2>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <SupplierMap locations={supplierData.locations} />
          </div>
        </div>
      </div> {/* Close the pt-20 pb-10 div */}
      </div> {/* Close the container mx-auto px-4 relative div */}
    </div>
  );
}