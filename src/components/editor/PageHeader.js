import React from "react"
import { navigate } from "gatsby";

const PageHeader = ({ onSubmit, editType }) => {
    return (
      <div className="flex justify-between mb-8">
        <div className="">
          <div className="text-lg font-bold">
            Edit {editType !== "unknown" ? editType : ""}
          </div>
          <div className="text-gray-700">You are in edit mode. Changes will not be saved until submit.</div>
        </div>
        <div className="flex flex-col items-end justify-between gap-2">
          <div>&nbsp;{/*future buttons, submenu*/}</div>
          <div>
            <button
              className="btn btn-link btn-default mr-4"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={onSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

export default PageHeader