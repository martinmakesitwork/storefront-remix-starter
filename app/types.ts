import { useActiveOrder } from '~/utils/use-active-order';
import { CreateAddressInput } from '~/generated/graphql';

export type OutletContext = ReturnType<typeof useActiveOrder>;

export type ShippingFormData = CreateAddressInput;

interface GridIconProps extends React.SVGProps<SVGSVGElement> {}

export interface GridItemData {
    id: string;
    href: string;
    ariaLabel: string;
    imgSrc: string;
    imgSrcSet?: string; // Make optional if not always used
    imgWidth?: string | number; // Make optional
    imgHeight?: string | number; // Make optional
    imgAlt: string;
    title: string; // This will be the vertical text
}

export interface MegaMenuLink {
    text: string;
    href: string;
  }
  
  export interface MegaMenuColumn {
    title: string;
    links: MegaMenuLink[];
  }
  
  export interface MegaMenuData {
    triggerText: string;
    columns: MegaMenuColumn[];
    footerLink?: {
      text: string;
      href: string;
    };
  }

  interface VendureCollectionAsset {
    __typename?: "Asset"; // Add __typename if it's present in the API response
    id: string;
    preview: string;
    // Add other asset properties if needed
  }
  
  // Updated VendureCollectionParent
  interface VendureCollectionParent {
    __typename?: "Collection"; // Add __typename
    name: string;
    // Add other parent properties if needed, e.g., id, slug
  }
  
  // Updated VendureCollection
  export interface VendureCollection {
    __typename?: "Collection"; // Add __typename
    id: string;
    name: string;
    slug: string;
    // Make parent potentially undefined AS WELL AS null, to match API
    parent?: VendureCollectionParent | null; // Changed from VendureCollectionParent | null
    featuredAsset?: VendureCollectionAsset | null; // Make this optional as well if API can omit it
    // Add other collection properties if needed
  }
  
