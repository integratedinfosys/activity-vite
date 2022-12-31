import create from "zustand";
import { ICategory } from "../types";

type CategoryStore = {
  isCategoryStoreLoaded: boolean;
  setIsCategoryStoreLoaded: (value:boolean) =>void;
  categories: ICategory[] | [];
  setCategories: (categories: ICategory[]) => void;
  createCategory: (category: ICategory) => void;
  updateCategory: (category: ICategory) => void;
  deleteCategory: (categoryId: number|string) => void;
};

const useCategoryStore = create<CategoryStore>((set, get) => ({
  isCategoryStoreLoaded: false,
  setIsCategoryStoreLoaded: (value)=> set((state) => ({isCategoryStoreLoaded: value})),
  categories: [],
  // setCategories: (categories) => set((state) => ({ categories })),
  setCategories: (categories) => set((state) => ({ categories: categories.sort((a,b)=>(a.name > b.name)? 1: -1) })),
  // createCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
  createCategory: (category) => set((state) => ({ 
    categories: [...state.categories, category].sort((a,b)=>(a.name > b.name)? 1: -1) 
    
  })),
  deleteCategory: (categoryId) =>
    set((state) => ({
      categories: state.categories.filter((item) => item.id != categoryId),
    })),
  updateCategory: (category) =>
    set((state) => ({
      categories: state.categories.map((item) => {
        if (item.id === category.id) {
          return Object.assign(item, category);
        }
        return item;
      }),
    }))
}));

export default useCategoryStore;
