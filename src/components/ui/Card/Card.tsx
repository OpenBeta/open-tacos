import React from 'react';

export interface CardProps {
  image: JSX.Element;
  header?: string | JSX.Element;
  imageActions?: JSX.Element | undefined;
  body: string | JSX.Element;
}

export default function Card({
  header,
  image,
  imageActions,
  body
}: CardProps): JSX.Element {
  return (
    <div className="card card-normal" style={{ minWidth: '200px', minHeight: '300px', backgroundColor: '#1E293B',  border: '2px solid black' }}>
      <figure className="overflow-hidden" style={{ height: '100%', marginBottom: '8px' }}>
        <div style={{ position: 'relative', width: '100%', paddingTop: '100%'}}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}>
            {image}
          </div>
        </div>
      </figure>
      <div className="px-2 sm:px-0 flex items-center justify-between" style={{ height: '20%', overflow: 'hidden', paddingLeft: '0.5rem', color: 'white' }}>
        {header}
      </div>
      <div style={{paddingLeft: "0.5rem"}}>
      {imageActions}
      <div className="card-body" style={{ height: '40%', overflow: 'hidden', color:'white' }}>
        {body}
      </div>
      </div>
    </div>
  );
}