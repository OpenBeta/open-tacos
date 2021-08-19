import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import XCircleIcon from "../../assets/icons/xcircle.svg";
import PlusSmalllIcon from "../../assets/icons/plus-sm.svg";

const ROPE_CLIMB_TYPE_DEFAULTS = {
  boulder: false,
  trad: false,
  sport: false,
  aid: false,
  ice: false,
  tr: false,
  alpine: false,
};

const FrontmatterForm = ({ frontmatter, formikRef }) => {
  let initialValues = {
    name: "",
    fa: "",
    grade: "",
    type: { ...ROPE_CLIMB_TYPE_DEFAULTS },
    safety: "",
  };

  if (frontmatter) {
    const { route_name, yds, fa, safety, type } = frontmatter;
    initialValues = {
      name: route_name,
      fa: fa,
      grade: yds,
      type: { ...ROPE_CLIMB_TYPE_DEFAULTS, ...type },
      safety,
    };
  }

  return (
    <div className="mt-8 w-full border-gray-300 border rounded-lg shadow-sm bg-white">
      <div className="border-b py-4 px-8 bg-gray-100 text-base align-middle rounded-lg">
        Basic information
      </div>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        enableReinitialize={true}
      >
        {({ values, handleBlur }) => {
          return (
            <Form className="divide-y divide-gray-200 max-w-full px-8">
              <TextField name="name" label="Name" />
              <TextField name="fa" label="FA" />

              <div className="edit-form-row">
                <span className="font-semibold md:w-36">Type</span>
                <div className="flex flex-wrap gap-x-4 gap-y-4">
                  <Checkbox name="type.boulder" label="Bouldering" />
                  <Checkbox name="type.sport" label="Sport" />
                  <Checkbox name="type.trad" label="Trad" />
                  <Checkbox name="type.tr" label="Top rope" />
                  <Checkbox name="type.aid" label="Aid" />
                  <Checkbox name="type.ice" label="Ice" />
                  <Checkbox name="type.alpine" label="Alpine" />
                </div>
              </div>
              <TextField name="grade" label="Grade" />

              <div className="edit-form-row">
                <span className="font-semibold md:w-36">Safety</span>

                <div className="flex gap-x-4">
                  <RadioButton
                    id="1"
                    value="G"
                    groupName="safety"
                    label="G / Unknown"
                  />
                  <RadioButton
                    id="2"
                    value="PG"
                    groupName="safety"
                    label="PG"
                  />
                  <RadioButton
                    id="3"
                    value="PG13"
                    groupName="safety"
                    label="PG 13"
                  />
                  <RadioButton
                    id="4"
                    value="X"
                    groupName="safety"
                    label="&nbsp;X&nbsp;"
                  />

                  {/* {formik.errors.password && touched.password && errors.password} */}
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

const TextField = ({ name, label }) => (
  <div className="edit-form-row ">
    <label className="font-semibold md:w-36" htmlFor={name}>
      {label}
    </label>
    <Field id={name} className="edit-input text-lg" type="text" name={name} />
    {/* {errors.email && touched.email && errors.email} */}
  </div>
);

const RadioButton = ({ id, groupName, value, label }) => {
  const idStr = `${groupName}${id}`;
  return (
    <div>
      <Field
        className="hidden"
        id={idStr}
        type="radio"
        name={groupName}
        value={value}
      />
      <label
        className="pill flex flex-col border border-gray-200 cursor-pointer"
        htmlFor={idStr}
      >
        <span className="text-sm font-semibold uppercase">{label}</span>
      </label>
    </div>
  );
};

const Checkbox = ({ name, label }) => {
  return (
    <Field name={name}>
      {({ field, form, meta }) => {
        return (
          <>
            <label
              className={`rounded-full py-1 pl-2 pr-1 flex items-center border border-gray-200 cursor-pointer ${
                field.value ? "bg-red-200" : ""
              }`}
              onClick={() => {
                form.setFieldValue(name, !field.value, false);
              }}
              htmlFor={name}
            >
              <input // this is for a11y -  TODO: find a pre-made component
                type="checkbox"
                className="opacity-0 w-1 h-1"
                checked={field.value}
                onChange={() => form.setFieldValue(name, !field.value, false)}
              />
              <span className="text-sm font-base uppercase mr-2">{label}</span>
              {field.value ? (
                <XCircleIcon className="text-gray-600" />
              ) : (
                <PlusSmalllIcon className="w-6 h-6 text-gray-200" />
              )}
            </label>
          </>
        );
      }}
    </Field>
  );
};

export default FrontmatterForm;
