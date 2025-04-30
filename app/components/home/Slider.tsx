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
import { SlideData } from '~/data/slides'; // Import the data structure and data // Removed TextReveal import

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
  const [previousSlide, setPreviousSlide] = React.useState<number | null>(null);
  const [animatingIn, setAnimatingIn] = React.useState<number | null>(null);
  const [isPlaying, setIsPlaying] = React.useState<Record<number, boolean>>({}); // Track video play state per slide

  const plugin = React.useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }
setCurrent(api.selectedScrollSnap());

// Set initial slide as animating in
const initialIndex = api.selectedScrollSnap();
setTimeout(() => {
  setAnimatingIn(initialIndex);
}, 50);


    const handleSelect = () => {
      const newIndex = api.selectedScrollSnap();
      
      // If the current slide is changing, mark it as exiting
      if (current !== newIndex) {
        setPreviousSlide(current);
        
        // Clear the previous slide state after animation completes
        // Use a timeout slightly longer than the animation duration
        setTimeout(() => {
          setPreviousSlide(null);
        }, 600); // Animation is ~400ms + delays, so 600ms should be enough
      }
      
      setCurrent(newIndex);

      // Set new slide as animating in
      setAnimatingIn(null);
      setTimeout(() => {
        setAnimatingIn(newIndex);
      }, 50);
      

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

   // Function to split text into lines and words with staggered animation
   const renderStaggeredText = (text: string, isAnimating: boolean) => {
     // Split text by spaces to identify potential line breaks
     const words = text.split(' ');
     
     // Estimate where line breaks might occur (this is an approximation)
     // For a more accurate approach, we'd need to measure actual text width
     const wordsPerLine = 4; // Approximate number of words per line
     const lines: string[] = [];
     
     for (let i = 0; i < words.length; i += wordsPerLine) {
       lines.push(words.slice(i, i + wordsPerLine).join(' '));
     }
     
     return lines.map((line, lineIndex) => {
       // Add delay for each subsequent line
       const lineDelay = lineIndex * 80; // Reduced from 200ms to 80ms
       
       return (
         <div key={lineIndex} className="block">
           {/* Split line into words and animate each word */}
           {line.split(' ').map((word, wordIndex) => {
             // Very small delay between words (15ms)
             const wordDelay = lineDelay + (wordIndex * 15);
             
             return (
               <React.Fragment key={wordIndex}>
                 <span
                   className="inline-block"
                   style={{
                     opacity: isAnimating ? 1 : 0,
                     transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
                     transition: `opacity 0.5s ease, transform 0.5s ease`,
                     transitionDelay: `${wordDelay}ms`
                   }}
                 >
                   {word}
                 </span>
                 {' '} {/* Add space between words */}
               </React.Fragment>
             );
           })}
         </div>
       );
     });
   };

   // Function to render text that's exiting (moving upward)
   const renderExitingText = (text: string, isExiting: boolean) => {
     // Split text by spaces to identify potential line breaks
     const words = text.split(' ');
     
     // Estimate where line breaks might occur
     const wordsPerLine = 4;
     const lines: string[] = [];
     
     for (let i = 0; i < words.length; i += wordsPerLine) {
       lines.push(words.slice(i, i + wordsPerLine).join(' '));
     }
     
     return lines.map((line, lineIndex) => {
       // Add delay for each subsequent line (reverse order for exit)
       const lineDelay = (lines.length - lineIndex - 1) * 40; // Shorter delay for exit
       
       return (
         <div key={lineIndex} className="block">
           {line.split(' ').map((word, wordIndex) => {
             // Reverse word order for exit animation
             const wordDelay = lineDelay + ((line.split(' ').length - wordIndex - 1) * 10);
             
             return (
               <React.Fragment key={wordIndex}>
                 <span
                   className="inline-block"
                   style={{
                     opacity: isExiting ? 0 : 1,
                     transform: isExiting ? 'translateY(-20px)' : 'translateY(0)', // Move upward when exiting
                     transition: `opacity 0.4s ease, transform 0.4s ease`,
                     transitionDelay: `${wordDelay}ms`
                   }}
                 >{word}</span>
                 {' '}
               </React.Fragment>
             );
           })}
         </div>
       );
     });
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
      <CarouselContent className="-ml-4"> {/* Remove padding, keep margin adjustment for spacing */}
        {slides.map((slide, index) => (
          <CarouselItem key={slide.id} className="pl-4 basis-full md:basis-11/12"> {/* Adjust basis for smaller peek */}
            <Card className="border-none rounded-2xl overflow-hidden shadow-none bg-transparent"> {/* Adjusted border-radius */}
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
                <div className="absolute inset-0 custom-gradient-overlay flex flex-col justify-end p-8 md:p-12 lg:p-16 z-10"> {/* Use custom gradient */}
                  {/* Conditionally render TextReveal and Button only for the active slide */}
                  <div className={`transition-all duration-500 ${current === index || previousSlide === index ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="overflow-hidden">
                      {previousSlide === index && current !== index ? (
                        <h2
                          aria-label={slide.title}
                          className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 shadow-text"
                        >{renderExitingText(slide.title, true)}</h2>
                      ) : current === index ? (
                        <h2
                          key={`slide-${index}-${current === index}`} // Force remount when slide becomes active
                          aria-label={slide.title}
                          className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 shadow-text"
                        >{renderStaggeredText(slide.title, animatingIn === index)}</h2>
                      ) : null}
                    </div>
                    
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
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation Arrows */}
      <button
        onClick={() => api?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-transparent transition-colors"
        aria-label="Previous slide"
      >
        <div className="w-6 h-6 text-white">
          <svg className="w-full h-full" viewBox="0 0 37 24" stroke="white" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 5L3 11.9999M3 11.9999L10 18.9999M3 11.9999H33.5"></path>
          </svg>
        </div>
      </button>
      
      <button
        onClick={() => api?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-transparent transition-colors"
        aria-label="Next slide"
      >
        <div className="w-6 h-6 text-white">
          <svg className="w-full h-full" viewBox="0 0 37 24" stroke="white" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M26.5 5L33.5 11.9999M33.5 11.9999L26.5 18.9999M33.5 11.9999H3"></path>
          </svg>
        </div>
      </button>


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

      {/* Add custom CSS */}
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
        .custom-gradient-overlay {
          background-image: linear-gradient(rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.8));
        }

        .transition-transform {
          transition: transform 0.7s ease-out, opacity 0.7s ease-out;
        }
        /* TextReveal Component Styles removed as react-awesome-reveal is used now */
      `}</style>
    </Carousel>
  );
}