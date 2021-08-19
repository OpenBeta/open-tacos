import React from "react";
import { Formik, Form } from "formik";

import TextField from "../ui/TextField";
import RadioButton from "../ui/RadioButton";
import CheckBox from "../ui/CheckBox";

const ROPE_CLIMB_TYPE_DEFAULTS = {
  boulder: false,
  trad: false,
  sport: false,
  aid: false,
  ice: false,
  tr: false,
  alpine: false,
};

const ClimbProfile = ({ frontmatter, formikRef }) => {
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
    <div className="w-full 2xl:w-1/3 border-gray-300 border rounded-lg shadow-sm bg-white">
      <div className="border-b py-4 px-4 h-14 bg-gray-100 text-base align-middle rounded-t-lg">
        Basic information
      </div>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        enableReinitialize={true}
      >
        <Form className="divide-y divide-gray-200 max-w-full px-4">
          <TextField name="name" label="Name" />
          <TextField name="fa" label="FA" />

          <div className="edit-form-row">
            <span className="font-semibold md:w-36">Type</span>
            <div className="flex flex-wrap gap-x-4 gap-y-4">
              <CheckBox name="type.boulder" label="Bouldering" />
              <CheckBox name="type.sport" label="Sport" />
              <CheckBox name="type.trad" label="Trad" />
              <CheckBox name="type.tr" label="Top rope" />
              <CheckBox name="type.aid" label="Aid" />
              <CheckBox name="type.ice" label="Ice" />
              <CheckBox name="type.alpine" label="Alpine" />
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
      </Formik>
    </div>
  );
};

export default ClimbProfile;
