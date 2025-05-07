import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import React from "react";
import stylesUrl from "./UahCollectionLine.css"; // Assuming this file exists
import { GridItemData } from '~/types'; // Assuming this path is correct

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

interface FeaturedGridSectionProps {
    title: string; // The main title for the whole section (e.g., "Collections")
    items: GridItemData[];
}

export function UahCollectionLine({ title, items }: FeaturedGridSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const mainItem = items[0];
  const childItems = items.slice(1);

  // Reusable card rendering function
  // isMain prop allows for different styling/sizing for the main "collection" item
  const renderCard = (item: GridItemData, isMain: boolean) => (
    <div key={item.id} className="group relative flex flex-col h-full"> {/* h-full for equal height in grids */}
      <div
        className={`relative w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75 ${
          isMain ? 'aspect-[3/2] sm:aspect-[4/3]' : 'aspect-[4/3]' // Main item can have a slightly different aspect ratio
        }`}
      >
        <img
          src={item.imgSrc}
          alt={item.imgAlt}
          srcSet={item.imgSrcSet}
          width={item.imgWidth || (isMain ? 1000 : 600)} // Larger default for main item
          height={item.imgHeight || (isMain ? (1000 * 2 / 3) : (600 * 3 / 4))} // Adjust height based on aspect ratio
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="mt-4 flex flex-col flex-grow"> {/* flex-grow allows text block to expand, helping with h-full */}
        {/* For child items, show both subcategory and title */}
        {!isMain ? (
          <>
            <h3 className="text-sm text-gray-500 leading-snug">
              <Link to={item.href} aria-label={item.ariaLabel || item.title}>
                <span className="absolute inset-0" />
                {/* Display parent collection name for child items */}
                {title}
              </Link>
            </h3>
            <p className="mt-1 font-semibold text-gray-900 text-base md:text-lg leading-tight">
              {/* Display item title */}
              {item.title}
            </p>
          </>
        ) : (
          // For main item, don't show any text - just the image is clickable
          <Link to={item.href} aria-label={item.ariaLabel || item.title} className="absolute inset-0" />
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <div className="flex flex-col pointer-events-auto py-8 px-20 md:py-10 md:px-26 lg:py-12 lg:px-36" style={{maxWidth: "1900px", marginLeft: "auto", marginRight: "auto"}}>
        {title && (
          <div className="mb-10 lg:mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl leading-tight">
              {title}
            </h2>
            {/* You could add a "View all" link here if this section links to a broader collection page */}
          </div>
        )}

        {/* Layout container for main item and children items */}
        {/* Using a 12-column grid for flexibility in allocating space */}
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
          
          {/* Main Item (Collection/Parent) */}
          {/* Takes more columns on larger screens */}
          <div className="lg:col-span-4 xl:col-span-3 mb-12 lg:mb-0"> {/* Reduced width to give more space to child items */}
            {renderCard(mainItem, true)}
          </div>

          {/* Child Items */}
          {/* Take the remaining columns and display as their own grid */}
          {childItems.length > 0 && (
            <div className="lg:col-span-8 xl:col-span-9"> {/* Increased width to accommodate more child items */}
              {/* Responsive grid that adjusts columns based on screen size and number of items */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {childItems.map((item) => renderCard(item, false))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}