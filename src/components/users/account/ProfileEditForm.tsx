import { ReactElement, useCallback, useState, useLayoutEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { getUserProfile, updateUserProfile } from '../../../js/auth/CurrentUserClient'
import TextField from '../../ui/TextField'
import { IWritableUserMetadata } from '../../../js/types/User'
import { checkWebsiteUrl } from '../../../js/utils'
import { revalidateUserHomePage } from '../../../js/stores/media'
import { toast } from 'react-toastify'

const UserProfileSchema = Yup.object().shape({
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
      toast.success('Profile Updated')
      // Also trigger a page rebuild
      void revalidateUserHomePage(profile.nick)
    } else {
      // profile did not update for some reason
      toast.error('Update Failed')
      console.error('Profile object was supposed to not be null!')
    }
  }, [])

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
          <TextField name='name' label='Display Name' />
          <TextField name='bio' label='Bio' multiline rows={3} spellcheck />
          <TextField name='website' label='Website (optional)' />

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
