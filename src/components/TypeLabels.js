import React from 'react'
// import "./styles.css";

const Chip = (props) => (
  <span {...props} className='chip'>
    {props.children}
  </span>
)
const _IconMap = {
  sport: <Chip style={{ backgroundColor: '#c5dedd' }}>Sport</Chip>,
  trad: <Chip style={{ backgroundColor: '#ff9b85' }}>Trad</Chip>,
  tr: <Chip style={{ backgroundColor: '#fff1e6' }}>TR</Chip>,
  boulder: <Chip style={{ backgroundColor: '#ffee93' }}>Boulder</Chip>,
  aid: <Chip style={{ backgroundColor: '#fde2e4' }}>Aid</Chip>
}

export const LabelMap = ({ types }) => {
  return (
    <div>
      {Object.keys(types).reduce((accumulator, key, idx) => {
        if (types[key] && _IconMap[key]) {
          // const Icon = _IconMap[key];
          accumulator.push(<span key={idx}>{_IconMap[key]}</span>)
        }
        return accumulator
      }, [])}
    </div>
  )
}
