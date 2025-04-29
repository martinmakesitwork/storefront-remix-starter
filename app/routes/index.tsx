import { useLoaderData } from '@remix-run/react';
import { getCollections } from '~/providers/collections/collections';
import { CollectionCard } from '~/components/collections/CollectionCard';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { FeatureSlider } from '~/components/home/Slider';
import { slides } from '~/data/slides'; // Import your slide data
import { useTranslation } from 'react-i18next';

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
  const collections = await getCollections(request, { take: 20 });
  return {
    collections,
  };
}

export default function Index() {
  const { collections } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const headerImage = collections[0]?.featuredAsset?.preview;

  return (
    <>
      <div className="max-w-6xl mx-auto mt-8 rounded-lg overflow-hidden">
         <FeatureSlider slides={slides} autoplayDelay={6000} />
      </div>

      <section
        aria-labelledby="category-heading"
        className="pt-24 sm:pt-32 xl:max-w-7xl xl:mx-auto xl:px-8"
      >
        <div className="px-4 sm:px-6 lg:px-8 xl:px-0">
          <h2
            id="category-heading"
            className="text-2xl font-light tracking-tight text-gray-900"
          >
            {t('common.shopByCategory')}
          </h2>
        </div>

        <div className="mt-4 flow-root">
          <div className="-my-2">
            <div className="box-content py-2 px-2 relative overflow-x-auto xl:overflow-visible">
              <div className="grid justify-items-center grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:gap-x-8">
                {collections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 px-4 sm:hidden">
          <a
            href="~/routes/__cart/index#"
            className="block text-sm font-semibold text-primary-600 hover:text-primary-500"
          >
            {t('common.browseCategories')}
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </section>
    </>
  );
}
