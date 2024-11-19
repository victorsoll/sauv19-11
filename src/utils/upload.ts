import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';

const BUCKET_NAME = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DIMENSION = 1200;

const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: MAX_FILE_SIZE / (1024 * 1024),
    maxWidthOrHeight: MAX_DIMENSION,
    useWebWorker: true,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Erreur de compression:', error);
    return file;
  }
};

export async function uploadImage(file: File): Promise<string> {
  try {
    // Compression de l'image
    const compressedFile = await compressImage(file);
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${uuidv4()}.${fileExt}`;

    // Upload du fichier
    const { error: uploadError, data } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`images/${fileName}`, compressedFile, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Erreur upload:', uploadError);
      throw new Error('Erreur lors de l\'upload de l\'image');
    }

    if (!data?.path) {
      throw new Error('Chemin du fichier non disponible');
    }

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    if (!publicUrl) {
      throw new Error('Impossible de générer l\'URL publique');
    }

    return publicUrl;
  } catch (error) {
    console.error('Erreur upload:', error);
    throw error instanceof Error ? error : new Error('Une erreur inattendue est survenue');
  }
}