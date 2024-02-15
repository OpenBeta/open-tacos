'use client'
import {
  Alert,
  Box,
  Button,
  Container,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Snackbar
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Ajv from "ajv";
import React, { useState } from "react";
import schema from "./schema/schema.json";
const addFormats = require("ajv-formats");
const betterAjvErrors = require("better-ajv-errors").default

function FileUploadClientComponent() {
  const [alertMessage, setAlertMessage] = useState("")
  const [validationErrors, setValidationErrors] = useState([])

  const handleValidationErrors = (rawJSON: object) => {
    try {
      const ajv = new Ajv({ allErrors: true, verbose: true, strict: false });
      addFormats(ajv);
      const compiledSchema = ajv.compile(schema);
      const validate = compiledSchema(rawJSON);
      if (!validate) {
        const betterErrors = betterAjvErrors(schema, rawJSON, compiledSchema.errors, {format: 'js'})
        console.log(betterErrors)
        setValidationErrors(betterErrors);
        setAlertMessage(
          betterErrors.length > 0
            ? "Error: Schema validation errors found."
            : "Error: Schema validation failed, but no errors were provided."
        );
      } else {
        setAlertMessage(
          "JSON file and schema successfully validated. 🎊 Proceed to database upload."
        );
        setValidationErrors([]);
      }
    } catch (error) {
      console.error("Error during validation:", error);
      setAlertMessage(
        "Error: An unexpected error occurred during validation. See browser console log for more details."
      );
    }
  };
  function safelyParseJSON(json: string) {
    try {
      return JSON.parse(json);
    } catch (e) {
      setAlertMessage(`Error: Could not parse JSON file. ${e}`);
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
            setAlertMessage("Error: Not a valid JSON file");
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 500 }}>
      <input
        accept="application/json"
        style={{ display: "none" }}
        id="contained-button-file"
        type="file"
        onChange={(event) => handleFileSelect(event)}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" component="span">
          Select File
        </Button>
      </label>
      {alertMessage && (
        <Snackbar open={!!alertMessage} autoHideDuration={6000}>
          <Alert severity={alertMessage.startsWith("Error") ? "error" : "info"}>
            {alertMessage}
          </Alert>
        </Snackbar>
      )}
      <Box mt={2}>
        <Typography variant="h6">Validation Errors</Typography>
        {validationErrors.map((error, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>{error['error']}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{JSON.stringify(error, null, 2)}</pre>
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}

export default function Home() {

  return (
    <Container maxWidth="md">
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Bulk Data Import V2
        </Typography>
        <Typography variant="subtitle1">
          Upload Area, Crag, Climbing Data.
        </Typography>
        <Box my={2}>
          <Alert severity="info">
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
          </Alert>
        </Box>

        <Box my={2}>
          <FileUploadClientComponent />
        </Box>

        <Box my={2}>
          <Button variant="contained" color="primary">
            Upload to Database
          </Button>
        </Box>
        <Typography variant="h6" gutterBottom>
          Database Response Log
        </Typography>
      </Box>
    </Container>
  );
}
