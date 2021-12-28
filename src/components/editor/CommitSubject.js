import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'

import TextField from '../ui/TextField'

const CommitSubjectSchema = Yup.object().shape({
  message: Yup.string()
    .min(10, 'Too short!')
    .max(50, 'Too Long!')
    .required('Required')
})

const initialValues = {
  message: ''
}

function CommitSubject ({ formikRef }) {
  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={CommitSubjectSchema}
      validateOnMount
    >
      <TextField name='message' label='Change summary' />
    </Formik>
  )
}
export default CommitSubject
