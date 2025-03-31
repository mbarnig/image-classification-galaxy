
import { Test } from "@/types";

export const SAMPLE_IMAGES = [
  "/lovable-uploads/cd71cf85-be14-4758-b41c-dae270a469be.png",
  "/lovable-uploads/ac03ed3f-7c7f-4136-8f0c-9eb72159ece6.png",
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1518770660439-4636190af475"
];

export const testData: Test[] = [
  {
    id: 1,
    name: "Classification des Galaxies",
    images: [
      { id: 1, src: SAMPLE_IMAGES[0] },
      { id: 2, src: SAMPLE_IMAGES[1] },
      { id: 3, src: SAMPLE_IMAGES[2] },
      { id: 4, src: SAMPLE_IMAGES[3] },
      { id: 5, src: SAMPLE_IMAGES[4] }
    ],
    labels: [
      "Galaxie Spirale",
      "Galaxie Elliptique",
      "Galaxie Irrégulière",
      "Galaxie Lenticulaire",
      "Amas d'étoiles"
    ],
    correctAnswers: {
      1: "Galaxie Spirale",
      2: "Galaxie Elliptique",
      3: "Galaxie Lenticulaire",
      4: "Galaxie Spirale",
      5: "Galaxie Irrégulière"
    }
  },
  {
    id: 2,
    name: "Classification des Formes",
    images: [
      { id: 1, src: SAMPLE_IMAGES[2] },
      { id: 2, src: SAMPLE_IMAGES[3] },
      { id: 3, src: SAMPLE_IMAGES[4] },
      { id: 4, src: SAMPLE_IMAGES[0] },
      { id: 5, src: SAMPLE_IMAGES[1] }
    ],
    labels: [
      "Carré",
      "Triangle",
      "Cercle",
      "Rectangle",
      "Hexagone"
    ],
    correctAnswers: {
      1: "Cercle",
      2: "Rectangle",
      3: "Triangle",
      4: "Hexagone",
      5: "Carré"
    }
  }
];
