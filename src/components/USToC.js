import React from "react";
import {Link} from "gatsby"

function USToC() {
  return (
    <section>
      <h4 className="text-xl font-medium my-4">Explore by State</h4>
      <div className="flex gap-x-4">
        <div className="text-gray-400">California</div>
        <div>
          <Link to="/areas/2c278fe6-c679-4aef-a6e1-085d9d205bab/nevada">
            Nevada
          </Link>
        </div>
        <div>
          <Link to="/areas/e69f6a6f-ddb1-4460-89c6-024b110c89a7/oregon">
            Oregon
          </Link>
        </div>
        <div>
          <Link to="/areas/1b50d4f9-d6e2-4743-a9aa-97dd102afb9e/washington">
            Washington
          </Link>
        </div>
      </div>
    </section>
  );
}

export default USToC;
