
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClassificationStore } from "@/store/useClassificationStore";

// Cette page sert de pont pour passer au test suivant
const NextTest = () => {
  const navigate = useNavigate();
  const { hasNextTest, goToNextTest } = useClassificationStore();
  
  useEffect(() => {
    if (hasNextTest()) {
      goToNextTest();
      navigate("/classification");
    } else {
      navigate("/");
    }
  }, [hasNextTest, goToNextTest, navigate]);
  
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="text-center">
        <p className="text-lg text-gray-600">Chargement du prochain test...</p>
      </div>
    </div>
  );
};

export default NextTest;
