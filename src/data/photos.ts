export interface Photo {
  id: number;
  src: string;
  title: string;
  category: string;
  description: string;
}

export const categories = ['Semua', 'Alam', 'Arsitektur', 'Hewan', 'Makanan', 'Perjalanan'];

export const photos: Photo[] = [
  {
    id: 1,
    src: 'https://picsum.photos/seed/nature1/600/400',
    title: 'Pegunungan Hijau',
    category: 'Alam',
    description: 'Pemandangan pegunungan yang hijau dan asri',
  },
  {
    id: 2,
    src: 'https://picsum.photos/seed/arch1/600/400',
    title: 'Gedung Modern',
    category: 'Arsitektur',
    description: 'Desain arsitektur modern yang menakjubkan',
  },
  {
    id: 3,
    src: 'https://picsum.photos/seed/animal1/600/400',
    title: 'Kucing Lucu',
    category: 'Hewan',
    description: 'Kucing yang sedang beristirahat dengan santai',
  },
  {
    id: 4,
    src: 'https://picsum.photos/seed/food1/600/400',
    title: 'Hidangan Lezat',
    category: 'Makanan',
    description: 'Hidangan kuliner yang menggugah selera',
  },
  {
    id: 5,
    src: 'https://picsum.photos/seed/travel1/600/400',
    title: 'Pantai Tropis',
    category: 'Perjalanan',
    description: 'Pantai dengan pasir putih dan air biru jernih',
  },
  {
    id: 6,
    src: 'https://picsum.photos/seed/nature2/600/400',
    title: 'Air Terjun',
    category: 'Alam',
    description: 'Air terjun yang mengalir deras di tengah hutan',
  },
  {
    id: 7,
    src: 'https://picsum.photos/seed/arch2/600/400',
    title: 'Jembatan Klasik',
    category: 'Arsitektur',
    description: 'Jembatan bersejarah dengan desain klasik',
  },
  {
    id: 8,
    src: 'https://picsum.photos/seed/animal2/600/400',
    title: 'Burung Warna-warni',
    category: 'Hewan',
    description: 'Burung dengan bulu yang berwarna-warni indah',
  },
  {
    id: 9,
    src: 'https://picsum.photos/seed/food2/600/400',
    title: 'Dessert Manis',
    category: 'Makanan',
    description: 'Kue dan dessert yang cantik dan lezat',
  },
  {
    id: 10,
    src: 'https://picsum.photos/seed/travel2/600/400',
    title: 'Kota Malam',
    category: 'Perjalanan',
    description: 'Pemandangan kota di malam hari dengan lampu-lampu',
  },
  {
    id: 11,
    src: 'https://picsum.photos/seed/nature3/600/400',
    title: 'Danau Tenang',
    category: 'Alam',
    description: 'Danau yang tenang dengan refleksi pegunungan',
  },
  {
    id: 12,
    src: 'https://picsum.photos/seed/arch3/600/400',
    title: 'Kuil Kuno',
    category: 'Arsitektur',
    description: 'Kuil bersejarah dengan arsitektur yang megah',
  },
  {
    id: 13,
    src: 'https://picsum.photos/seed/animal3/600/400',
    title: 'Anjing Setia',
    category: 'Hewan',
    description: 'Anjing yang setia dan menggemaskan',
  },
  {
    id: 14,
    src: 'https://picsum.photos/seed/food3/600/400',
    title: 'Kopi Pagi',
    category: 'Makanan',
    description: 'Secangkir kopi hangat untuk memulai hari',
  },
  {
    id: 15,
    src: 'https://picsum.photos/seed/travel3/600/400',
    title: 'Gunung Saat Senja',
    category: 'Perjalanan',
    description: 'Pemandangan gunung saat matahari terbenam',
  },
  {
    id: 16,
    src: 'https://picsum.photos/seed/nature4/600/400',
    title: 'Hutan Bambu',
    category: 'Alam',
    description: 'Hutan bambu yang rindang dan menenangkan',
  },
  {
    id: 17,
    src: 'https://picsum.photos/seed/arch4/600/400',
    title: 'Menara Tinggi',
    category: 'Arsitektur',
    description: 'Menara pencakar langit yang menjulang tinggi',
  },
  {
    id: 18,
    src: 'https://picsum.photos/seed/animal4/600/400',
    title: 'Kupu-kupu',
    category: 'Hewan',
    description: 'Kupu-kupu cantik di atas bunga',
  },
];
