import React from "react";
import { Field } from "formik";

/**
 * Responsive Formik-textfield
 * @param name key name for data
 * @param label text label
 */
const TextField = ({ name, label }) => (
  <div className="edit-form-row ">
    <label className="font-semibold md:w-24" htmlFor={name}>
      {label}
    </label>
    <Field id={name} name={name}>
      {({ field, meta }) => (
        <div className="w-full">
          <input className="w-full edit-input text-lg" type="text" {...field} />
          <div className="h-3 text-sm pt-1 px-3 text-gray-600">{meta && meta.touched && meta.error ? meta.error : ""}</div>
        </div>
      )}
    </Field>
  </div>
);
export default TextField;
