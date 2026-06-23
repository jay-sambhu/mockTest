// src/lib/mockCategories.ts
export type Category = {
  id: string;
  name: string;
  imageUrl?: string;
};

export const mockCategories: Category[] = [
  { id: "math", name: "Mathematics", imageUrl: "/globe.svg" },
  { id: "science", name: "Science", imageUrl: "/globe.svg" },
  { id: "history", name: "History", imageUrl: "/globe.svg" },
  { id: "language", name: "Language Arts", imageUrl: "/globe.svg" },
];
