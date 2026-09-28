import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Gallery from './components/Gallery';
import Lightbox from './components/Lightbox';
import CategoryFilter from './components/CategoryFilter';
import { photos, categories, Photo } from './data/photos';

function App() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesCategory = activeCategory === 'Semua' || photo.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handlePhotoClick = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const handleNext = useCallback(() => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIndex]);
  }, [selectedPhoto, filteredPhotos]);

  const handlePrev = useCallback(() => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[prevIndex]);
  }, [selectedPhoto, filteredPhotos]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Jelajahi Koleksi Foto
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Temukan keindahan dalam setiap gambar. Koleksi foto dari berbagai kategori
            yang akan menginspirasi Anda.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Photo count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Menampilkan <span className="font-semibold text-gray-700">{filteredPhotos.length}</span> foto
            {activeCategory !== 'Semua' && (
              <span> dalam kategori <span className="font-semibold text-purple-600">{activeCategory}</span></span>
            )}
          </p>
        </div>

        {/* Gallery */}
        <Gallery photos={filteredPhotos} onPhotoClick={handlePhotoClick} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-bold text-gray-700">Galeri Foto</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Galeri Foto. Dibuat dengan ❤️ menggunakan React & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <Lightbox
        photo={selectedPhoto}
        onClose={handleCloseLightbox}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}

export default App;
