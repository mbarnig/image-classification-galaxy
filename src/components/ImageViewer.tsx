
import { useState, useEffect } from "react";
import { useClassificationStore } from "@/store/useClassificationStore";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const ImageViewer = () => {
  const { 
    getCurrentTest, 
    getCurrentImage, 
    nextImage, 
    prevImage, 
    currentImageIndex,
    selections,
    selectLabel
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
    
    // Reset image loaded state when image changes
    setImageLoaded(false);
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
  
  const handleSelectLabel = (label: string) => {
    selectLabel(currentImage.id, label);
    toast.success(`Image classifiée comme "${label}"`);
  };
  
  return (
    <div className="relative p-4 mt-8 mb-32 animate-fade-in">
      {/* Navigation controls */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={currentImageIndex === 0}
          className="rounded-full border-2 h-12 w-12 shadow-md"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <div className="text-sm font-medium text-gray-700 bg-white py-2 px-4 rounded-full shadow">
          Image {currentImageIndex + 1} sur {totalImages}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentImageIndex === totalImages - 1}
          className="rounded-full border-2 h-12 w-12 shadow-md"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Image display */}
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-100 aspect-video max-w-2xl mx-auto">
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white rounded-md px-2 py-1 text-sm z-10">
          {String(currentImage.id).padStart(2, '0')}
        </div>
        
        <img 
          src={currentImage.src} 
          alt={`Image ${currentImage.id}`} 
          className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-app-blue border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {selectedLabel && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-4 py-2">
            {selectedLabel}
          </div>
        )}
      </div>
      
      {/* Label selection buttons */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto">
        {currentTest.labels.map((label) => (
          <Button
            key={label}
            variant={selectedLabel === label ? "default" : "outline"}
            onClick={() => handleSelectLabel(label)}
            className={`text-sm transition-all ${
              selectedLabel === label 
                ? 'bg-app-blue hover:bg-blue-700' 
                : 'hover:border-app-blue hover:text-app-blue'
            }`}
          >
            {label}
          </Button>
        ))}
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
