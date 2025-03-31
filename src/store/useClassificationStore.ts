
import { create } from 'zustand';
import { Test, ClassificationResult } from '@/types';
import { testData } from '@/data/testData';

interface ClassificationState {
  tests: Test[];
  currentTestId: number | null;
  currentImageIndex: number;
  selections: Record<number, string>;
  results: ClassificationResult[];
  
  // Actions
  setCurrentTest: (testId: number) => void;
  nextImage: () => void;
  prevImage: () => void;
  selectLabel: (imageId: number, label: string) => void;
  resetSelections: () => void;
  validateSelections: () => void;
  getCurrentTest: () => Test | undefined;
  getCurrentImage: () => { id: number; src: string } | undefined;
  hasNextTest: () => boolean;
  goToNextTest: () => void;
}

export const useClassificationStore = create<ClassificationState>((set, get) => ({
  tests: testData,
  currentTestId: null,
  currentImageIndex: 0,
  selections: {},
  results: [],
  
  setCurrentTest: (testId: number) => {
    set({ 
      currentTestId: testId,
      currentImageIndex: 0,
      selections: {},
      results: []
    });
  },
  
  nextImage: () => {
    const currentTest = get().getCurrentTest();
    if (!currentTest) return;
    
    const nextIndex = get().currentImageIndex + 1;
    if (nextIndex < currentTest.images.length) {
      set({ currentImageIndex: nextIndex });
    }
  },
  
  prevImage: () => {
    const prevIndex = get().currentImageIndex - 1;
    if (prevIndex >= 0) {
      set({ currentImageIndex: prevIndex });
    }
  },
  
  selectLabel: (imageId: number, label: string) => {
    set(state => ({
      selections: {
        ...state.selections,
        [imageId]: label
      }
    }));
  },
  
  resetSelections: () => {
    set({ selections: {} });
  },
  
  validateSelections: () => {
    const currentTest = get().getCurrentTest();
    if (!currentTest) return;
    
    const results: ClassificationResult[] = [];
    
    Object.entries(get().selections).forEach(([imageIdStr, selectedLabel]) => {
      const imageId = parseInt(imageIdStr);
      const correctLabel = currentTest.correctAnswers[imageId];
      
      results.push({
        id: imageId,
        selectedLabel,
        correctLabel,
        isCorrect: selectedLabel === correctLabel
      });
    });
    
    set({ results });
  },
  
  getCurrentTest: () => {
    const { tests, currentTestId } = get();
    return tests.find(test => test.id === currentTestId);
  },
  
  getCurrentImage: () => {
    const currentTest = get().getCurrentTest();
    if (!currentTest) return undefined;
    
    return currentTest.images[get().currentImageIndex];
  },
  
  hasNextTest: () => {
    const { tests, currentTestId } = get();
    const currentIndex = tests.findIndex(test => test.id === currentTestId);
    return currentIndex < tests.length - 1;
  },
  
  goToNextTest: () => {
    const { tests, currentTestId } = get();
    const currentIndex = tests.findIndex(test => test.id === currentTestId);
    
    if (currentIndex < tests.length - 1) {
      const nextTestId = tests[currentIndex + 1].id;
      get().setCurrentTest(nextTestId);
    }
  }
}));
