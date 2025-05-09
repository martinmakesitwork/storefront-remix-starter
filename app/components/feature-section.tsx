import { HeadphonesIcon, PackageIcon, UsersIcon, ShieldCheckIcon } from "lucide-react";
import * as React from "react"; // Added React import

interface FeatureProps {
  feature: {
    title: string;
    description: string;
    icon: string; // This will be the string name of the icon
  };
}

// Define a mapping from icon string names to actual icon components
const iconMap: { [key: string]: React.ComponentType<any> } = {
  HeadphonesIcon,
  PackageIcon,
  UsersIcon,
  ShieldCheckIcon,
};

export function FeatureSection({ feature }: FeatureProps) {
  const IconComponent = iconMap[feature.icon];

  return (
    <div className="flex items-start">
      {IconComponent && (
        <div className="flex-shrink-0 mr-3">
          <IconComponent className="h-6 w-6" />
        </div>
      )}
      <div>
        <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
      </div>
    </div>
  );
}