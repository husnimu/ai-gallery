import React from 'react';

interface LoadingIndicatorProps {
  isLoading: boolean;
  hasMore: boolean;
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  isLoading, 
  hasMore,
  message = 'Memuat lebih banyak foto...'
}) => {
  if (!isLoading && !hasMore) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Semua foto telah ditampilkan</p>
        <p className="text-gray-400 text-sm mt-1">Tidak ada foto lagi untuk dimuat</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-purple-200 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-500 font-medium mt-4">{message}</p>
      </div>
    );
  }

  return null;
};

export default LoadingIndicator;
