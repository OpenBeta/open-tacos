import { ApolloLink } from '@apollo/client'

/**
 * Add a tag used to `fetch()` which can be used to invalidate the data cache.
 * @see https://nextjs.org/docs/app/api-reference/functions/revalidateTag
 */
export const dynamicTagsLink = new ApolloLink((operation, forward) => {
  // Get the dynamicTag from the operation context
  const dynamicTag = operation.getContext().dynamicTag

  // If dynamicTag exists, update the operation context
  if (dynamicTag != null) {
    operation.setContext(({ headers = {} }) => ({
      headers,
      fetchOptions: {
        next: {
          tags: [dynamicTag]
        }
      }
    }))
  }

  // Pass the operation to the next link in the chain
  return forward(operation)
})
