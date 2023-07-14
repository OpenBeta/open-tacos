import { Storage, GetSignedUrlConfig } from '@google-cloud/storage'

/**
 * GCloud storage client.  Todo: move this to its own module.
 */
const storage = new Storage({
  credentials: {
    type: 'service_account',
    private_key: process.env.GC_BUCKET_PRIVATE_KEY ?? '',
    client_email: process.env.GC_BUCKET_CLIENT_EMAIL ?? ''
  }
})

/**
 * Get a signed url for uploading to a bucket
 * @param filename
 */
export const getSignedUrlForUpload = async (filename: string): Promise<string> => {
  const options: GetSignedUrlConfig = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000 // 15 minutes
  }

  // Get a signed URL for uploading the file
  const [url] = await storage
    .bucket(process.env.GC_BUCKET_NAME ?? '')
    .file(filename)
    .getSignedUrl(options)

  if (url == null) {
    throw new Error('Unable get signed url for uploading')
  }

  return url
}

export const deleteMediaFromBucket = async (filename: string): Promise<void> => {
  await storage.bucket(process.env.GC_BUCKET_NAME ?? '').file(filename, { }).delete()
}
