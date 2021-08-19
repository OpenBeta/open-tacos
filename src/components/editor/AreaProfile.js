import React from "react";
import { Formik, Form } from "formik";

import TextField from "../ui/TextField";


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
      >
        <Form className="divide-y divide-gray-200 max-w-full px-4">
          <TextField name="name" label="Area name" />
          {/* {formik.errors.password && touched.password && errors.password} */}
        </Form>
      </Formik>
    </div>
  );
};

export default AreaProfile;
