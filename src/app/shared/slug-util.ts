// src/app/slug-util.ts
export function createSlug(title: string): string {
    return title
      .toLowerCase()                      
      .trim()                              
      .replace(/[^a-z0-9]+/g, '-')         
      .replace(/^-+|-+$/g, '');           
  }
  