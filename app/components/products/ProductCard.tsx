import { SearchQuery } from '~/generated/graphql';
import { Link } from '@remix-run/react';
import { Price } from './Price';

export type ProductCardProps = SearchQuery['search']['items'][number];
export function ProductCard({
  productAsset,
  productName,
  slug,
  priceWithTax,
  currencyCode,
}: ProductCardProps) {
  return (
    <div className="group relative">
      <Link prefetch="intent" to={`/products/${slug}`}>
        <img
          alt={productName}
          src={productAsset?.preview + '?w=300&h=400'} // Assuming ?w=300&h=400 is desired for sizing
          className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
        />
      </Link>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link prefetch="intent" to={`/products/${slug}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {productName}
            </Link>
          </h3>
          {/* Color paragraph omitted as 'color' is not in ProductCardProps */}
          {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
        </div>
        <p className="text-sm font-medium text-gray-900">
          <Price priceWithTax={priceWithTax} currencyCode={currencyCode} />
        </p>
      </div>
    </div>
  );
}
