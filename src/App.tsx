import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import Gallery from './components/Gallery';
import Lightbox from './components/Lightbox';
import CategoryFilter from './components/CategoryFilter';
import UploadModal, { UploadedFile } from './components/UploadModal';
import ActivityLogModal from './components/ActivityLogModal';
import SelectionActionBar from './components/SelectionActionBar';
import { photos as defaultPhotos, Photo } from './data/photos';
import { downloadMultiplePhotos, downloadPhoto } from './utils/download';
import { useCategories } from './hooks/useCategories';
import { useActivityLog } from './hooks/useActivityLog';

function App() {
  const { filterCategories, categories, addCategory } = useCategories();
  const { logs, logUpload, logDownload, logDelete, removeLog, clearLogs } = useActivityLog();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);
  const [deletedDefaultPhotoIds, setDeletedDefaultPhotoIds] = useState<Set<number>>(new Set());
  
  // Selection mode states
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'single' | 'multiple' | 'all';
    photos?: Photo[];
  } | null>(null);
  
  // Infinite scroll states
  const ITEMS_PER_PAGE = 8;
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Gabungkan foto default dengan foto yang diupload (kecuali yang dihapus)
  const allPhotos = useMemo(() => {
    const defaultPhotosFiltered = defaultPhotos.filter(p => !deletedDefaultPhotoIds.has(p.id));
    return [...uploadedPhotos, ...defaultPhotosFiltered];
  }, [uploadedPhotos, deletedDefaultPhotoIds]);

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

  // Foto yang ditampilkan (infinite scroll)
  const displayedPhotos = useMemo(() => {
    return filteredPhotos.slice(0, displayCount);
  }, [filteredPhotos, displayCount]);

  const hasMorePhotos = displayCount < filteredPhotos.length;

  // Reset display count saat filter berubah
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [activeCategory, searchQuery]);

  // Load more photos
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMorePhotos) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, hasMorePhotos]);

  // Intersection Observer untuk infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || isLoadingMore || !hasMorePhotos) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: '200px',
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loadMore, isLoadingMore, hasMorePhotos]);

  const handlePhotoClick = useCallback((photo: Photo) => {
    if (!selectionMode) {
      setSelectedPhoto(photo);
    }
  }, [selectionMode]);

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
    
    if (files.length === 1) {
      logUpload(files[0].title, files[0].category);
    } else {
      logUpload(`${files.length} foto`, files[0].category, files.length);
    }
  }, [logUpload]);

  // Delete single photo (semua foto bisa dihapus)
  const handleDeletePhoto = useCallback((photoId: number) => {
    const photo = allPhotos.find(p => p.id === photoId);
    if (!photo) return;

    // Cek apakah foto default atau upload
    const isDefault = defaultPhotos.some(p => p.id === photoId);
    
    if (isDefault) {
      setDeletedDefaultPhotoIds(prev => new Set(prev).add(photoId));
    } else {
      setUploadedPhotos((prev) => prev.filter((p) => p.id !== photoId));
    }

    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
    }

    // Remove from selection if selected
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      newSet.delete(photoId);
      return newSet;
    });
    
    logDelete(photo.title);
  }, [allPhotos, selectedPhoto, logDelete]);

  const handleDownloadPhoto = useCallback(async (photo: Photo) => {
    await downloadPhoto(photo);
    logDownload(photo.title);
  }, [logDownload]);

  const handleDownloadAll = useCallback(async () => {
    if (filteredPhotos.length === 0) return;
    await downloadMultiplePhotos(filteredPhotos);
    
    if (filteredPhotos.length === 1) {
      logDownload(filteredPhotos[0].title);
    } else {
      logDownload(`${filteredPhotos.length} foto`, undefined, filteredPhotos.length);
    }
  }, [filteredPhotos, logDownload]);

  const isUploadedPhoto = useCallback((photo: Photo) => {
    return uploadedPhotos.some((p) => p.id === photo.id);
  }, [uploadedPhotos]);

  // Selection mode handlers
  const handleToggleSelect = useCallback((photoId: number) => {
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedPhotos(new Set(filteredPhotos.map(p => p.id)));
  }, [filteredPhotos]);

  const handleDeselectAll = useCallback(() => {
    setSelectedPhotos(new Set());
  }, []);

  const handleExitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedPhotos(new Set());
  }, []);

  // Mass operations
  const handleDownloadSelected = useCallback(async () => {
    const photosToDownload = filteredPhotos.filter(p => selectedPhotos.has(p.id));
    if (photosToDownload.length === 0) return;
    
    await downloadMultiplePhotos(photosToDownload);
    
    if (photosToDownload.length === 1) {
      logDownload(photosToDownload[0].title);
    } else {
      logDownload(`${photosToDownload.length} foto`, undefined, photosToDownload.length);
    }
  }, [filteredPhotos, selectedPhotos, logDownload]);

  const handleDeleteSelected = useCallback(() => {
    const photosToDelete = filteredPhotos.filter(p => selectedPhotos.has(p.id));
    if (photosToDelete.length === 0) return;
    
    setShowDeleteConfirm({
      type: 'multiple',
      photos: photosToDelete,
    });
  }, [filteredPhotos, selectedPhotos]);

  const handleDeleteAll = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    
    setShowDeleteConfirm({
      type: 'all',
      photos: filteredPhotos,
    });
  }, [filteredPhotos]);

  const confirmDelete = useCallback(() => {
    if (!showDeleteConfirm) return;

    if (showDeleteConfirm.type === 'all' && showDeleteConfirm.photos) {
      // Hapus semua foto
      showDeleteConfirm.photos.forEach(photo => {
        const isDefault = defaultPhotos.some(p => p.id === photo.id);
        if (isDefault) {
          setDeletedDefaultPhotoIds(prev => new Set(prev).add(photo.id));
        } else {
          setUploadedPhotos(prev => prev.filter(p => p.id !== photo.id));
        }
        logDelete(photo.title);
      });
    } else if (showDeleteConfirm.type === 'multiple' && showDeleteConfirm.photos) {
      // Hapus foto terpilih
      showDeleteConfirm.photos.forEach(photo => {
        const isDefault = defaultPhotos.some(p => p.id === photo.id);
        if (isDefault) {
          setDeletedDefaultPhotoIds(prev => new Set(prev).add(photo.id));
        } else {
          setUploadedPhotos(prev => prev.filter(p => p.id !== photo.id));
        }
        logDelete(photo.title);
      });
    }

    // Clear selection
    setSelectedPhotos(new Set());
    setSelectionMode(false);
    setShowDeleteConfirm(null);
  }, [showDeleteConfirm, logDelete]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={setSearchQuery}
        onUploadClick={() => setIsUploadOpen(true)}
        onHistoryClick={() => setIsHistoryOpen(true)}
        uploadedCount={uploadedPhotos.length}
        activityCount={logs.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
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

        {/* Category Filter */}
        {allPhotos.length > 0 && (
          <div className="mb-8">
            <CategoryFilter
              categories={filterCategories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        )}

        {/* Photo count & actions */}
        {filteredPhotos.length > 0 && (
          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-semibold text-gray-700">{displayedPhotos.length}</span> dari <span className="font-semibold text-gray-700">{filteredPhotos.length}</span> foto
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
              {/* Selection mode toggle */}
              {!selectionMode && (
                <button
                  onClick={() => setSelectionMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Pilih Foto</span>
                </button>
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

        {/* Gallery dengan Infinite Scroll */}
        <Gallery
          photos={displayedPhotos}
          onPhotoClick={handlePhotoClick}
          onDeletePhoto={handleDeletePhoto}
          onDownloadPhoto={handleDownloadPhoto}
          isUploadedPhoto={isUploadedPhoto}
          onLoadMore={loadMore}
          isLoading={isLoadingMore}
          hasMore={hasMorePhotos}
          loadMoreRef={loadMoreRef}
          selectionMode={selectionMode}
          selectedPhotos={selectedPhotos}
          onToggleSelect={handleToggleSelect}
        />
      </main>

      {/* Selection Action Bar */}
      {selectionMode && (
        <SelectionActionBar
          selectedCount={selectedPhotos.size}
          totalCount={filteredPhotos.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onDownloadSelected={handleDownloadSelected}
          onDeleteSelected={handleDeleteSelected}
          onDeleteAll={handleDeleteAll}
          onExitSelectionMode={handleExitSelectionMode}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {showDeleteConfirm.type === 'all' ? 'Hapus Semua Foto?' : 'Hapus Foto Terpilih?'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {showDeleteConfirm.type === 'all' 
                    ? `${showDeleteConfirm.photos?.length || 0} foto akan dihapus permanen`
                    : `${showDeleteConfirm.photos?.length || 0} foto terpilih akan dihapus permanen`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

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
        onDelete={() => selectedPhoto && handleDeletePhoto(selectedPhoto.id)}
        onDownload={() => selectedPhoto && handleDownloadPhoto(selectedPhoto)}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
        categories={categories}
        onAddCategory={addCategory}
      />

      {/* Activity Log Modal */}
      <ActivityLogModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        logs={logs}
        onRemoveLog={removeLog}
        onClearLogs={clearLogs}
      />
    </div>
  );
}

export default App;
