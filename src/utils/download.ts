import { Photo } from '../data/photos';

/**
 * Download foto dari URL atau blob
 */
export const downloadPhoto = async (photo: Photo): Promise<void> => {
  try {
    const response = await fetch(photo.src);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${photo.title || 'foto'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading photo:', error);
    // Fallback: buka di tab baru jika download gagal
    window.open(photo.src, '_blank');
  }
};

/**
 * Download multiple photos
 */
export const downloadMultiplePhotos = async (photos: Photo[]): Promise<void> => {
  for (const photo of photos) {
    await downloadPhoto(photo);
    // Delay kecil untuk menghindari pemblokiran browser
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
