import React from "react";
import { Field } from "formik";
import XCircleIcon from "../../assets/icons/xcircle.svg";
import PlusSmalllIcon from "../../assets/icons/plus-sm.svg";

/**
 * Formik pill style checkbox
 * @param name key name for data
 * @param label text label
 */
const CheckBox = ({ name, label }) => {
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
export default CheckBox;
