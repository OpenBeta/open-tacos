import { gql } from '@apollo/client'

export const MUTATION_ADD_COUNTRY = gql`
mutation ($isoCode: String!) {
    addCountry(input: {alpha3ISOCode: $isoCode}) {
      areaName
      uuid
    }
}`

export const MUTATION_ADD_AREA = gql`
mutation ($name: String!, $parentUuid: String, $countryCode: String) {
    addArea(input: { name: $name, parentUuid: $parentUuid, countryCode: $countryCode } ) {
      areaName
      uuid
    }
}`
