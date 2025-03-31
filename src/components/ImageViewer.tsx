
import { useState, useEffect } from "react";
import { useClassificationStore } from "@/store/useClassificationStore";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageViewer = () => {
  const { 
    getCurrentTest, 
    getCurrentImage, 
    nextImage, 
    prevImage, 
    currentImageIndex,
    selections
  } = useClassificationStore();
  
  const currentTest = getCurrentTest();
  const currentImage = getCurrentImage();
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
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
  }, [currentTest, currentImage, currentImageIndex]);
  
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
  
  const totalImages = currentTest.images.length;
  const selectedLabel = selections[currentImage.id];
  
  const handlePrev = () => {
    console.log("Navigate to previous image", { currentImageIndex });
    setImageLoaded(false);
    prevImage();
  };
  
  const handleNext = () => {
    console.log("Navigate to next image", { currentImageIndex });
    setImageLoaded(false);
    nextImage();
  };
  
  return (
    <div className="relative p-4 mt-16 mb-20 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={currentImageIndex === 0}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-sm text-gray-500">
          Image {currentImageIndex + 1} sur {totalImages}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentImageIndex === totalImages - 1}
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-100 aspect-video">
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white rounded-md px-2 py-1 text-sm z-10">
          {String(currentImage.id).padStart(2, '0')}
        </div>
        
        <img 
          src={currentImage.src} 
          alt={`Image ${currentImage.id}`} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {selectedLabel && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-4 py-2">
            {selectedLabel}
          </div>
        )}
      </div>
      
      {/* Debug information during development */}
      {process.env.NODE_ENV !== "production" && debugInfo && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
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
