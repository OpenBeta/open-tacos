import * as Auth0 from 'auth0'
import { NextResponse } from 'next/server'

/**
 * Handle Auth0 errors
 */

export const errorHandler = (error: any): NextResponse => {
  console.error('#### Auth0 error ####', error)
  if (error instanceof Auth0.AuthApiError) {
    return NextResponse.json({ error: error?.error_description ?? '' }, { status: error?.statusCode ?? 401 })
  }
  return NextResponse.json({ error: 'Unexpected auth error' }, { status: 401 })
}
