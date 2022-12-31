import { Database } from "./types/supabase"
// export type IGenericResponse = {
//     status: string;
//     message: string;
//   };
export type ICategory = Database['public']['Tables']['categories']['Row']
export type IActivity = Database['public']['Tables']['activities']['Row']
  
  // export type ICategoryResponse = {
  //   status: string;
  //   note: ICategory;
  // };
  
  // export type ICategoriesResponse = {
  //   status: string;
  //   results: number;
  //   notes: ICategory[];
  // };