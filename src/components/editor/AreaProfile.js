import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import TextField from "../ui/TextField";

const AreaProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Too short!")
    .max(150, "Too Long!")
    .required("Required"),
});

const AreaProfile = ({ frontmatter, formikRef }) => {
  let initialValues = {
    name: "",
  };

  if (frontmatter) {
    const { area_name } = frontmatter;
    initialValues = {
      name: area_name,
    };
  }

  return (
    <div className="editor-profile-container">
      <div className="editor-profile-header">
        Profile
      </div>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={AreaProfileSchema}
      >
        <Form className="divide-y divide-gray-200 max-w-full px-4">
          <TextField name="name" label="Area name" />
        </Form>
      </Formik>
    </div>
  );
};

export default AreaProfile;
