import React from "react";

function BarPercent ({percents=[], colors=[], styles=""}) {
  console.log(styles);
  return (
    <div>
      <div className={`h-2 w-100 flex ${styles}`}>
        {
          percents.map((percent, index)=> {
            const color = colors[index];
            const moreThanOnePercent = percents.length > 1;

            // Border logic
            // ( ) single
            // ( ] [ ) double
            // ( ] [ ] [ ) triple
            // ( ] [ ] [ ] [ ) quadruple
            let borderRounding = 'mr-1';
            if (moreThanOnePercent && index === 0 ) 
              borderRounding = 'rounded-l mr-1'
            if (moreThanOnePercent && index === percents.length - 1) 
              borderRounding = 'rounded-r'
            if (!moreThanOnePercent)
              borderRounding = 'rounded-lg'

            return (
              <span
                key={index}
                className={`${borderRounding} h-2 bg-${color} inline-block`}
                style={{ width: `${percent}%` }}
              ></span>
            );
          })
        }
      </div>
    </div>
  )
}

export default BarPercent;