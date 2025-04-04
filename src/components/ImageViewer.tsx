
import { useState, useEffect, useCallback } from "react";
import { useClassificationStore } from "@/store/useClassificationStore";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";

const ImageViewer = () => {
  const { 
    getCurrentTest, 
    getCurrentImage, 
    currentImageIndex,
    selections,
    setCurrentImageIndex
  } = useClassificationStore();
  
  const currentTest = getCurrentTest();
  const currentImage = getCurrentImage();
  const isMobile = useIsMobile();
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  
  useEffect(() => {
    // For debugging purposes
    if (currentTest) {
      setDebugInfo({
        testId: currentTest.id,
        testName: currentTest.name,
        totalImages: currentTest.images.length,
        currentImageIndex,
        hasCurrentImage: !!currentImage,
        imageId: currentImage?.id
      });
    }
    
    // Reset image loaded state when image changes
    setImageLoaded(false);
  }, [currentTest, currentImage, currentImageIndex]);
  
  // Sync carousel with current image index
  useEffect(() => {
    if (carouselApi && currentImageIndex !== undefined) {
      carouselApi.scrollTo(currentImageIndex);
    }
  }, [carouselApi, currentImageIndex]);
  
  const handleCarouselChange = useCallback(() => {
    if (carouselApi) {
      const selectedIndex = carouselApi.selectedScrollSnap();
      setCurrentImageIndex(selectedIndex);
    }
  }, [carouselApi, setCurrentImageIndex]);
  
  // Set up carousel change listener
  useEffect(() => {
    if (carouselApi) {
      carouselApi.on("select", handleCarouselChange);
      return () => {
        carouselApi.off("select", handleCarouselChange);
      };
    }
  }, [carouselApi, handleCarouselChange]);
  
  if (!currentTest || !currentImage) {
    console.error("No test or image available", { currentTest, currentImage, debugInfo });
    return (
      <div className="flex flex-col justify-center items-center h-64 p-4">
        <div className="text-center text-red-500 mb-4">Aucune image disponible</div>
        <pre className="bg-gray-100 p-2 text-xs overflow-auto max-w-full">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    );
  }
  
  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
    if (carouselApi) {
      carouselApi.scrollTo(index);
    }
  };

  return (
    <div className="relative py-4 my-20 animate-fade-in flex-1 flex items-center justify-center">
      {/* Image carousel */}
      <div className="w-full">
        <Carousel 
          className="w-full max-w-3xl mx-auto"
          opts={{
            align: "start",
            loop: false,
          }}
          orientation={isMobile ? "vertical" : "horizontal"}
          setApi={setCarouselApi}
        >
          <CarouselContent className={isMobile ? "flex-col h-[70vh]" : "h-auto"}>
            {currentTest.images.map((image, index) => (
              <CarouselItem 
                key={image.id} 
                className={`${isMobile ? "pt-4 h-full" : "pl-4"}`}
              >
                <div className={`relative rounded-lg overflow-hidden shadow-lg bg-gray-100 ${isMobile ? "h-full" : "aspect-video"} flex items-center justify-center`}>
                  <img 
                    src={image.src} 
                    alt={`Image ${image.id}`} 
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => {
                      if (index === currentImageIndex) {
                        setImageLoaded(true);
                      }
                    }}
                  />
                  
                  {/* Image number overlay */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm font-bold">
                    {index + 1} / {currentTest.images.length}
                  </div>
                  
                  {/* Classification overlay */}
                  {selections[image.id] && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-center">
                      {selections[image.id]}
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className={`flex ${isMobile ? "flex-col h-full absolute right-0 top-0" : "justify-between mt-4"}`}>
            <CarouselPrevious className={`${isMobile ? "-left-0 top-1/2" : ""} z-10`} />
            <CarouselNext className={`${isMobile ? "-right-0 top-1/2" : ""} z-10`} />
          </div>
        </Carousel>
      </div>
      
      {/* Debug information during development */}
      {process.env.NODE_ENV !== "production" && debugInfo && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32 max-w-2xl mx-auto">
          <details>
            <summary>Debug Info</summary>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
