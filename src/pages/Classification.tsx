
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClassificationStore } from "@/store/useClassificationStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageViewer from "@/components/ImageViewer";
import { toast } from "sonner";

const Classification = () => {
  const navigate = useNavigate();
  const { 
    getCurrentTest, 
    getCurrentImage, 
    selections, 
    resetSelections, 
    validateSelections,
    currentTestId
  } = useClassificationStore();
  
  const [resetting, setResetting] = useState(false);
  
  // Check if we have a valid test
  useEffect(() => {
    const currentTest = getCurrentTest();
    const currentImage = getCurrentImage();
    
    console.log("Classification page mounted", { 
      hasTest: !!currentTest, 
      hasImage: !!currentImage,
      testId: currentTestId
    });
    
    if (!currentTest || !currentImage) {
      console.error("No test selected, redirecting to index");
      navigate("/");
    }
  }, [getCurrentTest, getCurrentImage, navigate, currentTestId]);
  
  const currentTest = getCurrentTest();
  const currentImage = getCurrentImage();
  
  if (!currentTest || !currentImage) {
    return null;
  }
  
  const handleSubmit = () => {
    // Vérifier si toutes les images ont été classifiées
    const classifiedImages = Object.keys(selections).length;
    const totalImages = currentTest.images.length;
    
    if (classifiedImages < totalImages) {
      toast.warning(`Vous n'avez classifié que ${classifiedImages} sur ${totalImages} images. Veuillez classifier toutes les images avant de soumettre.`);
      return;
    }
    
    validateSelections();
    navigate("/results");
  };
  
  const handleReset = () => {
    if (resetting) {
      resetSelections();
      setResetting(false);
      toast.success("Toutes les classifications ont été réinitialisées.");
    } else {
      setResetting(true);
      toast.info("Appuyez à nouveau sur Reset pour confirmer la réinitialisation de toutes les classifications.", {
        duration: 3000,
        onDismiss: () => setResetting(false)
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={currentTest.name} 
        showSelect={true} 
      />
      
      <ImageViewer />
      
      <Footer 
        onSubmit={handleSubmit} 
        onReset={handleReset} 
      />
    </div>
  );
};

export default Classification;
