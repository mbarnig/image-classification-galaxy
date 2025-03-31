
import { useState, useEffect, useCallback } from "react";
import { useClassificationStore } from "@/store/useClassificationStore";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CarouselApi } from "@/components/ui/carousel";

const ImageViewer = () => {
  const { 
    getCurrentTest, 
    getCurrentImage, 
    nextImage, 
    prevImage, 
    currentImageIndex,
    selections,
    selectLabel,
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

  const handleSelectLabel = (label: string) => {
    if (currentImage) {
      selectLabel(currentImage.id, label);
      toast.success(`Image classifiée comme "${label}"`);
    }
  };

  return (
    <div className="relative p-4 mt-4 mb-24 animate-fade-in">
      {/* Image carousel */}
      <div className="mb-6">
        <Carousel 
          className="w-full max-w-3xl mx-auto"
          opts={{
            align: "start",
            loop: false,
            // Use proper axis type for embla carousel
            axis: isMobile ? "y" : "x",
          }}
          orientation={isMobile ? "vertical" : "horizontal"}
          setApi={setCarouselApi}
        >
          <CarouselContent className={isMobile ? "flex-col h-[60vh]" : "h-auto"}>
            {currentTest.images.map((image, index) => (
              <CarouselItem 
                key={image.id} 
                className={`${isMobile ? "pt-4 h-full" : "pl-4"}`}
              >
                <div className={`relative rounded-lg overflow-hidden shadow-lg bg-gray-100 ${isMobile ? "h-full" : "aspect-video"} flex items-center justify-center`}>
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white rounded-md px-2 py-1 text-sm z-10">
                    {String(image.id).padStart(2, '0')}
                  </div>
                  
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
                  
                  {selections[image.id] && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-4 py-2">
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

      {/* Navigation indicators */}
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {currentTest.images.map((image, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className={`w-8 h-8 p-0 rounded-full ${
              index === currentImageIndex 
                ? "bg-app-blue text-white border-app-blue" 
                : "bg-transparent"
            }`}
            onClick={() => handleImageSelect(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
      
      {/* Current image info */}
      <div className="text-sm font-medium text-center text-gray-700 bg-white py-2 px-4 rounded-full shadow mb-6 max-w-fit mx-auto">
        Image {currentImageIndex + 1} sur {currentTest.images.length}
      </div>
      
      {/* Label selection buttons */}
      <ScrollArea className="h-auto max-w-2xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-1">
          {currentTest.labels.map((label) => (
            <Button
              key={label}
              variant={selections[currentImage.id] === label ? "default" : "outline"}
              onClick={() => handleSelectLabel(label)}
              className={`text-sm transition-all ${
                selections[currentImage.id] === label 
                  ? 'bg-app-blue hover:bg-blue-700' 
                  : 'hover:border-app-blue hover:text-app-blue'
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
      </ScrollArea>
      
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
