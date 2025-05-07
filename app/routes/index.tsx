import { useLoaderData } from '@remix-run/react';
import { getCollections } from '~/providers/collections/collections';
import { CollectionCard } from '~/components/collections/CollectionCard';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { FeatureSlider } from '~/components/home/Slider';
import { UahConnectSection } from '~/components/home/UahConnectSection/UahConnectSection';
import { UahCollectionLine } from '~/components/home/UahCollectionLine/UahCollectionLine';
import { localSlides } from '~/data/local-slides'; // Import local slide data that will work reliably
import { useTranslation } from 'react-i18next';
import { GridItemData } from '~/types';
import { transformCollectionToGridItems } from '~/lib/utils';

interface GridIconProps extends React.SVGProps<SVGSVGElement> {}

// Placeholder slide data - updated for simplified Slider
const sampleSlides = [
  {
    id: 'slide-1',
    type: 'image' as const,
    imageUrl: '/placeholder-image-1.jpg', // Use imageUrl
    altText: 'Placeholder 1',
    heading: 'Welcome to UAH Connect',
    buttonLabel: 'Shop Now',
    buttonLink: '/collections',
  },
  {
    id: 'slide-2',
    type: 'image' as const,
    imageUrl: '/placeholder-image-2.jpg', // Use imageUrl
    altText: 'Placeholder 2',
    heading: 'Discover Amazing Products',
    buttonLabel: 'View Collections',
    buttonLink: '/collections',
  },
  {
    id: 'slide-3',
    type: 'video' as const,
    videoUrl: '/videos/vid1.mp4',
    coverImageUrl: '/videos/placeholder-vid1.webp', // Use coverImageUrl
    heading: 'Check Out Our Video!',
    // No button for this slide example
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const collections = await getCollections(request, { take: 100 }); // Increased limit to ensure we get all collections
  return {
    collections,
  };
}

export default function Index() {
  const { collections } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const headerImage = collections[0]?.featuredAsset?.preview;

  const GridItemIcon: React.FC<GridIconProps> = (props) => ( <svg className="icon icon-arrow-right icon-xs transform shrink-0" viewBox="0 0 21 20" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 10H18M18 10L12.1667 4.16675M18 10L12.1667 15.8334"></path>
  </svg> );

  const itemsForGrid: GridItemData[] = [
    {
      id: "antriebstechnik",
      href: "/collections/antriebstechnik",
      ariaLabel: "Antriebstechnik",
      imgSrc: "//he9uk1-eq.myshopify.com/cdn/shop/files/60853_1056x1024-j.jpg?v=1741236632&width=1056",
      imgSrcSet: "//he9uk1-eq.myshopify.com/cdn/shop/files/60853_1056x1024-j.jpg?v=1741236632&width=180 180w, //he9uk1-eq.myshopify.com/cdn/shop/files/60853_1056x1024-j.jpg?v=1741236632&width=360 360w, //he9uk1-eq.myshopify.com/cdn/shop/files/60853_1056x1024-j.jpg?v=1741236632&width=540 540w, //he9uk1-eq.myshopify.com/cdn/shop/files/60853_1056x1024-j.jpg?v=1741236632&width=720 720w, //he9uk1-eq.myshopify.com/cdn/shop/files/60853_1056x1024-j.jpg?v=1741236632&width=900 900w",
      imgWidth: "1056",
      imgHeight: "684",
      imgAlt: "Antriebstechnik",
      title: "Antriebstechnik",
    },
    {
      id: "montage-fugetechnik",
      href: "/collections/montage-fugetechnik",
      ariaLabel: "Montage- & Fügetechnik",
      imgSrc: "//he9uk1-eq.myshopify.com/cdn/shop/files/jonasRedmann.jpg?v=1741244224&width=850",
      imgSrcSet: "//he9uk1-eq.myshopify.com/cdn/shop/files/jonasRedmann.jpg?v=1741244224&width=180 180w, //he9uk1-eq.myshopify.com/cdn/shop/files/jonasRedmann.jpg?v=1741244224&width=360 360w, //he9uk1-eq.myshopify.com/cdn/shop/files/jonasRedmann.jpg?v=1741244224&width=540 540w, //he9uk1-eq.myshopify.com/cdn/shop/files/jonasRedmann.jpg?v=1741244224&width=720 720w",
      imgWidth: "850",
      imgHeight: "600",
      imgAlt: "Montage- & Fügetechnik",
      title: "Montage- & Fügetechnik",
    },
    // ... Add other items
  ];

  // Transform collections for the UahCollectionLine components
  const softwareItems = transformCollectionToGridItems(collections, "Software");
  const systemTechItems = transformCollectionToGridItems(collections, "System and Process Technology");
  const componentsItems = transformCollectionToGridItems(collections, "Components");

  return (
    <>
      <div className="mx-auto overflow-hidden">
         <FeatureSlider slides={localSlides} pageWidth="1900px" />
      </div>

      <div className="mx-auto mt-8 overflow-hidden">
         <UahConnectSection />
      </div>

      {softwareItems && softwareItems.length > 0 && (
        <div className="mx-auto mt-8 overflow-hidden">
          <UahCollectionLine title="Software" items={softwareItems} />
        </div>
      )}

      {systemTechItems && systemTechItems.length > 0 && (
        <div className="mx-auto mt-8 overflow-hidden">
          <UahCollectionLine title="System and Process Technology" items={systemTechItems} />
        </div>
      )}

      {componentsItems && componentsItems.length > 0 && (
        <div className="mx-auto mt-8 overflow-hidden">
          <UahCollectionLine title="Components" items={componentsItems} />
        </div>
      )}

      {/* Keep the original grid as a fallback */}
      {(!softwareItems || !systemTechItems || !componentsItems) && (
        <div className="mx-auto mt-8 overflow-hidden">
          <UahCollectionLine title="Featured Collections" items={itemsForGrid} />
        </div>
      )}
    </>
  );
}
