import { gql } from '@apollo/client'

export const openCollectiveQuery = gql`query account($slug: String) {
    account(slug: $slug) {
      members(role: BACKER) {
        nodes {
          account {
            id
            name
            imageUrl
          }
        }
      }
      stats {
        totalNetAmountReceived {
          value
          currency
        }
      }
    }
  }
  `
