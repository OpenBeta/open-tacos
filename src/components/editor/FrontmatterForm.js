import React from "react";
import { Formik, Form, Field } from "formik";

const FrontmatterForm = ({ frontmatter }) => {
  console.log("# frontmatter ", frontmatter);
  const { route_name, yds, fa, safety } = frontmatter;

  const initialValues = {
    name: route_name,
    fa: fa,
    grade: yds,
    type: "",
    safety,
  };

  console.log(initialValues);

  const onSubmit = (values, actions) => {
    console.log(JSON.stringify(values, null, 2));
    actions.setSubmitting(false);
  };

  return (
    <div className="w-full border-gray-300 border rounded-lg p-8 ">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, handleChange, handleBlur, isSubmitting }) => (
          <Form className="divide-y divide-gray-200 max-w-full">
            <TextField name="name" label="Name" />
            <TextField name="fa" label="FA" />

            <div className="edit-form-row">
              <span className="font-semibold md:w-36">Type</span>
              <div className="flex gap-x-2">
                <RadioButton
                  id="1"
                  value="boulder"
                  groupName="type"
                  label="Bouldering"
                />
                <RadioButton
                  id="2"
                  value="sport"
                  groupName="type"
                  label="Sport"
                />
                <RadioButton
                  id="3"
                  value="trad"
                  groupName="type"
                  label="Trad"
                />
                <RadioButton id="4" value="tr" groupName="type" label="TR" />
                <RadioButton id="5" value="ice" groupName="type" label="Ice" />
                <RadioButton
                  id="6"
                  value="alpine"
                  groupName="type"
                  label="Alpine"
                />
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
                <RadioButton id="4" value="X" groupName="safety" label="X" />

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
        className="pill flex flex-col border-2 border-gray-200 cursor-pointer"
        htmlFor={idStr}
      >
        <span className="text-xs font-semibold uppercase">{label}</span>
      </label>
    </div>
  );
};

export default FrontmatterForm;
