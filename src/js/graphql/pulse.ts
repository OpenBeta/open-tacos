import { graphqlClient } from './Client'
import { tagsLeaderboardQuery } from './gql/pulse'
import { TagsLeaderboardType } from '../../js/types'

export const getTagsLeaderboard = async (): Promise<TagsLeaderboardType> => {
  const rs = await graphqlClient.query<{ getTagsLeaderboard: TagsLeaderboardType }>({
    query: tagsLeaderboardQuery
  })

  return rs.data.getTagsLeaderboard
}
