
import { Test } from "@/types";

export const SAMPLE_IMAGES = [
  "/lovable-uploads/galaxie_spirale.jpg",
  "/lovable-uploads/galaxie_elliptique.jpg",
  "/lovable-uploads/galaxie_irreguliere.jpg",
  "/lovable-uploads/galaxie_lenticuliere.jpg",
  "/lovable-uploads/amas_etoiles.jpg",
  "/lovable-uploads/carre.jpg",
  "/lovable-uploads/triangle.jpg",
  "/lovable-uploads/cercle.jpg",
  "/lovable-uploads/rectangle.jpg",
  "/lovable-uploads/hexagone.jpg",
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
      { id: 1, src: SAMPLE_IMAGES[5] },
      { id: 2, src: SAMPLE_IMAGES[6] },
      { id: 3, src: SAMPLE_IMAGES[7] },
      { id: 4, src: SAMPLE_IMAGES[8] },
      { id: 5, src: SAMPLE_IMAGES[9] }
    ],
    labels: [
      "Carré",
      "Triangle",
      "Cercle",
      "Rectangle",
      "Hexagone"
    ],
    correctAnswers: {
      1: "Carré",
      2: "Triangle",
      3: "Cercle",
      4: "Rectangle",
      5: "Hexagone"
    }
  }
];
