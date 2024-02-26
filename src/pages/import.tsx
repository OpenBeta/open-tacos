//'use client'
import Ajv from "ajv"
import React, { useState, useRef, useCallback, useEffect } from "react"
import { toast } from 'react-toastify'
import Layout from '../components/layout'
import schema from "../../public/bulk-import/schema.json"
import { Lightbulb } from "@phosphor-icons/react"
const addFormats = require("ajv-formats")
const betterAjvErrors = require("better-ajv-errors").default
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { gql } from '@apollo/client'
import { graphqlClient } from '../js/graphql/Client'
import { useSession } from 'next-auth/react'

function FileUploadAndValidationClientComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState([])
  const [isValidationSuccessful, setIsValidationSuccessful] = useState(false)
  const [hasEncounteredDbUploadError, setEncounteredDbUploadError] = useState(false)
  const [parsedJSON, setParsedJSON] = useState<object | null>(null)

  const handleValidationErrors = (parsedJSON: object) => {
    try {
      const ajv = new Ajv({ allErrors: true, verbose: true })
      addFormats(ajv)
      const compiledSchema = ajv.compile(schema)
      const validate = compiledSchema(parsedJSON)
      if (!validate) {
        const betterErrors = betterAjvErrors(schema, parsedJSON, compiledSchema.errors, { format: 'js' })
        console.log(betterErrors)
        setValidationErrors(betterErrors)
        toast.error(
          betterErrors.length > 0
            ? "Error: Schema validation errors found."
            : "Error: Schema validation failed, but no errors were provided."
        )
      } else {
        toast.success(
          "JSON file and schema successfully validated. ➤ Proceed to database upload."
        )
        setValidationErrors([])
        setIsValidationSuccessful(true)
      }
    } catch (error) {
      console.error("Error during validation:", error)
      toast.error(
        "Error: An unexpected error occurred during validation. See browser console log for more details."
      )
    }
  }
  function safelyParseJSON(json: string) {
    try {
      return JSON.parse(json)
    } catch (e) {
      toast.error(`Error: Could not parse JSON file. ${e}`)
      return null
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    toast.dismiss()
    setValidationErrors([])
    setIsValidationSuccessful(false)
    setEncounteredDbUploadError(false)

    const file = event.target.files ? event.target.files[0] : null

    if (file) {
      const reader = new FileReader()

      reader.onload = (event) => {
        const file = event.target?.result
        if (typeof file === "string") {
          const parsedJSON = safelyParseJSON(file)
          if (parsedJSON) {
            setParsedJSON(parsedJSON)
            handleValidationErrors(parsedJSON)
          } else {
            toast.error("Error: Not a valid JSON file")
          }
        }
      }
      reader.readAsText(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <><div className="alert mt-2 flex flex-col gap-2 items-start">
      <div className="flex flex-row ">
        <h2>File Upload</h2>
      </div>


      <div className="flex flex-col items-center">
        <input
          accept="application/json"
          style={{ display: "none" }}
          id="contained-button-file"
          type="file"
          onChange={(event) => {
            handleFileSelect(event)
            if (event.target.files && event.target.files[0]) {
              setFileName(event.target.files[0].name)
            }
          }}
          ref={fileInputRef} />


        <label htmlFor="contained-button-file">
          <button
            className='btn btn-lg btn-neutral'
            onClick={handleButtonClick}
          >
            📁 Select JSON File to Upload
          </button>
        </label>
      </div>
      <p>{fileName ? `Selected file: ${fileName}` : "No file selected."}</p>


    </div>
      {validationErrors.length > 0 && (
        <div className="alert mt-2">
          <div>
            <h2>Validation Errors</h2>
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
      )}

      <UploadToDBComponent parsedJsonData={parsedJSON} isValidationSuccessful={isValidationSuccessful} hasEncounteredDbUploadError={hasEncounteredDbUploadError} setEncounteredDbUploadError={setEncounteredDbUploadError} />

    </>
  )
}

interface UploadToDBProps {
  parsedJsonData: object | null
  isValidationSuccessful: boolean
  hasEncounteredDbUploadError: boolean
  setEncounteredDbUploadError: (error: boolean) => void
}

const UploadToDBComponent: React.FC<UploadToDBProps> = ({
  parsedJsonData,
  isValidationSuccessful,
  hasEncounteredDbUploadError,
  setEncounteredDbUploadError,
}) => {
  const { data: sessionData } = useSession()
  const accessToken = sessionData?.accessToken ?? ''
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (hasEncounteredDbUploadError) {
      setEncounteredDbUploadError(false)
    }
  }, [parsedJsonData, setEncounteredDbUploadError])

  const handleUpload = useCallback(async () => {
    if (!isValidationSuccessful || !parsedJsonData) {
      toast.error("JSON schema validation unsuccessful. Fix the errors and try again.")
      return
    }

    setLoading(true)
    try {
      const bulkImportMutation = {
        mutation: {
          bulkImportAreas: {
            __args: {
              input: parsedJsonData,
            },
            addedAreas: {
              id: true,
              uuid: true,
              area_name: true,
              areaName: true,
            },
            updatedAreas: {
              id: true,
              uuid: true,
              area_name: true,
              areaName: true,
            },
            addedOrUpdatedClimbs: {
              id: true,
              uuid: true,
              name: true,
            }
          }
        }
      }

      const generatedGraphqlMutation = jsonToGraphQLQuery(bulkImportMutation, { pretty: true })
      console.log('generatedGraphqlMutation:', generatedGraphqlMutation)

      const { data } = await graphqlClient.mutate({
        mutation: gql`${generatedGraphqlMutation}`,
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      })

      console.log("Sending mutation to the database...")
      if (data) {
        const updatedCountAreas = data.bulkImportAreas.addedAreas.length + data.bulkImportAreas.updatedAreas.length + data.bulkImportAreas.addedOrUpdatedClimbs.length
        const updatedCountClimbs = data.bulkImportAreas.addedOrUpdatedClimbs.length

        console.log("Detailed database update log:", data)
        toast.success(`Successfully created/updated ${updatedCountAreas} database items. See console log for more details.`)
        setEncounteredDbUploadError(false)
      }
    } catch (error) {
      console.error("Error uploading to DB:", error)
      toast.error("Error uploading data to the database. See console log for more details.")
      setEncounteredDbUploadError(true)
    } finally {
      setLoading(false)
    }
  }, [parsedJsonData, isValidationSuccessful, setEncounteredDbUploadError, accessToken])

  return (
    <>
      <div className='flex justify-center m-8'>
        <button
          className='btn btn-primary btn-wide shadow-lg hover:scale-110 duration-300 bg-accent text-accent-content btn-lg'
          onClick={handleUpload}
          disabled={!isValidationSuccessful || loading || hasEncounteredDbUploadError}
        >
          {loading ? "Uploading..." : "Upload to Database"}
        </button>
      </div>
    </>
  )
}


const BulkImport = (): JSX.Element => {
  return (
    <Layout contentContainerClass='content-default' showFilterBar={false}>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          Bulk Data Import
        </h1>
        <div role='alert' className='alert alert-info flex flex-row items-start gap-2'>
          <Lightbulb size={24} />
          <div className='text-sm'>
            <ul className="list-disc pl-5">
              <li>Allows for adding or changing large amounts of data at once.</li>
              <li>Uses a JSON schema to validate your upload's data structure before uploading</li>
              <li>See this <a href="/bulk-import/README.md" target="_blank" rel="noopener noreferrer" className="link">README.md</a> for example upload files, schema, and detailed instructions.</li>
              <li>Note: OpenBeta’s route database is licensed as CC-BY-SA 4.0.</li>
              <li>Need help? Find us on <a href="https://discord.gg/a6vuuTQxS8" className="link">Discord</a>.</li>
            </ul>
          </div>
        </div>
        <div className="my-8">
          <FileUploadAndValidationClientComponent />
        </div>

      </div>
    </Layout>
  )
}

export default BulkImport