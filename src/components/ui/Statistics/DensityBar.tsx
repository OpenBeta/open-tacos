const DensityBar = ({ level, max }: {level: number, max: number}): JSX.Element => {
  return (
    <div className='w-2 flex flex-col-reverse justify-end grow-0 space-y-0.5 space-y-reverse'>
      {
    [...Array(max)].map(
      (_, i) =>
        <span key={i} className={`h-2 w-2.5 ${i > level ? 'bg-gray-300' : 'bg-slate-900'}`} />)
}
    </div>
  )
}

export default DensityBar
