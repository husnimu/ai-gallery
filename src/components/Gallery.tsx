import React from 'react';
import { Photo } from '../data/photos';
import { downloadPhoto } from '../utils/download';

interface GalleryProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  onDeletePhoto?: (photoId: number) => void;
  isUploadedPhoto?: (photo: Photo) => boolean;
}

const Gallery: React.FC<GalleryProps> = ({ photos, onPhotoClick, onDeletePhoto, isUploadedPhoto }) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Galeri Anda Kosong</h3>
        <p className="text-gray-400 text-base mb-6">Mulai dengan mengunggah foto pertama Anda</p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Klik tombol <strong className="text-purple-600">Upload</strong> di pojok kanan atas untuk memulai</span>
        </div>
      </div>
    );
  }

  const handleDownload = async (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation();
    await downloadPhoto(photo);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => {
        const isUploaded = isUploadedPhoto ? isUploadedPhoto(photo) : false;
        return (
          <div
            key={photo.id}
            className="group relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => onPhotoClick(photo)}
          >
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-sm">{photo.title}</h3>
                <p className="text-white/70 text-xs mt-1">{photo.category}</p>
              </div>
            </div>
            {/* Category badge */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-xs font-medium">
                {photo.category}
              </span>
            </div>
            {/* Uploaded badge */}
            {isUploaded && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-purple-500/90 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Upload
                </span>
              </div>
            )}
            {/* Action buttons - download & delete */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              {/* Download button */}
              <button
                onClick={(e) => handleDownload(e, photo)}
                className="w-8 h-8 bg-blue-500/90 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                title="Download foto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              {/* Delete button for uploaded photos */}
              {isUploaded && onDeletePhoto && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Hapus foto ini dari galeri?')) {
                      onDeletePhoto(photo.id);
                    }
                  }}
                  className="w-8 h-8 bg-red-500/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                  title="Hapus foto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Gallery;
