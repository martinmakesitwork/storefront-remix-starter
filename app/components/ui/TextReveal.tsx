import React from 'react';
import { Slide } from 'react-awesome-reveal'; // Changed from Fade to Slide
// import { cn } from '~/lib/utils'; // Removed cn for simplification

// Changed props: Removed 'text', 'as'. Added 'children', changed 'triggerOnScroll' to 'triggerOnce'.
interface TextRevealProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode; // Now accepts children
  duration?: number;
  delay?: number;
  triggerOnce?: boolean; // Use triggerOnce from react-awesome-reveal
  cascade?: boolean;
  damping?: number;
  direction?: 'down' | 'left' | 'right' | 'up';
  // Add other react-awesome-reveal props as needed (e.g., fraction)
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children, // Use children directly
  duration = 1000,
  delay = 0,
  triggerOnce = false, // Default to trigger EVERY time it enters viewport
  cascade = false,
  damping = 0.1, // Default damping for cascade effect speed
  direction,
  className,
  style,
  ...props // Pass remaining props to the wrapper div
}) => {
  return (
    // Using Slide effect wrapper
    <Slide // Changed from Fade to Slide
      duration={duration}
      delay={delay}
      triggerOnce={triggerOnce}
      cascade={cascade}
      damping={damping}
      direction={direction}
      className={className} // Pass className directly
      style={style} // Apply style to the wrapper
      {...props} // Apply remaining props like id to the Fade wrapper
    >
      {/* Render children directly */}
      {children}
    </Slide>
  );
};
