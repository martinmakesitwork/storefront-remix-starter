// Local slides data with reliable image paths
export interface SlideData {
  id: number;
  type: 'image' | 'video';
  src: string;
  title: string;
  alt?: string;
  buttonText?: string;
  buttonLink?: string;
}

// Using local images from the public directory
export const localSlides: SlideData[] = [
  {
    id: 1,
    type: 'image',
    src: '/uah_connect.svg', // Using the existing SVG in public directory
    alt: 'UAH Connect Logo',
    title: 'Welcome to UAH Connect',
    buttonText: 'Shop Now',
    buttonLink: '/collections/connect'
  },
  {
    id: 2,
    type: 'image',
    // Using a solid color as fallback with data URI
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%234a90e2"/></svg>',
    alt: 'Blue Background',
    title: 'Discover Amazing Products',
    buttonText: 'View Collections',
    buttonLink: '/collections/marketplace'
  },
  {
    id: 3,
    type: 'video',
    src: '/videos/vid1.mp4', // Using the existing video in public directory
    title: 'Check Out Our Video',
    buttonText: 'Learn More',
    buttonLink: '/about'
  }
];