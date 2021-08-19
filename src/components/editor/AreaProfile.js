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
    <div className="w-full 2xl:w-1/3 flex-shrink min-h-0 border-gray-300 border rounded-lg shadow-sm bg-white">
      <div className="border-b py-4 px-4 h-14 bg-gray-100 text-base align-middle rounded-t-lg">
        Basic information
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
