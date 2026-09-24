import { requireSupabase } from './supabase';

export const PRODUCT_IMAGES_BUCKET = 'product-images';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function validateProductImage(file: File): string | null {
  const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.includes(file.type) && !ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    return 'نوع الملف غير مدعوم. الصيغ المسموحة: JPG و PNG و WEBP';
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'حجم الصورة كبير. الحد الأقصى المسموح هو 5MB';
  }
  return null;
}

function extensionOf(file: File): string {
  const fromName = (file.name.split('.').pop() || '').toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp'].includes(fromName)) return fromName === 'jpeg' ? 'jpg' : fromName;
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}

/** Uploads a product image to persistent Supabase Storage and returns its public URL. */
export async function uploadProductImage(file: File): Promise<string> {
  const validationError = validateProductImage(file);
  if (validationError) throw new Error(validationError);

  const client = requireSupabase();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extensionOf(file)}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await client.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(filePath, file, { contentType: file.type, upsert: false });

  if (uploadError) throw new Error(`فشل رفع الصورة: ${uploadError.message}`);

  const { data } = client.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(filePath);
  if (!data?.publicUrl) throw new Error('فشل الحصول على رابط الصورة بعد الرفع');
  return data.publicUrl;
}

/** Best-effort removal of a product image from Storage (non-fatal if it fails). */
export async function deleteProductImageByUrl(imageUrl: string): Promise<void> {
  try {
    const client = requireSupabase();
    const marker = `/${PRODUCT_IMAGES_BUCKET}/`;
    const idx = imageUrl.indexOf(marker);
    if (idx === -1) return; // External URL (e.g. seed/URL mode) — nothing to delete
    const filePath = imageUrl.slice(idx + marker.length).split('?')[0];
    if (!filePath) return;
    await client.storage.from(PRODUCT_IMAGES_BUCKET).remove([filePath]);
  } catch {
    // Intentionally ignored — product deletion must not fail because of image cleanup
  }
}
