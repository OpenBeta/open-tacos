import { gql } from '@apollo/client'

export const tagsLeaderboardQuery = gql`query {
  getTagsLeaderboard(limit: 30) {
    allTime {
      totalMediaWithTags
      byUsers {
        total
        userUuid
        username
      }
    }
  }
}`
