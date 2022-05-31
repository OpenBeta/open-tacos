import { ReactElement, useCallback, useState, useLayoutEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { getUserProfile, updateUserProfile } from '../../../js/auth/CurrentUserClient'
import TextField from '../../ui/TextField'
import { Button, ButtonVariant } from '../../ui/BaseButton'
import { IWritableUserMetadata } from '../../../js/types/User'

const UserProfileSchema = Yup.object().shape({
  nick: Yup.string()
    .min(2, 'Too short!')
    .max(50, 'Too Long!')
    .required('Required'),
  name: Yup.string()
    .max(40, 'Too Long!'),
  bio: Yup.string()
    .max(150, 'Maximum 150 characters.')
})

export default function ProfileEditForm (): ReactElement {
  const [profile, setProfile] = useState<IWritableUserMetadata>({
    name: '',
    nick: '',
    bio: ''
  })

  useLayoutEffect(() => {
    const asyncLoad = async (): Promise<void> => {
      const profile = await getUserProfile()
      if (profile != null) { setProfile(profile) }
    }
    void asyncLoad()
  }, [])
  const submitHandler = useCallback(async (newValues) => {
    await updateUserProfile(newValues)
  }, [])
  return (
    <Formik
      initialValues={profile}
      validationSchema={UserProfileSchema}
      validateOnMount
      onSubmit={submitHandler}
      enableReinitialize
    >{({ isValid, isSubmitting, dirty }) => (
      <Form>
        <TextField name='name' label='Name' />
        <TextField name='nick' label='User name' />
        <TextField name='bio' label='Bio' />

        <Button
          label='Save' type='submit' variant={ButtonVariant.SOLID_DEFAULT}
          disabled={!isValid || isSubmitting || !dirty}
        />
      </Form>)}

    </Formik>
  )
}
