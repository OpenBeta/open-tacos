
/**
 * Invalidate old climb page cache src/pages/climbs/<id>
 * @param uuid
 * @deprecated
 */
export const legacyInvalidateClimbPageCache = async (uuid: string): Promise<void> => {
  try {
    await fetch(`/api/legacyInvalidateClimbCache?c=${uuid}`)
  } catch (e) {
    console.log('Error invalidating climb page cache', e)
  }
}
