'use client'
import useUsernameCheck, { useUsernameCheckAppDir } from '@/js/hooks/useUsernameCheck'

/**
 * A wrapper component to imperatively check if the user has completed onboarding.
 */
export const OnboardingCheck: React.FC<{ isAppDir?: boolean }> = ({ isAppDir = true }) => {
  if (isAppDir) {
    useUsernameCheckAppDir()
  } else {
    useUsernameCheck()
  }
  return null
}
