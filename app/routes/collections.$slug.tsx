import { Link, MetaFunction, useLoaderData } from '@remix-run/react';
import { DataFunctionArgs } from '@remix-run/server-runtime';
import { useRef, useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Home, SlidersHorizontal } from 'lucide-react';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { CollectionCard } from '~/components/collections/CollectionCard';
import { Button } from '~/components/ui/button';
import { CustomSelect } from '~/components/ui/select';
import { ProductCard, ProductCardProps } from '~/components/products/ProductCard';
import { FilterSidebar, FilterCategory } from '~/components/products/filter-sidebar';
import { FeatureSection } from '~/components/feature-section';
import { NewsletterSignup } from '~/components/newsletter-signup';
import { APP_META_TITLE } from '~/constants';
import { filteredSearchLoaderFromPagination } from '~/utils/filtered-search-loader';
import { sdk } from '../graphqlWrapper';
import type { SearchQuery, Collection, FacetValue, Product } from '~/generated/graphql'; // Added FacetValue, Product

export const meta: MetaFunction<typeof loader> = ({ data }: { data: any }) => { // Added type for data
  return [
    {
      title: data?.collection?.name
        ? `${data.collection.name} - ${APP_META_TITLE}`
        : APP_META_TITLE,
    },
  ];
};

const paginationLimitMinimumDefault = 25; // This might not be used with client-side rendering
const allowedPaginationLimits = new Set<number>([
  paginationLimitMinimumDefault,
  50,
  100,
]);
const { filteredSearchLoader } = filteredSearchLoaderFromPagination(
  allowedPaginationLimits,
  paginationLimitMinimumDefault,
);

export async function loader({ params, request, context }: DataFunctionArgs) {
  const { result, facetValueIds: serverSelectedFacetValueIds } = await filteredSearchLoader({
    params,
    request,
    context,
  });
  const collectionData = (await sdk.collection({ slug: params.slug })).collection;

  if (!collectionData?.id || !collectionData?.name) {
    throw new Response('Not Found', { status: 404 });
  }

  return {
    collection: collectionData as Collection, // Cast for type safety
    initialProducts: result.items as ProductCardProps[],
    initialFacets: result.facetValues,
    serverSelectedFacetValueIds, // Pass these to potentially pre-select filters
  };
}

export default function CollectionSlugPage() {
  const { collection, initialProducts, initialFacets, serverSelectedFacetValueIds } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    // Initialize selectedFilters based on serverSelectedFacetValueIds
    const initial: Record<string, string[]> = {};
    serverSelectedFacetValueIds.forEach((id: string) => {
      const facetValueResult = initialFacets.find((f: any) => f.facetValue?.id === id);
      if (facetValueResult && facetValueResult.facetValue) {
        const facetId = (facetValueResult.facetValue.facet as { id: string }).id;
        if (!initial[facetId]) {
          initial[facetId] = [];
        }
        initial[facetId].push(id);
      }
    });
    return initial;
  });

  const allProducts = useMemo(() => initialProducts as ProductCardProps[], [initialProducts]);

  // Helper function to get a single price value
  const getProductPrice = (product: ProductCardProps): number => {
    if (product.priceWithTax.__typename === 'SinglePrice') {
      return product.priceWithTax.value / 100; // Assuming cents
    } else if (product.priceWithTax.__typename === 'PriceRange') {
      return product.priceWithTax.min / 100; // Use min price for range
    }
    return 0; // Default case
  };

  const { minPrice, maxPrice } = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return { minPrice: 0, maxPrice: 100000 };
    const prices = allProducts.map(getProductPrice);
    return {
      minPrice: Math.floor(Math.min(...prices) || 0),
      maxPrice: Math.ceil(Math.max(...prices) || 100000),
    };
  }, [allProducts]);

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const [sortOption, setSortOption] = useState("meistverkauft");

  const filterCategories = useMemo((): FilterCategory[] => {
    const groupedFacets: Record<string, FilterCategory> = {};
    initialFacets.forEach(fvResult => {
      if (!fvResult.facetValue || !fvResult.facetValue.facet) return;

      const facetId = (fvResult.facetValue.facet as { id: string }).id;
      const facetName = (fvResult.facetValue.facet as { name: string }).name;
      if (!groupedFacets[facetId]) {
        groupedFacets[facetId] = {
          id: facetId,
          name: facetName,
          options: [],
        };
      }
      groupedFacets[facetId].options.push({
        id: fvResult.facetValue.id,
        label: fvResult.facetValue.name,
        count: fvResult.count ?? 0,
      });
    });
    return Object.values(groupedFacets);
  }, [initialFacets]);

  const filteredProducts = useMemo(() => {
    return (allProducts as ProductCardProps[]).filter((product: ProductCardProps) => {
      const price = getProductPrice(product);
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      // Client-side facet filtering removed as product.facetValueIds is not available on SearchResult.
      // Filtering by facets currently relies on the server/loader.
      // To implement client-side facet filtering, we'd need a way to link
      // products in `allProducts` back to the `initialFacets`.

      // for (const [categoryId, selectedOptions] of Object.entries(selectedFilters)) {
      //   if ((selectedOptions as string[]).length === 0) continue;
      //   // Logic to check if product belongs to selected facet values needs implementation
      //   // based on available data linking products to facets.
      //   // This part is removed due to missing product.facetValueIds
      // }

      return true;
    });
  }, [allProducts, selectedFilters, priceRange, initialFacets]); // Keep initialFacets dependency if needed for future filtering logic

  const sortedProducts = useMemo(() => {
    return [...(filteredProducts as ProductCardProps[])].sort((a: ProductCardProps, b: ProductCardProps) => {
      const aPrice = getProductPrice(a); // Use helper
      const bPrice = getProductPrice(b); // Use helper
      const aName = a.productName;
      const bName = b.productName;
      // Assuming 'createdAt' or similar for date sorting if available
      // const aDate = new Date(a.createdAt || 0).getTime();
      // const bDate = new Date(b.createdAt || 0).getTime();

      switch (sortOption) {
        case "preis-aufsteigend": return aPrice - bPrice;
        case "preis-absteigend": return bPrice - aPrice;
        case "name-a-z": return aName.localeCompare(bName);
        case "name-z-a": return bName.localeCompare(aName);
        // case "datum-alt-neu": return aDate - bDate;
        // case "datum-neu-alt": return bDate - aDate;
        default: return 0; // "meistverkauft" would need a popularity metric
      }
    });
  }, [filteredProducts, sortOption]);

  const handleFilterChange = (categoryId: string, optionId: string, isChecked: boolean) => {
    setSelectedFilters((prev: Record<string, string[]>) => { // Added type for prev
      const updatedCategoryFilters = prev[categoryId] ? [...prev[categoryId]] : [];
      if (isChecked) {
        if (!updatedCategoryFilters.includes(optionId)) {
          updatedCategoryFilters.push(optionId);
        }
      } else {
        const index = updatedCategoryFilters.indexOf(optionId);
        if (index > -1) {
          updatedCategoryFilters.splice(index, 1);
        }
      }
      const newFilters = { ...prev, [categoryId]: updatedCategoryFilters };
      if (updatedCategoryFilters.length === 0) {
        delete newFilters[categoryId];
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setPriceRange([minPrice, maxPrice]);
  };

  const applyFilters = () => setIsFilterOpen(false);

  const activeFilterCount = useMemo(() => {
    // Cast Object.values result and ensure count is treated as number
    const filterValues = Object.values(selectedFilters) as string[][];
    const selectedOptionCount = filterValues.reduce((count: number, options: string[]) => count + options.length, 0);
    const priceFilterActive = (priceRange[0] > minPrice || priceRange[1] < maxPrice) ? 1 : 0;
    return selectedOptionCount + priceFilterActive;
  }, [selectedFilters, priceRange, minPrice, maxPrice]);

  const sortOptions = [
    { value: "meistverkauft", label: t('sort.meistverkauft', "Meistverkauft") },
    { value: "name-a-z", label: t('sort.nameAZ', "Alphabetisch, A-Z") },
    { value: "name-z-a", label: t('sort.nameZA', "Alphabetisch, Z-A") },
    { value: "preis-aufsteigend", label: t('sort.priceAsc', "Preis, niedrig nach hoch") },
    { value: "preis-absteigend", label: t('sort.priceDesc', "Preis, hoch nach niedrig") },
    // { value: "datum-alt-neu", label: t('sort.dateOldNew', "Datum, alt zu neu") },
    // { value: "datum-neu-alt", label: t('sort.dateNewOld', "Datum, neu zu alt") },
  ];

  const features = [
    { title: t('features.service.title', "Customer service"), description: t('features.service.desc',"It's not actually free we just price it into the products."), icon: "HeadphonesIcon" },
    { title: t('features.shipping.title', "Fast Free Shipping"), description: t('features.shipping.desc',"Get free shipping on orders of $150 or more"), icon: "PackageIcon" },
    { title: t('features.refer.title', "Refer a friend"), description: t('features.refer.desc',"Refer a friend and get 15% off each other."), icon: "UsersIcon" },
    { title: t('features.payment.title', "Secure payment"), description: t('features.payment.desc',"Your payment information is processed securely"), icon: "ShieldCheckIcon" },
  ];

  // Use a slice of initialProducts for recently viewed, or implement actual tracking
  const recentlyViewed = useMemo(() => allProducts.slice(0, 4), [allProducts]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {collection.breadcrumbs && collection.breadcrumbs.length > 0 && (
            <div className="mb-6">
              <Breadcrumbs items={collection.breadcrumbs} />
            </div>
          )}

          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-8">{collection.name}</h1>
          {collection.description && <p className="mb-8 text-gray-600" dangerouslySetInnerHTML={{ __html: collection.description }} />}


          <div className="flex justify-between items-center mb-8">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 rounded-full px-4 py-2 border border-gray-300"
              onClick={() => setIsFilterOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t('filters.show', 'Filter anzeigen')}
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-gray-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{t('sort.sortBy', 'Sortieren nach:')}</span>
              <CustomSelect
                value={sortOption}
                onChange={setSortOption}
                options={sortOptions}
                className="w-[220px]"
              />
            </div>
          </div>

          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            categories={filterCategories}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            onApplyFilters={applyFilters}
            productCount={sortedProducts.length}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />

          {collection.children?.length ? (
            <div className="max-w-2xl mx-auto py-16 sm:py-16 lg:max-w-none border-b mb-16">
              <h2 className="text-2xl font-light text-gray-900">
                {t('product.subCollections', 'Unterkategorien')}
              </h2>
              <div className="mt-6 grid max-w-xs sm:max-w-none mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {collection.children?.map((child: any) => (
                  // Use div wrapper with key
                  <div key={child.id} className="collection-card-wrapper">
                    <CollectionCard collection={child} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {sortedProducts.length > 0 ? (
              (sortedProducts as ProductCardProps[]).map((product: ProductCardProps) => ( // Added types
                <div key={product.productId} className="bg-gray-50 p-4 rounded-lg"> {/* Added rounded-lg */}
                  <ProductCard {...product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">{t('products.noResults', 'Keine Produkte gefunden. Bitte passen Sie Ihre Filter an.')}</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  {t('filters.reset', 'Filter zurücksetzen')}
                </Button>
              </div>
            )}
          </div>

          <div className="relative w-full h-[300px] bg-gray-900 text-white mb-16 overflow-hidden rounded-lg"> {/* Added rounded-lg */}
            <div className="absolute inset-0 bg-[url('https://placehold.co/1920x300/E2E8F0/E2E8F0')] opacity-20"></div> {/* Consider making pattern-bg.png available or remove */}
            <div className="relative z-10 flex flex-col justify-center h-full p-8">
              <span className="text-sm uppercase tracking-wider mb-2">{t('banner.tagline', 'TAGLINE')}</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('banner.heading', 'Example heading')}</h2>
              <p className="text-gray-300 max-w-lg">
                {t('banner.description', 'Give customers details about the banner image(s) or content on the template.')}
              </p>
            </div>
          </div>

          {recentlyViewed.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">{t('products.recentlyViewed', 'Recently Viewed')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(recentlyViewed as ProductCardProps[]).map((product: ProductCardProps) => ( // Added types
                  <div key={product.productId + "-recent"} className="bg-white rounded-lg shadow"> {/* Added shadow and rounded-lg */}
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              // Add key prop to fix the React warning
              <div key={feature.title || index} className="feature-section-wrapper">
                <FeatureSection feature={feature} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export function CatchBoundary() {
  const { t } = useTranslation();
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
        {t('product.collectionNotFound', 'Collection Not Found')}
      </h1>
      <p>{t('errors.collectionNotFoundDetails', 'The collection you are looking for does not exist or may have been moved.')}</p>
      <Link to="/collections" className="text-blue-600 hover:underline mt-4 inline-block">
        {t('common.backToCollections', 'Back to all collections')}
      </Link>
    </div>
  );
}
