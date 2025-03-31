
import { useClassificationStore } from "@/store/useClassificationStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeaderProps {
  title?: string;
  showSelect?: boolean;
}

const Header = ({ title, showSelect = false }: HeaderProps) => {
  const { getCurrentTest, getCurrentImage, selectLabel, selections } = useClassificationStore();
  
  const currentTest = getCurrentTest();
  const currentImage = getCurrentImage();
  
  const handleSelectChange = (value: string) => {
    if (currentImage) {
      selectLabel(currentImage.id, value);
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 p-4">
      <div className="max-w-screen-xl mx-auto">
        {title && <h1 className="text-xl font-bold text-center mb-2">{title}</h1>}
        
        {showSelect && currentTest && (
          <Select 
            onValueChange={handleSelectChange} 
            value={currentImage ? selections[currentImage.id] : undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une classification" />
            </SelectTrigger>
            <SelectContent>
              {currentTest.labels.map((label) => (
                <SelectItem key={label} value={label}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </header>
  );
};

export default Header;
