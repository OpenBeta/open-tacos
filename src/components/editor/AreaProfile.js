import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import TextField from '../ui/TextField'

const AreaProfileSchema = Yup.object().shape({
  area_name: Yup.string()
    .min(3, 'Too short!')
    .max(150, 'Too Long!')
    .required('Required')
})

const AreaProfile = ({ frontmatter, formikRef }) => {
  let initialValues = {
    name: ''
  }

  if (frontmatter) {
    const { area_name: areaName, metadata } = frontmatter
    initialValues = {
      area_name: areaName,
      metadata // while we're not editing metadata yet we still need give it to Formik so that it can be retrieved later onSubmit
    }
  }

  return (
    <div className='editor-profile-container'>
      <div className='editor-profile-header'>
        Profile
      </div>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        enableReinitialize
        validationSchema={AreaProfileSchema}
      >
        <Form className='divide-y divide-gray-200 max-w-full px-4'>
          <TextField name='area_name' label='Area name' />
        </Form>
      </Formik>
    </div>
  )
}

export default AreaProfile
