
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useClassificationStore } from "@/store/useClassificationStore";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { tests, setCurrentTest, currentTestId } = useClassificationStore();
  
  // Reset test selection when landing on the index page
  useEffect(() => {
    console.log("Index page mounted, current test ID:", currentTestId);
  }, [currentTestId]);
  
  const handleSelectTest = (testId: number) => {
    console.log("Test selected:", testId);
    setCurrentTest(testId);
    navigate("/classification");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Classification d'Images
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card key={test.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-app-blue to-app-purple text-white">
                <CardTitle>{test.name}</CardTitle>
                <CardDescription className="text-gray-100">
                  {test.images.length} images à classifier
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4 text-sm text-gray-600">
                  Classifications disponibles:
                  <ul className="mt-1 list-disc list-inside">
                    {test.labels.slice(0, 3).map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                    {test.labels.length > 3 && <li>...</li>}
                  </ul>
                </div>
                <Button 
                  className="w-full bg-app-blue hover:bg-blue-600"
                  onClick={() => handleSelectTest(test.id)}
                >
                  Commencer le test
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
