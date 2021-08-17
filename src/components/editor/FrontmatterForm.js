import React from "react";
import { Formik, Form, Field } from "formik";
import XCircleIcon from "../../assets/icons/xcircle.svg";

const ROPE_CLIMB_TYPE_DEFAULTS = {
  boulder: false,
  trad: false,
  sport: false,
  ice: false,
  tr: false,
  alpine: false,
};

const FrontmatterForm = ({ frontmatter }) => {
  console.log("# frontmatter ", frontmatter);
  const { route_name, yds, fa, safety, type } = frontmatter;

  const initialValues = {
    name: route_name,
    fa: fa,
    grade: yds,
    type: { ...ROPE_CLIMB_TYPE_DEFAULTS, ...type },
    safety,
  };

  console.log(initialValues);

  const onSubmit = (values, actions) => {
    console.log(JSON.stringify(values, null, 2));
    actions.setSubmitting(false);
  };

  return (
    <div className="w-full border-gray-300 border rounded-lg p-8 ">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        handleChange={(e) => console.log(e)}
      >
        {({ values, handleChange, handleBlur, isSubmitting }) => (
          <Form className="divide-y divide-gray-200 max-w-full">
            <TextField name="name" label="Name" />
            <TextField name="fa" label="FA" />

            <div className="edit-form-row">
              <span className="font-semibold md:w-36">Type</span>
              <div className="flex flex-wrap gap-x-4 gap-y-4">
                <Checkbox name="type.boulder" label="Bouldering" />
                <Checkbox name="type.sport" label="Sport" />
                <Checkbox name="type.trad" label="Trad" />
                <Checkbox name="type.tr" label="Tope rope" />
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
                <RadioButton id="2" value="PG" groupName="safety" label="PG" />
                <RadioButton
                  id="3"
                  value="PG13"
                  groupName="safety"
                  label="PG 13"
                />
                <RadioButton id="4" value="X" groupName="safety" label="&nbsp;X&nbsp;" />

                {/* {formik.errors.password && touched.password && errors.password} */}
              </div>
            </div>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const TextField = ({ name, label }) => (
  <div className="edit-form-row ">
    <label className="font-semibold md:w-36" htmlFor={name}>
      {label}
    </label>
    <Field id={name} className="edit-input" type="text" name={name} />
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

const Checkbox = ({ name, value, label }) => {
  return (
    <div>
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
                <input
                  type="checkbox"
                  className="opacity-0 w-1 h-1"
                  checked={field.value}
                  onChange={() => form.setFieldValue(name, !field.value, false)}
                />
                <span className="text-sm font-base uppercase">{label}</span>
                {
                  <XCircleIcon
                    className={`ml-2  text-gray-600 ${field.value ? "" : "opacity-0"}`}
                  />
                }
              </label>
            </>
          );
        }}
      </Field>
    </div>
  );
};

export default FrontmatterForm;
