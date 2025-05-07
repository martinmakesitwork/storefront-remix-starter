// src/data/slides.ts (example)
export interface SlideData {
    id: number;
    type: 'image' | 'video';
    src: string; // URL for image or video source
    title: string;
    alt?: string; // Alt text for images
    buttonText?: string; // Optional: override default button text
    buttonLink?: string; // Optional: link for the button
  }
  
  export const slides: SlideData[] = [
    {
      id: 1,
      type: 'image',
      src: 'https://picsum.photos/1000/2000', // Replace with your actual image path/URL
      alt: 'Fashion accessories line drawing',
      title: 'IMAGE SLIDE 1',
    },
    {
      id: 2,
      type: 'image',
      src: 'https://picsum.photos/1000/2000', // Replace with your actual image path/URL
      alt: 'Travel and photography gear line drawing',
      title: 'IMAGE SLIDE 2',
    },
    {
      id: 3,
      type: 'video',
      // Use a YouTube video URL or any URL react-player supports
      src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example YouTube link (replace!)
      // Or use a direct video file URL: src: '/videos/my-video.mp4'
      title: 'VIDEO SLIDE',
    },
     {
      id: 4,
      type: 'video',
      // Example using a direct video file (place it in your public folder)
      src: '/videos/vid1.mp4', // Replace with your actual video path
      title: 'Bridging Global Innovation and Local Expertise',
    },
  ];
  
