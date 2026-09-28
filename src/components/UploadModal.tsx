import React, { useState, useRef, useCallback } from 'react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: UploadedFile[]) => void;
  categories: string[];
  onAddCategory: (category: string) => boolean;
}

export interface UploadedFile {
  id: number;
  src: string;
  title: string;
  category: string;
  description: string;
  file: File;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, categories, onAddCategory }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; src: string }[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const newCategoryInputRef = useRef<HTMLInputElement>(null);

  const ADD_NEW_OPTION = '__ADD_NEW__';

  // Set default category saat pertama kali dibuka
  React.useEffect(() => {
    if (isOpen && categories.length > 0 && !category) {
      setCategory(categories[0]);
    }
  }, [isOpen, categories, category]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    const newPreviews = fileArray.map((file) => ({
      file,
      src: URL.createObjectURL(file),
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].src);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleCategoryChange = (value: string) => {
    if (value === ADD_NEW_OPTION) {
      setShowNewCategoryInput(true);
      setCategory('');
      setCategoryError('');
      // Focus ke input setelah render
      setTimeout(() => {
        newCategoryInputRef.current?.focus();
      }, 100);
    } else {
      setCategory(value);
      setCategoryError('');
    }
  };

  const handleAddNewCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategoryError('Nama kategori tidak boleh kosong');
      return;
    }
    
    const success = onAddCategory(trimmed);
    if (success) {
      setCategory(trimmed);
      setNewCategoryName('');
      setShowNewCategoryInput(false);
      setCategoryError('');
    } else {
      setCategoryError('Kategori sudah ada');
    }
  };

  const handleCancelNewCategory = () => {
    setShowNewCategoryInput(false);
    setNewCategoryName('');
    setCategoryError('');
    if (categories.length > 0) {
      setCategory(categories[0]);
    }
  };

  const handleNewCategoryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewCategory();
    } else if (e.key === 'Escape') {
      handleCancelNewCategory();
    }
  };

  const handleSubmit = () => {
    if (previews.length === 0) return;
    if (!category) {
      setCategoryError('Pilih atau buat kategori terlebih dahulu');
      return;
    }

    const uploadedFiles: UploadedFile[] = previews.map((preview, index) => ({
      id: Date.now() + index,
      src: preview.src,
      title: title || preview.file.name.replace(/\.[^/.]+$/, ''),
      category: category,
      description: description || 'Foto yang diupload oleh pengguna',
      file: preview.file,
    }));

    onUpload(uploadedFiles);
    handleClose();
  };

  const handleClose = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.src));
    setPreviews([]);
    setTitle('');
    setCategory(categories.length > 0 ? categories[0] : '');
    setDescription('');
    setShowNewCategoryInput(false);
    setNewCategoryName('');
    setCategoryError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Upload Foto</h2>
            <p className="text-sm text-gray-500 mt-1">Tambahkan foto ke galeri Anda</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                dragActive ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <svg className={`w-8 h-8 ${dragActive ? 'text-purple-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">
                {dragActive ? 'Lepaskan file di sini...' : 'Drag & drop foto di sini'}
              </p>
              <p className="text-gray-400 text-sm mt-1">atau klik untuk memilih file</p>
              <p className="text-gray-300 text-xs mt-2">PNG, JPG, WEBP (Maks. 10MB per file)</p>
            </div>
          </div>

          {/* Preview Grid */}
          {previews.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Preview ({previews.length} foto)
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group aspect-square rounded-lg overflow-hidden">
                    <img
                      src={preview.src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePreview(index);
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                      <p className="text-white text-xs truncate">{preview.file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Fields */}
          {previews.length > 0 && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Judul Foto
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul foto..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kategori / Tag
                </label>
                
                {!showNewCategoryInput ? (
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    <option value="" disabled>Pilih kategori...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value={ADD_NEW_OPTION} className="text-purple-600 font-medium">
                      + Tambah Kategori Baru...
                    </option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        ref={newCategoryInputRef}
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => {
                          setNewCategoryName(e.target.value);
                          setCategoryError('');
                        }}
                        onKeyDown={handleNewCategoryKeyDown}
                        placeholder="Nama kategori baru..."
                        className="flex-1 px-4 py-2.5 border border-purple-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        maxLength={30}
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        Tambah
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelNewCategory}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                    {categoryError && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {categoryError}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Tekan Enter untuk menambah, Esc untuk batal
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsikan foto Anda..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={previews.length === 0 || !category}
            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-500/25"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload ({previews.length})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
