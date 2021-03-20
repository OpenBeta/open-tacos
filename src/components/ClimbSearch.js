import React, { useState } from "react";
import Autosuggest from "react-autosuggest";

import SuggestionEntry from "./SuggestionEntry";
import { IconButton } from "../components/ui/Button";
import Toggle from "../components/ui/Toggle";

import XIcon from "../assets/icons/xcircle.svg";
// import * as theme from "../styles/autosuggest.css";
import {
  search_climbs_by_name,
  search_climbs_by_fa,
} from "../openbeta-api-utils";

export default function ClimbSearch({ onClimbNameChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [name, setName] = useState("");
  const [fa, setFA] = useState(false);

  const getSuggestionValue = (suggestion) => suggestion && suggestion.name;

  //const getSuggestionFaValue = (suggestion) => suggestion && suggestion.fa;

  const renderSuggestion = (suggestion) => (
    <SuggestionEntry suggestion={suggestion} />
  );

  const onSuggestionsClearRequested = () => setSuggestions([]);
  const getSuggestionsFromBackend = async ({ value, reason }) => {
    if (reason === "input-focused") {
      return;
    }
    if (value && value.length < 3) {
      setSuggestions([]);
      return;
    }

    const rs = fa
      ? await search_climbs_by_fa(value)
      : await search_climbs_by_name(value);
    rs && setSuggestions(rs);
  };

  const onSuggestionSelected = (event, { suggestion }) =>
    onClimbNameChange && onClimbNameChange({ ...suggestion });


  const inputNameProps = {
    placeholder: fa ? "FA name" : "Climb name",
    value: name,
    //eslint-disable-next-line no-unused-vars
    onChange: (event, { newValue, method }) => {
      setName(newValue);
    },
  };

  return (
    // <>border-2 rounded-lg border-gray-300
    <div className="flex items-center">
      <div className="flex">
        <Autosuggest
          autofocus={true}
          suggestions={suggestions}
          onSuggestionsFetchRequested={getSuggestionsFromBackend}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          onSuggestionSelected={onSuggestionSelected}
          renderSuggestion={renderSuggestion}
          inputProps={inputNameProps}
        />
        {name !== "" && (
          <IconButton className="z-50" onClick={() => setName("")}>
            <XIcon className="text-gray-400 -ml-10" />
          </IconButton>
        )}
      </div>
      <Toggle onClick={() => setFA(!fa)} label="FA search" className="px-4" />
    </div>
  );
}
