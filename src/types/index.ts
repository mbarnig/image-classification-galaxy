
export interface ImageItem {
  id: number;
  src: string;
  correctLabel?: string;
}

export interface ClassificationResult {
  id: number;
  selectedLabel: string;
  correctLabel: string;
  isCorrect: boolean;
}

export interface Test {
  id: number;
  name: string;
  images: ImageItem[];
  labels: string[];
  correctAnswers: Record<number, string>;
}
