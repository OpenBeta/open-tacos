/**
 * Shared types for gallery pages
 */

export interface GalleryPageParams {
  uuid: string
  photoId: string
}

export interface GalleryPageSearchParams {
  type?: 'area' | 'climb'
}

export interface GalleryPageProps {
  params: Promise<GalleryPageParams>
  searchParams: Promise<GalleryPageSearchParams>
}
