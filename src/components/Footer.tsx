
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FooterProps {
  onSubmit?: () => void;
  onReset?: () => void;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  showForwardButton?: boolean;
}

const Footer = ({ 
  onSubmit, 
  onReset, 
  showBackButton = false,
  showMenuButton = false,
  showForwardButton = false
}: FooterProps) => {
  const navigate = useNavigate();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10 p-4">
      <div className="max-w-screen-xl mx-auto flex justify-between">
        {onSubmit && onReset ? (
          <>
            <Button 
              onClick={onSubmit} 
              variant="default" 
              className="flex-1 mr-2 bg-app-green text-white hover:bg-green-600"
            >
              Validation
            </Button>
            <Button 
              onClick={onReset} 
              variant="outline" 
              className="flex-1 ml-2 border-app-red text-app-red hover:bg-red-50"
            >
              Reset
            </Button>
          </>
        ) : (
          <div className="w-full flex justify-between">
            {showBackButton && (
              <Button 
                onClick={() => navigate('/classification')} 
                variant="outline"
                className="border-app-blue text-app-blue flex items-center"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Retour
              </Button>
            )}
            
            {showMenuButton && (
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                className="border-app-purple text-app-purple"
              >
                <Menu className="mr-1 h-4 w-4" />
                MENU
              </Button>
            )}
            
            {showForwardButton && (
              <Button 
                onClick={() => navigate('/next-test')} 
                variant="outline"
                className="border-app-blue text-app-blue flex items-center"
              >
                Suivant
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
