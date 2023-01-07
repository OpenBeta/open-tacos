import { graphqlClient } from './Client'
import { tagsLeaderboardQuery } from './gql/pulse'
import { getUserNickFromMediaDir } from '../../js/usernameUtil'
import { TagsByUserType, TagsLeaderboardType } from '../../js/types'

interface TagsAggregate {
  userUuid: string
  total: number
}

export const getTagsLeaderboard = async (): Promise<TagsLeaderboardType> => {
  try {
    const rs = await graphqlClient.query<{ getTagsLeaderboard: TagsAggregate[] }>({
      query: tagsLeaderboardQuery
    })

    const list = await Promise.all(rs.data.getTagsLeaderboard.map(resolveUsername))

    // Better to have the backend give us a grand total, but it's okay to calculate it here
    const grandTotal = list.reduce((acc, curr) => {
      return acc + curr.total
    }, 0)

    return {
      grandTotal,
      list
    }
  } catch (e) {
    console.log(e)
  }

  return {
    grandTotal: 0,
    list: []
  }
}

const resolveUsername = async (entry: TagsAggregate): Promise<TagsByUserType> => {
  const username = await getUserNickFromMediaDir(entry.userUuid)
  return {
    total: entry.total,
    username: username
  }
}
