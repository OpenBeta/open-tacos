import { gql } from '@apollo/client'

export const tagsLeaderboardQuery = gql`query {
    getTagsLeaderboard(limit: 30) {
        total
        userUuid
    }
  }
`
