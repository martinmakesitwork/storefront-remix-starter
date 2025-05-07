// src/components/FeatureSlider.tsx
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import ReactPlayerImport from 'react-player/lazy/index.js';
const ReactPlayer = (ReactPlayerImport as any).default || ReactPlayerImport;

import { Card, CardContent } from '~/components/ui/card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { SlideData } from '~/data/local-slides'; // Ensure this path is correct

interface FeatureSliderProps {
  slides: SlideData[];
  autoplayDelay?: number;
  showDots?: boolean;
  defaultButtonText?: string;
  defaultButtonLink?: string;
  pageWidth?: string;
}

// Client-only wrapper component
export function FeatureSlider(props: FeatureSliderProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[60vh] bg-gray-100 flex items-center justify-center" aria-label="Loading slider...">
        <div className="text-gray-500">
          {/* Simple loading text or spinner */}
          Loading slider...
        </div>
      </div>
    );
  }

  return <ClientOnlyFeatureSlider {...props} />;
}

// The actual implementation, only rendered on the client

// The actual implementation, only rendered on the client
function ClientOnlyFeatureSlider({
  slides,
  autoplayDelay = 5000,
  showDots = true,
  defaultButtonText = 'Shop Now',
  defaultButtonLink = '#',
  pageWidth = '1900px',
}: FeatureSliderProps) {
  // ... (useState, useRef, useEffect hooks, helper functions - assume these are correct from previous version)
  // For brevity, I'm keeping the core logic from the last correct version.
  const [api, setApi] = React.useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [previousTextSlide, setPreviousTextSlide] = React.useState<SlideData | null>(null);
  const [isAnimatingIn, setIsAnimatingIn] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState<Record<number, boolean>>({});
  const [isMounted, setIsMounted] = React.useState(false);

  const plugin = React.useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const staticCss = `
    .feature-slider-container {
      --page-width-val-calc: ${pageWidth};
      --sp-12-calc: 3rem; /* Or your desired base padding */
      /* Assuming scrollbar width is negligible or handled by body overflow for full-width sliders */
      --scrollbar-width-calc: 0px;

      --calculated-page-padding: max(
        var(--sp-12-calc),
        calc(50vw - (var(--scrollbar-width-calc) / 2) - (var(--page-width-val-calc) / 2))
      );
      
      --calculated-page-container-width: min(
        var(--page-width-val-calc),
        calc(100vw - (var(--calculated-page-padding) * 2) - var(--scrollbar-width-calc))
      );
    }
    .shadow-text { text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.7); }
    .custom-gradient-overlay {
      background-image: linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.4) 50%, transparent 100%);
    }
    
    /* Custom button styles */
    .button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 1rem 1.5rem; /* Increased top/bottom padding */
      border-radius: 9999px;
      font-weight: 500;
      text-decoration: none;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #000;
      background-color: white;
    }
    
    .button--primary {
      background-color: white;
      color: #000;
    }
    
    .button--md {
      font-size: 0.875rem;
      padding: 0.875rem 1.5rem; /* Increased top/bottom padding */
    }
    
    .button--blur {
      backdrop-filter: blur(4px);
    }
    
    .button--fixed {
      min-width: 120px;
    }
    
    .btn-fill {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000; /* Dark fill color */
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .button:hover {
      color: white; /* Text turns white on hover */
    }
    
    .button:hover .btn-fill {
      transform: translateY(0);
    }
    
    .btn-text {
      position: relative;
      z-index: 1;
      transition: color 0.3s ease;
    }
  `;
  const dynamicCarouselStyles = {
    '--page-width-val': pageWidth,
    '--sp-12': '3rem',
    '--scrollbar-width': '0px', 
  } as React.CSSProperties;

  // Minimal useEffects for brevity
  // Handle client-side mounting and debug slides data
  React.useEffect(() => {
    setIsMounted(true);
    
    // Debug slides data
    console.log('Slides data in ClientOnlyFeatureSlider:', slides);
    if (!slides || slides.length === 0) {
      console.error('No slides data available!');
    } else {
      slides.forEach((slide, index) => {
        console.log(`Slide ${index}:`, slide);
      });
    }
  }, [slides]);

  // Initialize slider and start animations after mounting
  React.useEffect(() => {
    if (!api || !isMounted) return;
    
    const initialIndex = api.selectedScrollSnap();
    setActiveIndex(initialIndex);
    
    // Only animate after hydration is complete
    const timer = setTimeout(() => {
      setIsAnimatingIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [api, isMounted]);
  React.useEffect(() => {
    if (!api || !isMounted || !slides || slides.length === 0) return;
    const handleSelect = () => {
      const newIndex = api.selectedScrollSnap(); if (activeIndex === newIndex) return;
      setIsAnimatingIn(false); setPreviousTextSlide(slides[activeIndex]);
      const t1 = setTimeout(() => {
        setActiveIndex(newIndex);
        const t2 = setTimeout(() => setIsAnimatingIn(true), 50);
        const t3 = setTimeout(() => setPreviousTextSlide(null), 700);
        setIsPlaying({}); const csd = slides[newIndex]; let vt: NodeJS.Timeout; if (csd?.type === 'video') { vt = setTimeout(() => setIsPlaying(p => ({...p, [csd.id]: true})), 250); }
        return () => { clearTimeout(t2); clearTimeout(t3); if (vt) clearTimeout(vt); };
      }, 200);
      return () => clearTimeout(t1);
    };
    api.on('select', handleSelect); api.on('settle', handleSelect); api.on('pointerDown', () => plugin.current.stop());
    return () => { api.off('select', handleSelect); api.off('settle', handleSelect); };
  }, [api, slides, activeIndex, isMounted]);

  const handleDotClick = React.useCallback((index: number) => api?.scrollTo(index), [api]);
  const handlePlayPause = (slideId: number, play: boolean) => {setIsPlaying(p => ({...p, [slideId]: play})); if(play) plugin.current.stop();};
  const handleVideoEnded = (slideId: number) => setIsPlaying(p => ({...p, [slideId]: false}));

  // Animation for incoming title words (from top, moving down)
  const renderIncomingTitleWords = (text: string, isVisible: boolean) => {
    const words = text.split(' ');
    
    // During server rendering or before hydration, render without animations
    if (!isMounted) {
      return words.map((word, index) => (
        <React.Fragment key={index}>
          <span className="inline-block">{word}</span>{' '}
        </React.Fragment>
      ));
    }
    
    // After hydration, apply animations
    return words.map((word, index) => (
      <React.Fragment key={index}>
        <span
          className="inline-block"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-25px)',
            transition: `opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)`,
            transitionDelay: `${index * 40}ms`
          }}
        >
          {word}
        </span>{' '}
      </React.Fragment>
    ));
  };

  // Animation for outgoing title words (moving down and out)
  const renderOutgoingTitleWords = (text: string) => {
    const words = text.split(' ');
    
    // After hydration, apply animations
    return words.map((word, index) => (
      <React.Fragment key={index}>
        <span
          className="inline-block"
          style={{
            opacity: 0,
            transform: 'translateY(25px)',
            transition: `opacity 0.3s ease-in, transform 0.4s ease-in-out`,
            transitionDelay: `${index * 20}ms`
          }}
        >
          {word}
        </span>{' '}
      </React.Fragment>
    ));
  };
  const currentTextSlideData = slides && slides.length > activeIndex ? slides[activeIndex] : null;
  const buttonEntryDelay = currentTextSlideData ? (currentTextSlideData.title.split(' ').length || 0) * 40 + 100 : 200;
  const buttonExitDelay = 50;

  if (!isMounted || !slides || slides.length === 0) {
    return ( <div className="w-full h-[60vh] bg-gray-200 flex items-center justify-center text-gray-500"> {isMounted && (!slides || slides.length === 0) ? "Error: No slides data." : "Initializing slider..."} </div> );
  }

  return (
    <>
      <style>{staticCss}</style>
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{ loop: true, active: slides.length > 1 }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full relative h-[60vh] min-h-[600px] bg-transparent feature-slider-container"
        style={dynamicCarouselStyles}
      >
        <CarouselContent className="-ml-4 h-[60vh] min-h-[600px]"> {/* The -ml-4 and pl-4 on item create space for bg to show */}
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id || index} className="pl-4" style={{ flexBasis: 'var(--calculated-page-container-width)' }}>
              <Card className="border-none rounded-2xl overflow-hidden shadow-none bg-transparent h-full w-full">
                <CardContent className="p-0 relative w-full h-full overflow-hidden">
                  {/* Colored background based on slide ID - always visible */}
                  <div
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundColor: `hsl(${(slide.id || index) * 60}, 70%, 50%)`,
                    }}
                  />
                  
                  {/* Main content container */}
                  <div className="absolute inset-0 z-10">
                    {slide.type === 'image' && slide.src ? (
                      <img
                        src={slide.src}
                        alt={slide.alt || slide.title || `Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={{ mixBlendMode: 'multiply' }}
                        onError={(e) => {
                          console.error(`Failed to load image: ${slide.src}`);
                          e.currentTarget.style.opacity = '0.3';
                        }}
                        onLoad={() => console.log(`Successfully loaded image: ${slide.src}`)}
                      />
                    ) : slide.type === 'video' && slide.src ? (
                      <div className="w-full h-full">
                        <ReactPlayer
                          url={slide.src}
                          playing={isPlaying[slide.id] || false}
                          controls={true}
                          width="100%"
                          height="100%"
                          className="[&_video]:!object-cover"
                          onPlay={() => handlePlayPause(slide.id, true)}
                          onPause={() => handlePlayPause(slide.id, false)}
                          onEnded={() => handleVideoEnded(slide.id)}
                          onError={(e: Error) => console.error(`ReactPlayer Error for src: ${slide.src}:`, e)}
                          config={{
                            youtube: { playerVars: { showinfo: 0, modestbranding: 1, controls: 1, rel: 0 } },
                            file: {
                              attributes: {
                                style: { width: '100%', height: '100%', objectFit: 'cover' },
                                controlsList: 'nodownload'
                              }
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white bg-black/30">
                        Invalid slide
                      </div>
                    )}
                  </div>
                  
                  {/* Gradient overlay on top of everything */}
                  <div className="absolute inset-0 custom-gradient-overlay z-20" />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Text, Button, and Navigation Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none">
          <div
            className="flex flex-col pointer-events-auto py-8 px-20 md:py-10 md:px-26 lg:py-12 lg:px-36"
            style={{
              maxWidth: 'var(--calculated-page-container-width)',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {/* Row 1: Title and Shop Button */}
            <div className="flex justify-between items-end w-full mb-6 md:mb-8">
              {/* Left Side: Title */}
              {/* Let title grow, but ensure padding to button. Button will not shrink. */}
              <div className="flex-grow min-w-0 pr-6 md:pr-8 max-w-[70%]"> {/* Added max-w-[70%] to limit width */}
                <div className="relative min-h-[80px] md:min-h-[120px] lg:min-h-[150px]">
                  {previousTextSlide && (
                    <h2 key={`title-exit-${previousTextSlide.id}`} aria-hidden="true" className="absolute inset-x-0 bottom-0 w-full text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-snug shadow-text">
                      {renderOutgoingTitleWords(previousTextSlide.title)}
                    </h2>
                  )}
                  {currentTextSlideData && (
                    <h2 key={`title-current-${currentTextSlideData.id}`} aria-label={currentTextSlideData.title} className="absolute inset-x-0 bottom-0 w-full text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-snug shadow-text">
                      {renderIncomingTitleWords(currentTextSlideData.title, isAnimatingIn)}
                    </h2>
                  )}
                </div>
              </div>

              {/* Right Side: Button */}
              {currentTextSlideData && (currentTextSlideData.buttonText || defaultButtonText) && (
                <div className="flex-shrink-0"> {/* Prevents button from shrinking */}
                  <div className="relative h-10 md:h-12">
                    {/* ... (Exiting Button JSX) ... */}
                     {previousTextSlide && (previousTextSlide.buttonText || defaultButtonText) && (
                      <div key={`button-exit-${previousTextSlide.id}`} aria-hidden="true" className="absolute inset-0 flex justify-end items-center" style={{ opacity: 0, transform: 'translateY(15px)', transition: `opacity 0.3s ease-in, transform 0.4s ease-in-out`, transitionDelay: `${buttonExitDelay}ms` }}>
                        <a
                          href={previousTextSlide.buttonLink || defaultButtonLink}
                          className="button button--primary button--md button--blur button--fixed pointer-events-auto"
                        >
                          <span className="btn-fill" data-fill=""></span>
                          <span className="btn-text">{previousTextSlide.buttonText || defaultButtonText}</span>
                        </a>
                      </div>
                    )}
                    {/* ... (Current/Incoming Button JSX) ... */}
                    <div key={`button-current-${currentTextSlideData.id}`} className="absolute inset-0 flex justify-end items-center" style={{ opacity: isAnimatingIn ? 1 : 0, transform: isAnimatingIn ? 'translateY(0)' : 'translateY(-15px)', transition: `opacity 0.4s ease-out, transform 0.5s ease-out`, transitionDelay: isAnimatingIn ? `${buttonEntryDelay}ms` : '0ms' }}>
                      <a
                        href={currentTextSlideData.buttonLink || defaultButtonLink}
                        className="button button--primary button--md button--blur button--fixed pointer-events-auto"
                      >
                        <span className="btn-fill" data-fill=""></span>
                        <span className="btn-text">{currentTextSlideData.buttonText || defaultButtonText}</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Horizontal divider line */}
            <hr className="w-full border-t border-gray-300/30 my-4" />

            {/* Row 2: Navigation Arrows and Dots */}
            {slides.length > 1 && (
              <div className="flex justify-between items-center w-full mt-4">
                <button onClick={() => api?.scrollPrev()} className="p-2 text-white hover:opacity-75 transition-opacity" aria-label="Previous slide">
                  <div className="w-8 h-8 md:w-10 md:h-10">
                    <svg className="w-full h-full" viewBox="0 0 37 24" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 5L3 11.9999M3 11.9999L10 18.9999M3 11.9999H33.5"></path></svg>
                  </div>
                </button>
                {showDots && (
                  <div className="flex space-x-2.5">
                    {slides.map((_, index) => (
                      <button key={index} onClick={() => handleDotClick(index)} aria-label={`Go to slide ${index + 1}`} className={cn('h-3 w-3 rounded-full transition-all duration-300 ease-out focus:outline-none', activeIndex === index ? 'bg-white scale-110' : 'bg-transparent border-2 border-white/60 hover:border-white focus:border-white')}/>
                    ))}
                  </div>
                )}
                <button onClick={() => api?.scrollNext()} className="p-2 text-white hover:opacity-75 transition-opacity" aria-label="Next slide">
                  <div className="w-8 h-8 md:w-10 md:h-10">
                    <svg className="w-full h-full" viewBox="0 0 37 24" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M26.5 5L33.5 11.9999M33.5 11.9999L26.5 18.9999M33.5 11.9999H3"></path></svg>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </Carousel>
    </>
  );
}