import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Gallery from './components/Gallery';
import Lightbox from './components/Lightbox';
import CategoryFilter from './components/CategoryFilter';
import UploadModal, { UploadedFile } from './components/UploadModal';
import { photos as defaultPhotos, categories, Photo } from './data/photos';
import { downloadMultiplePhotos } from './utils/download';

function App() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);

  // Gabungkan foto default dengan foto yang diupload
  const allPhotos = useMemo(() => {
    return [...uploadedPhotos, ...defaultPhotos];
  }, [uploadedPhotos]);

  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((photo) => {
      const matchesCategory = activeCategory === 'Semua' || photo.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, allPhotos]);

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

  const handleUpload = useCallback((files: UploadedFile[]) => {
    const newPhotos: Photo[] = files.map((file) => ({
      id: file.id,
      src: file.src,
      title: file.title,
      category: file.category,
      description: file.description,
    }));
    setUploadedPhotos((prev) => [...newPhotos, ...prev]);
  }, []);

  const handleDeletePhoto = useCallback((photoId: number) => {
    setUploadedPhotos((prev) => prev.filter((p) => p.id !== photoId));
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
    }
  }, [selectedPhoto]);

  const handleDownloadAll = useCallback(async () => {
    if (filteredPhotos.length === 0) return;
    await downloadMultiplePhotos(filteredPhotos);
  }, [filteredPhotos]);

  const isUploadedPhoto = useCallback((photo: Photo) => {
    return uploadedPhotos.some((p) => p.id === photo.id);
  }, [uploadedPhotos]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={setSearchQuery}
        onUploadClick={() => setIsUploadOpen(true)}
        uploadedCount={uploadedPhotos.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Galeri Foto Anda
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {allPhotos.length === 0 
              ? 'Mulai dengan mengunggah foto pertama Anda dan buat koleksi yang menginspirasi.'
              : 'Kelola, lihat, dan unduh koleksi foto Anda dengan mudah.'}
          </p>
        </div>

        {/* Category Filter - hanya tampilkan jika ada foto */}
        {allPhotos.length > 0 && (
          <div className="mb-8">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        )}

        {/* Photo count & actions */}
        {filteredPhotos.length > 0 && (
          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-semibold text-gray-700">{filteredPhotos.length}</span> foto
              {activeCategory !== 'Semua' && (
                <span> dalam kategori <span className="font-semibold text-purple-600">{activeCategory}</span></span>
              )}
            </p>
            <div className="flex items-center gap-2">
              {uploadedPhotos.length > 0 && (
                <p className="text-xs text-purple-500 bg-purple-50 px-3 py-1 rounded-full">
                  ✨ {uploadedPhotos.length} foto diupload
                </p>
              )}
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Semua</span>
              </button>
            </div>
          </div>
        )}

        {/* Gallery */}
        <Gallery
          photos={filteredPhotos}
          onPhotoClick={handlePhotoClick}
          onDeletePhoto={handleDeletePhoto}
          isUploadedPhoto={isUploadedPhoto}
        />
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
        onDelete={selectedPhoto && isUploadedPhoto(selectedPhoto) ? () => handleDeletePhoto(selectedPhoto.id) : undefined}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}

export default App;
