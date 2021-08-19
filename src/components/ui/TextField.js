import React from "react";
import { Field } from "formik";

/**
 * Responsive Formik-textfield
 * @param name key name for data
 * @param label text label
 */
const TextField = ({ name, label }) => (
  <div className="edit-form-row ">
    <label className="font-semibold md:w-36" htmlFor={name}>
      {label}
    </label>
    <Field id={name} className="edit-input text-lg" type="text" name={name} />
    {/* {errors.email && touched.email && errors.email} */}
  </div>
);
export default TextField;
