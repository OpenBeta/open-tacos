import React from "react";

function LinkToGithub ({link, docType}) {
  return (
    <div className="mt-5 border-t-2 pt-5">
      Caught a mistake or want to contribute to the {docType ? docType :'documentation'}? 
      <a target="_blank" rel="noopener noreferrer" href={link}>
        <span
          className="ml-0.5 hover:underline cursor-pointer hover:text-purple-900 text-purple-600"
        >
          Edit on GitHub!
        </span>
      </a>
    </div>
  );
}

export default LinkToGithub;