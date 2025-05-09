import { Link } from '@remix-run/react';
import { ArrowRight } from 'lucide-react';
import { CollectionsQuery } from '~/generated/graphql';

export function CollectionCard({
  collection,
}: {
  collection: CollectionsQuery['collections']['items'][number];
}) {
  return (
    <Link
      to={`/collections/${collection.slug}`}
      prefetch="intent"
      key={collection.id}
      className="group relative overflow-hidden rounded-lg bg-gray-300 hover:opacity-90 transition-opacity"
    >
      <div className="aspect-square w-full">
        <img src={`${collection.featuredAsset?.preview ?? '/images/placeholder.jpg'}?w=300&h=300`} alt={collection.name} className="object-cover w-full h-full" />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end">
        <div className="w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium text-white">{collection.name}</h3>
            <ArrowRight className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}
