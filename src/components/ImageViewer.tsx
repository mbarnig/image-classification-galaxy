
import { useState, useEffect, useCallback } from "react";
import { useClassificationStore } from "@/store/useClassificationStore";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

const ImageViewer = () => {
  const { 
    getCurrentTest, 
    getCurrentImage, 
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
            axis: isMobile ? "y" : "x"
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
