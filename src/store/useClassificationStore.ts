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
  setCurrentImageIndex: (index: number) => void;
}

export const useClassificationStore = create<ClassificationState>((set, get) => ({
  tests: testData,
  currentTestId: null,
  currentImageIndex: 0,
  selections: {},
  results: [],
  
  setCurrentTest: (testId: number) => {
    console.log("Setting current test to:", testId);
    set({ 
      currentTestId: testId,
      currentImageIndex: 0,
      selections: {},
      results: []
    });
    
    // Verify the test was properly set
    setTimeout(() => {
      const state = get();
      console.log("After setting test:", {
        currentTestId: state.currentTestId,
        currentTest: state.getCurrentTest()
      });
    }, 0);
  },
  
  setCurrentImageIndex: (index: number) => {
    const currentTest = get().getCurrentTest();
    if (!currentTest) {
      console.error("Cannot set image index: No current test");
      return;
    }
    
    if (index >= 0 && index < currentTest.images.length) {
      console.log("Setting current image index to:", index);
      set({ currentImageIndex: index });
    } else {
      console.error("Image index out of range:", { index, totalImages: currentTest.images.length });
    }
  },
  
  nextImage: () => {
    const currentTest = get().getCurrentTest();
    if (!currentTest) {
      console.error("Cannot navigate to next image: No current test");
      return;
    }
    
    const nextIndex = get().currentImageIndex + 1;
    console.log("Navigating to next image", { 
      current: get().currentImageIndex,
      next: nextIndex,
      totalImages: currentTest.images.length
    });
    
    if (nextIndex < currentTest.images.length) {
      set({ currentImageIndex: nextIndex });
    }
  },
  
  prevImage: () => {
    const prevIndex = get().currentImageIndex - 1;
    console.log("Navigating to previous image", { 
      current: get().currentImageIndex,
      prev: prevIndex
    });
    
    if (prevIndex >= 0) {
      set({ currentImageIndex: prevIndex });
    }
  },
  
  selectLabel: (imageId: number, label: string) => {
    console.log("Selecting label", { imageId, label });
    set(state => ({
      selections: {
        ...state.selections,
        [imageId]: label
      }
    }));
  },
  
  resetSelections: () => {
    console.log("Resetting all selections");
    set({ selections: {} });
  },
  
  validateSelections: () => {
    const currentTest = get().getCurrentTest();
    if (!currentTest) {
      console.error("Cannot validate: No current test");
      return;
    }
    
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
    
    console.log("Validation results:", results);
    set({ results });
  },
  
  getCurrentTest: () => {
    const { tests, currentTestId } = get();
    const currentTest = tests.find(test => test.id === currentTestId);
    
    if (!currentTest && currentTestId !== null) {
      console.error("Current test not found:", { currentTestId, availableTests: tests.map(t => t.id) });
    }
    
    return currentTest;
  },
  
  getCurrentImage: () => {
    const currentTest = get().getCurrentTest();
    if (!currentTest) {
      console.error("Cannot get current image: No current test");
      return undefined;
    }
    
    const index = get().currentImageIndex;
    if (index < 0 || index >= currentTest.images.length) {
      console.error("Image index out of range:", { index, totalImages: currentTest.images.length });
      return undefined;
    }
    
    return currentTest.images[index];
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
      console.log("Going to next test:", { current: currentTestId, next: nextTestId });
      get().setCurrentTest(nextTestId);
    } else {
      console.error("No next test available");
    }
  }
}));
