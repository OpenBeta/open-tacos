import type { NextPage } from 'next'

export type INextPageWithAuth = NextPage & { auth: boolean }
