import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {VendureCollection, MegaMenuData, MegaMenuColumn, MegaMenuLink, GridItemData} from '~/types';

// Placeholder cn function (commonly used with shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Transforms a collection and its children into GridItemData format for UahCollectionLine component.
 * @param allCollections - The flat array of all Vendure collections.
 * @param collectionName - The name of the collection to transform.
 * @param collectionBasePath - The base path for collection links (e.g., "/collections").
 * @returns An array of GridItemData objects for the collection's children, or undefined if collection not found.
 */
export function transformCollectionToGridItems(
  allCollections: VendureCollection[],
  collectionName: string,
  collectionBasePath: string = "/collections" // Default base path
): GridItemData[] | undefined {
  // Find the collection with the given name
  const targetCollection = allCollections.find(
    (collection) => collection.name === collectionName
  );

  if (!targetCollection) {
    // Collection not found
    return undefined;
  }

  // Find all direct children of the target collection
  const childCollections = allCollections.filter(
    (collection) =>
      collection.parent &&
      collection.parent.name === collectionName
  );

  if (childCollections.length === 0) {
    // No children found
    return undefined;
  }

  // Create a function to transform a collection into GridItemData
  const transformToGridItem = (collection: VendureCollection): GridItemData => {
    const imgSrc = collection.featuredAsset?.preview || "";
    
    // Create srcSet with different widths if image exists
    let imgSrcSet = "";
    if (imgSrc) {
      const widths = [180, 360, 540, 720, 900];
      imgSrcSet = widths
        .map((width) => {
          // Add width parameter to the URL if it doesn't already have one
          const url = imgSrc.includes("width=")
            ? imgSrc
            : `${imgSrc}${imgSrc.includes("?") ? "&" : "?"}width=${width}`;
          return `${url} ${width}w`;
        })
        .join(", ");
    }

    return {
      id: collection.id,
      href: `${collectionBasePath}/${collection.slug}`,
      ariaLabel: collection.name,
      imgSrc: imgSrc,
      imgSrcSet: imgSrcSet,
      imgWidth: "800", // Default width
      imgHeight: "600", // Default height
      imgAlt: collection.name,
      title: collection.name,
    };
  };

  // Start with the parent collection as the first item
  const gridItems: GridItemData[] = [transformToGridItem(targetCollection)];
  
  // Add all child collections
  childCollections.forEach(child => {
    gridItems.push(transformToGridItem(child));
  });

  return gridItems;
}

/**
 * Transforms a flat list of Vendure collections into a MegaMenuData structure.
 * @param allCollections - The flat array of all Vendure collections.
 * @param rootParentName - The name of the parent collection that triggers this mega menu (e.g., "Marketplace").
 * @param collectionBasePath - The base path for collection links (e.g., "/collections").
 * @returns MegaMenuData object or undefined if no data for the given root.
 */
export function transformVendureCollectionsToMegaMenu(
  allCollections: VendureCollection[],
  rootParentName: string,
  collectionBasePath: string = "/collections" // Default base path
): MegaMenuData | undefined {
  const megaMenuColumns: MegaMenuColumn[] = [];

  // 1. Find collections that are direct children of the rootParentName.
  // These will become the columns in the mega menu.
  const columnLevelCollections = allCollections.filter(
    (collection) => collection.parent && collection.parent.name === rootParentName
  );

  if (columnLevelCollections.length === 0) {
    // No direct children for this root, so no mega menu.
    return undefined;
  }

  // 2. For each column-level collection, find its children.
  // These will become the links within that column.
  for (const columnCollection of columnLevelCollections) {
    const currentColumnLinks: MegaMenuLink[] = [];
    const linkLevelCollections = allCollections.filter(
      (collection) =>
        collection.parent && collection.parent.name === columnCollection.name
    );

    for (const linkCollection of linkLevelCollections) {
      currentColumnLinks.push({
        text: linkCollection.name,
        href: `${collectionBasePath}/${linkCollection.slug}`,
      });
    }

    // Only add the column if it has links.
    // You might also want to add columns even if they have no sub-links,
    // if the column itself is meant to be a link.
    // For this example, we assume columns are headers for lists of links.
    if (currentColumnLinks.length > 0) {
      megaMenuColumns.push({
        title: columnCollection.name,
        links: currentColumnLinks,
      });
    }
  }

  if (megaMenuColumns.length === 0) {
    // No columns with links were formed.
    return undefined;
  }

  // 3. Construct the MegaMenuData object.
  // Add specific footer links if needed based on rootParentName.
  let footer;
  if (rootParentName === "Marketplace") {
    footer = {
      text: "UAH Marketplace", // As per your image
      href: `${collectionBasePath}/all`, // Example link, adjust as needed
    };
  } else if (rootParentName === "Connect") {
    footer = {
      text: "UAH Connect", // As per your image
      href: `${collectionBasePath}/all`, // Example link, adjust as needed
    };
  }
  // Add other footerLink conditions for other root parents if necessary

  return {
    triggerText: rootParentName,
    columns: megaMenuColumns,
    footerLink: footer,
  };
}
export function formatCurrency(
  amount: number,
  currencyCode: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}