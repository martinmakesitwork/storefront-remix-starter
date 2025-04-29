// src/components/FeatureSlider.tsx
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import ReactPlayerImport from 'react-player/lazy/index.js'; // Lazy load for better performance
const ReactPlayer = (ReactPlayerImport as any).default || ReactPlayerImport;

import { Card, CardContent } from '~/components/ui/card'; // Using Card for structure
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils'; // Utility for conditional classes (from shadcn setup)
import { SlideData } from '~/data/slides'; // Import the data structure and data

interface FeatureSliderProps {
  slides: SlideData[];
  autoplayDelay?: number;
  showDots?: boolean;
  defaultButtonText?: string;
  defaultButtonLink?: string;
}

export function FeatureSlider({
  slides,
  autoplayDelay = 5000, // Default autoplay delay 5 seconds
  showDots = true,
  defaultButtonText = 'Shop Now',
  defaultButtonLink = '#',
}: FeatureSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState<Record<number, boolean>>({}); // Track video play state per slide

  const plugin = React.useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const handleSelect = () => {
      const newIndex = api.selectedScrollSnap();
      setCurrent(newIndex);

      // Pause all videos when slide changes
      setIsPlaying(prev => {
          const newState = { ...prev };
          Object.keys(newState).forEach(key => {
              newState[Number(key)] = false;
          });
          return newState;
      });

      // Optionally: auto-play video when its slide becomes active
      const currentSlide = slides[newIndex];
       if (currentSlide.type === 'video') {
           // Small delay to ensure transition is smooth before playing
           setTimeout(() => {
               setIsPlaying(prev => ({ ...prev, [currentSlide.id]: true }));
           }, 150); // Adjust delay as needed
       }
    };

    api.on('select', handleSelect);
     // Reset play state when autoplay resumes after hover/interaction
     api.on('settle', handleSelect); // Ensure state is correct after scroll settles
      api.on('pointerDown', () => plugin.current.stop()); // Stop autoplay on interaction

    return () => {
      api.off('select', handleSelect);
       api.off('settle', handleSelect);
    };
  }, [api, slides]);

  const handleDotClick = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

   const handlePlayPause = (slideId: number, play: boolean) => {
       setIsPlaying(prev => ({ ...prev, [slideId]: play }));
       // If user manually interacts, stop the carousel autoplay
       if (!play) { // If pausing
           plugin.current.stop();
       }
   };

   const handleVideoEnded = (slideId: number) => {
       setIsPlaying(prev => ({ ...prev, [slideId]: false }));
       // Optionally move to the next slide when video ends
       // api?.scrollNext();
   };


  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      opts={{
        loop: true,
      }}
      // Pause autoplay when mouse enters the carousel container
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      className="w-full relative" // Ensure carousel takes width and allows absolute positioning
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={slide.id}>
            <Card className="border-none rounded-lg overflow-hidden shadow-none bg-transparent"> {/* Remove card styling */}
              <CardContent className="flex aspect-video items-center justify-center p-0 relative"> {/* Use aspect-video, remove padding */}
                {/* Background Media (Image or Video) */}
                <div className="absolute inset-0 bg-gray-200"> {/* Fallback bg */}
                  {slide.type === 'image' ? (
                    <img
                      src={slide.src}
                      alt={slide.alt || slide.title}
                      className="w-full h-full object-cover" // Make image cover the area
                    />
                  ) : (
                    <div className="w-full h-full player-wrapper">
                     <ReactPlayer
                        url={slide.src}
                        playing={isPlaying[slide.id] || false}
                        controls={true} // Show native controls (like YouTube)
                        width="100%"
                        height="100%"
                        className="react-player"
                        onPlay={() => handlePlayPause(slide.id, true)}
                        onPause={() => handlePlayPause(slide.id, false)}
                        onEnded={() => handleVideoEnded(slide.id)}
                        // Muted might be required for autoplay in some browsers
                        // muted={true}
                        config={{
                           youtube: {
                             playerVars: {
                               showinfo: 0, // Hide title bar
                                modestbranding: 1, // Less prominent YouTube logo
                                controls: 1, // Show controls (can be 0 to hide)
                                // Disable related videos - might not work reliably
                                rel: 0,
                             }
                           },
                           file: {
                             attributes: {
                               controlsList: 'nodownload' // Example: disable download
                             }
                           }
                         }}
                      />
                    </div>
                  )}
                </div>

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12 lg:p-16 z-10">
                  <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 shadow-text">
                    {slide.title}
                  </h2>
                  <Button
                    asChild
                    size="lg"
                    className="mt-4 w-fit rounded-full px-8 py-3 text-lg" // Style like example
                    variant="secondary" // Use secondary (often white/light) or customize
                  >
                    <a href={slide.buttonLink || defaultButtonLink}>
                      {slide.buttonText || defaultButtonText}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation Arrows */}
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden sm:inline-flex" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden sm:inline-flex" />

      {/* Dot Navigation */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                'h-2 w-2 rounded-full transition-colors duration-200',
                current === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              )}
            />
          ))}
        </div>
      )}

      {/* Add custom CSS for text shadow if needed */}
      <style>{`
        .shadow-text {
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
        }
        .player-wrapper {
          position: relative;
          padding-top: 56.25% /* Player ratio: 16:9 */;
        }
        .react-player {
          position: absolute;
          top: 0;
          left: 0;
        }
      `}</style>
    </Carousel>
  );
}