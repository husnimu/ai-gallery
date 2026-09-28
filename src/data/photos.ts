export interface Photo {
  id: number;
  src: string;
  title: string;
  category: string;
  description: string;
}

export const categories = ['Semua', 'Alam', 'Arsitektur', 'Hewan', 'Makanan', 'Perjalanan'];

// Galeri kosong di awal - pengguna dapat upload foto mereka sendiri
export const photos: Photo[] = [];
