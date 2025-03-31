
import { useClassificationStore } from "@/store/useClassificationStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle } from "lucide-react";

const ResultsViewer = () => {
  const { getCurrentTest, results } = useClassificationStore();
  const currentTest = getCurrentTest();
  
  if (!currentTest) {
    return <div>Aucun test sélectionné</div>;
  }
  
  const correctCount = results.filter(result => result.isCorrect).length;
  const totalCount = results.length;
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  
  const getResultText = () => {
    if (percentage >= 90) {
      return "Excellent! Vous avez une excellente compréhension des classifications.";
    } else if (percentage >= 70) {
      return "Très bien! Vous avez une bonne compréhension des classifications.";
    } else if (percentage >= 50) {
      return "Pas mal! Continuez à pratiquer pour améliorer votre compréhension.";
    } else {
      return "Vous avez besoin de plus de pratique. Réessayez le test pour améliorer vos connaissances.";
    }
  };
  
  return (
    <div className="pt-16 pb-20 px-4 animate-fade-in">
      <ScrollArea className="h-[calc(100vh-9rem)] pr-4">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold text-center mb-4">Résultat: {percentage}%</h2>
            <div className="text-center mb-4">
              {correctCount} correct{correctCount > 1 ? 's' : ''} sur {totalCount}
            </div>
            <p className="text-center text-gray-700">{getResultText()}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-3">Détails des réponses:</h3>
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.id} className="flex items-start">
                  {result.isCorrect ? (
                    <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-1" size={18} />
                  ) : (
                    <XCircle className="text-red-500 mr-2 flex-shrink-0 mt-1" size={18} />
                  )}
                  <div>
                    <div className="font-medium">Image {String(result.id).padStart(2, '0')}</div>
                    <div className="text-sm text-gray-600">
                      Votre réponse: <span className={result.isCorrect ? "text-green-600" : "text-red-600"}>{result.selectedLabel}</span>
                    </div>
                    {!result.isCorrect && (
                      <div className="text-sm text-gray-600">
                        Réponse correcte: <span className="text-green-600">{result.correctLabel}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-2">Conseils pour améliorer:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Examinez attentivement les caractéristiques distinctives de chaque classification.</li>
              <li>Prenez votre temps pour analyser les images avant de faire votre choix.</li>
              <li>Révisez vos erreurs et notez les difficultés récurrentes.</li>
              <li>Pratiquez régulièrement pour renforcer votre capacité à reconnaître les différentes catégories.</li>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ResultsViewer;
