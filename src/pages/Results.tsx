
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClassificationStore } from "@/store/useClassificationStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResultsViewer from "@/components/ResultsViewer";

const Results = () => {
  const navigate = useNavigate();
  const { 
    getCurrentTest, 
    results, 
    hasNextTest,
    goToNextTest
  } = useClassificationStore();
  
  const currentTest = getCurrentTest();
  
  useEffect(() => {
    // Si aucun résultat n'est disponible, rediriger vers la classification
    if (results.length === 0) {
      navigate("/classification");
    }
  }, [results, navigate]);
  
  if (!currentTest) {
    navigate("/");
    return null;
  }
  
  const handleNextTest = () => {
    goToNextTest();
    navigate("/classification");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Consultation des Résultats" />
      
      <ResultsViewer />
      
      <Footer 
        showBackButton={true}
        showMenuButton={true}
        showForwardButton={hasNextTest()}
      />
    </div>
  );
};

export default Results;
