import { gql } from '@apollo/client'
import { FRAGMENT_CHANGE_HISTORY } from './contribs'

export const GET_AREA_HISTORY = gql`
    ${FRAGMENT_CHANGE_HISTORY}     
    query GetAreaHistory ($filter: AreaHistoryFilter) {
        getAreaHistory(filter: $filter) {
            ...ChangeHistoryFields
        }   
    }
`
