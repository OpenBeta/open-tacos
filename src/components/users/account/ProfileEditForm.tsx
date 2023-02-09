import { ReactElement, useCallback, useState, useLayoutEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { getUserProfile, updateUserProfile } from '../../../js/auth/CurrentUserClient'
import TextField from '../../ui/TextField'
import Snackbar from '../../ui/Snackbar'
import { IWritableUserMetadata } from '../../../js/types/User'
import { doesUsernameExist } from '../../../js/userApi/user'
import { checkUsername, checkWebsiteUrl } from '../../../js/utils'
import { revalidateUserHomePage } from '../../../js/stores/media'

const UserProfileSchema = Yup.object().shape({
  nick: Yup.string()
    .min(2, 'Minimum 2 characters')
    .max(30, 'Maximum 30 characters')
    .required('Minimum 2 characters')
    .test('special-rules', 'Must start and end with a letter or a number.', checkUsername),
  name: Yup.string()
    .max(50, 'Maximum 50 characters.'),
  bio: Yup.string()
    .notRequired()
    .max(150, 'Maximum 150 characters')
    .test('less-than-3-lines', 'Maximum 2 lines', (text) => (text?.split(/\r\n|\r|\n/)?.length ?? 0) <= 2),
  website: Yup.string()
    .nullable()
    .notRequired()
    .max(150, 'Maximum 150 characters')
    .when('website', {
      is: val => val?.length > 0,
      then: rule => {
        if (rule != null) {
          return Yup.string().test('special-rules', 'Invalid URL', (x) => checkWebsiteUrl(x) !== null)
        } else {
          return Yup.string().notRequired()
        }
      }
    })
}, [['website', 'website']])

/**
 * Allow users to edit their profile data (held in Auth0 metadata store).
 *
 * Presents as a simple form with freetext fields for the various edit-able
 * attributes present on the user's profile.
 */
export default function ProfileEditForm (): ReactElement {
  const [loadingName, setLoadingUser] = useState(false)
  const [justSubmitted, setJustSubmitted] = useState(false)
  const [isChanged, setChanged] = useState(false)
  const [profile, setProfile] = useState<IWritableUserMetadata>({
    name: '',
    nick: '',
    bio: '',
    website: undefined
  })

  useLayoutEffect(() => {
    const asyncLoad = async (): Promise<void> => {
      const profile = await getUserProfile()
      if (profile != null) { setProfile(profile) }
    }
    void asyncLoad()
  }, [])

  /** When a user submits their changes, this handler will attempt the submission. */
  const submitHandler = useCallback(async (newValues: IWritableUserMetadata) => {
    // Send a request to the server to update the user's profile
    const profile = await updateUserProfile(newValues)

    if (profile != null) {
      // Update the profile object in the state
      setProfile(profile)
      // Set the flag that indicates the user just submitted a change
      setJustSubmitted(true)
      // Also trigger a page rebuild
      void revalidateUserHomePage(profile.nick)
    } else {
      // profile did not update for some reason
      // TODO: display that profile did not update
      console.error('Profile object was supposed to not be null!')
    }
  }, [])

  /**
   * Usernames are globally unique in the openbeta environment, so we check
   * ahead of time if the user has filled out a taken username.
   */
  const checkUsernameHandler = useCallback(async (value: string|undefined) => {
    setLoadingUser(true)
    if (value == null) {
      setLoadingUser(false) // reset to default state
      return undefined
    }

    if (profile.nick !== value) {
      setChanged(true) // if username has changed
    } else {
      setChanged(false) // if not, prompt user to change username
    }

    // only check if nick has changed from the original
    if (profile.nick !== value && await doesUsernameExist(value)) {
      setLoadingUser(false)
      return 'User name is already taken!'
    }
    setLoadingUser(false)
    return undefined
  }, [profile.nick])

  return (
    <div data-lpignore='true'>
      <h3 className='text-center mb-6'>
        Edit your profile details
      </h3>

      <Formik
        initialValues={profile}
        validationSchema={UserProfileSchema}
        onSubmit={submitHandler}
        enableReinitialize
      >{({ isValid, isSubmitting, dirty }) => (
        <Form>
          <div className='flex relative justify-end'>
            <TextField
              name='nick'
              label='Username'
              validate={checkUsernameHandler}
              isChanged={isChanged}
              validateImmediately
            />

            {loadingName && (
              <div className='absolute bg-ob-primary p-1 rounded-full text-white -right-2 top-2 animate-spin'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                </svg>
              </div>
            )}
          </div>

          <TextField name='name' label='Display Name' isChanged />
          <TextField name='bio' label='Bio' multiline rows={3} spellcheck isChanged />
          <TextField name='website' label='Website (optional)' isChanged />
          <div className='flex justify-center pt-6'>
            <Snackbar
              open={justSubmitted}
              message='Profile updated!'
              onClose={() => setJustSubmitted(false)}
            />
          </div>

          <div className='flex justify-end pt-4'>
            <button
              title='Commit these changes to your profile'
              type='submit'
              disabled={(dirty && !isValid) || isSubmitting}
              className='btn btn-primary w-40'
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Form>)}
      </Formik>

    </div>
  )
}
