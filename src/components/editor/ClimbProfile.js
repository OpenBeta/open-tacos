import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import TextField from '../ui/TextField'
import RadioButton from '../ui/RadioButton'
import CheckBox from '../ui/CheckBox'

const ROPE_CLIMB_TYPE_DEFAULTS = {
  boulder: false,
  trad: false,
  sport: false,
  aid: false,
  ice: false,
  tr: false,
  alpine: false
}

const ClimbProfileSchema = Yup.object().shape({
  route_name: Yup.string()
    .min(3, 'Too short!')
    .max(150, 'Too Long!')
    .required('Required'),
  fa: Yup.string()
    .min(3, 'Too short!')
    .max(150, 'Too Long!')
    .required('Required'),
  yds: Yup.string() // TODO:  add real YDS validator
    .min(3, 'Too short!')
    .max(20, 'Too Long!')
    .required('Required')
})

const ClimbProfile = ({ frontmatter, formikRef }) => {
  let initialValues = {
    route_name: '',
    fa: '',
    yds: '',
    type: { ...ROPE_CLIMB_TYPE_DEFAULTS },
    safety: ''
  }

  if (frontmatter) {
    const { route_name: routeName, yds, fa, safety, type, metadata } = frontmatter
    initialValues = {
      route_name: routeName,
      fa: fa,
      yds: yds,
      type: { ...ROPE_CLIMB_TYPE_DEFAULTS, ...type },
      safety,
      metadata // while we're not editing metadata yet we still need give it to Formik so that it can be retrieved later onSubmit
    }
  }

  return (
    <div className='editor-profile-container'>
      <div className='editor-profile-header'>Profile</div>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        enableReinitialize
        validationSchema={ClimbProfileSchema}
        validateOnMount
      >
        <Form className='divide-y divide-gray-200 max-w-full px-4'>
          <TextField name='route_name' label='Name' />
          <TextField name='fa' label='FA' />

          <div className='edit-form-row'>
            <span className='font-semibold md:w-36'>Type</span>
            <div className='flex flex-wrap gap-x-4 gap-y-4'>
              <CheckBox name='type.boulder' label='Bouldering' />
              <CheckBox name='type.sport' label='Sport' />
              <CheckBox name='type.trad' label='Trad' />
              <CheckBox name='type.tr' label='Top rope' />
              <CheckBox name='type.aid' label='Aid' />
              <CheckBox name='type.ice' label='Ice' />
              <CheckBox name='type.alpine' label='Alpine' />
            </div>
          </div>

          <TextField name='yds' label='Grade' />

          <div className='edit-form-row'>
            <span className='font-semibold md:w-36'>Safety</span>

            <div className='flex gap-x-4'>
              <RadioButton
                id='1'
                value=''
                groupName='safety'
                label='Unspecified'
              />
              <RadioButton id='2' value='PG' groupName='safety' label='PG' />
              <RadioButton
                id='3'
                value='PG13'
                groupName='safety'
                label='PG-13'
              />
              <RadioButton
                id='5'
                value='R'
                groupName='safety'
                label='&nbsp;R&nbsp;'
              />
              <RadioButton
                id='6'
                value='X'
                groupName='safety'
                label='&nbsp;X&nbsp;'
              />
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  )
}

export default ClimbProfile
