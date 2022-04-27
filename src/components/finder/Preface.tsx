import DownloadLink from './Download'

export const Preface = ({ isLoading, total, searchText }: { isLoading: boolean, total: number, searchText: string }): JSX.Element => {
  return (
    <section className='mt-6 px-2 py-3 text-sm border border-b-2 border-slate-600 rounded-md flex items-center justify-between'>
      <div>
        <div>
          {isLoading
            ? `Loading crags in ${searchText}...`
            : `${humanizeNumber(total)} crags near ${searchText}.`}
        </div>
        <div>Consult local climbing community and guidebooks before you visit.</div>
      </div>
      <DownloadLink />
    </section>
  )
}

export const humanizeNumber = (n: number): string => n > 300 ? '300+' : n.toString()
