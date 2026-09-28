import React from 'react';
import { Photo } from '../data/photos';

interface GalleryProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

const Gallery: React.FC<GalleryProps> = ({ photos, onPhotoClick }) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-400 text-lg">Tidak ada foto ditemukan</p>
        <p className="text-gray-300 text-sm mt-1">Coba kata kunci lain atau pilih kategori berbeda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          onClick={() => onPhotoClick(photo)}
        >
          <div className="aspect-[4/3] overflow-hidden">
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
        </div>
      ))}
    </div>
  );
};

export default Gallery;
