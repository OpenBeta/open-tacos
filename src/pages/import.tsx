//'use client'
import Ajv from "ajv";
import React, { useState, useRef } from "react"; // Import useRef
import { toast } from 'react-toastify';
import Layout from '../components/layout';
import schema from "./schema.json";
const addFormats = require("ajv-formats");
const betterAjvErrors = require("better-ajv-errors").default

function FileUploadClientComponent() {
  const [validationErrors, setValidationErrors] = useState([])
  const fileInputRef = useRef<HTMLInputElement>(null); // Create a ref for the file input

  const handleValidationErrors = (rawJSON: object) => {
    try {
      const ajv = new Ajv({ allErrors: true, verbose: true });
      addFormats(ajv);
      const compiledSchema = ajv.compile(schema);
      const validate = compiledSchema(rawJSON);
      if (!validate) {
        const betterErrors = betterAjvErrors(schema, rawJSON, compiledSchema.errors, {format: 'js'})
        console.log(betterErrors)
        setValidationErrors(betterErrors);
        toast.error(
          betterErrors.length > 0
            ? "Error: Schema validation errors found."
            : "Error: Schema validation failed, but no errors were provided."
        );
      } else {
        toast.success(
          "JSON file and schema successfully validated. 🎊 Proceed to database upload."
        );
        setValidationErrors([]);
      }
    } catch (error) {
      console.error("Error during validation:", error);
      toast.error(
        "Error: An unexpected error occurred during validation. See browser console log for more details."
      );
    }
  };
  function safelyParseJSON(json: string) {
    try {
      return JSON.parse(json);
    } catch (e) {
      toast.error(`Error: Could not parse JSON file. ${e}`);
      return null;
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const file = event.target?.result;
        if (typeof file === "string") {
          const isValidJSON = safelyParseJSON(file);
          if (isValidJSON) {
            handleValidationErrors(isValidJSON);
          } else {
            toast.error("Error: Not a valid JSON file");
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // Function to trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ width: "100%", maxWidth: 500 }}>
      <input
        accept="application/json"
        style={{ display: "none" }}
        id="contained-button-file"
        type="file"
        onChange={(event) => handleFileSelect(event)}
        ref={fileInputRef} // Attach the ref to the file input
      />
      <label htmlFor="contained-button-file">
        <button
          className='btn btn-outline bg-accent btn-sm px-4 border-b-neutral border-b-2'
          onClick={handleButtonClick} // Add onClick handler to the button
        >
          Select JSON File to Upload
        </button>
      </label>
      <div>
        <h6>Validation Errors</h6>
        {validationErrors.map((error, index) => (
          <div key={index}>
            <div>
              <h6>{error['error']}</h6>
            </div>
            <div>
              <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{JSON.stringify(error, null, 2)}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const BulkImport = (): JSX.Element => {
  return (
    <Layout contentContainerClass='content-default' showFilterBar={false}>
      <div style={{ maxWidth: "md", width: "100%" }}>
        <h4 style={{ marginBottom: "16px" }}>
          Bulk Data Import V2
        </h4>
        <h6>
          Upload Area, Crag, Climbing Data.
        </h6>
        <div>
          <div>
            <ul>
              <li>- Allows for adding or changing large amounts of data at once.</li>
              <li>- Utilizes <a href="./schema/schema.json" target="_blank" rel="noopener noreferrer">JSON schema</a> to ensure correct data structure.</li>
              <li>* <a href="./schema/example-upload_add-areas-with-climbs.json" target="_blank" rel="noopener noreferrer">Example Upload: Add areas with climbs</a></li>
              <li>* <a href="./schema/example-upload_update-climbs" target="_blank" rel="noopener noreferrer">Example Upload: Update areas</a></li>
              <li>* <a href="./schema/example-upload_update-areas.json" target="_blank" rel="noopener noreferrer">Example Upload: Update climbs</a></li>
              <li>* For detailed instructions, refer to the <a href="./schema/README.md" target="_blank" rel="noopener noreferrer">README</a></li>
              <li>- Note: OpenBeta’s route database is licensed as CC-BY-SA 4.0.</li>
              <li>- Special permissions required (ask on <a href="https://discord.gg/a6vuuTQxS8">Discord</a>).</li>
            </ul>
          </div>
        </div>

        <div>
          <FileUploadClientComponent />
        </div>

        <div>
        <button className='btn btn-outline bg-accent btn-sm px-4 border-b-neutral border-b-2'>
            Upload to Database
          </button>
        </div>
        <h6>
          Database Response Log
        </h6>
      </div>
    </Layout>
  )
}

export default BulkImport