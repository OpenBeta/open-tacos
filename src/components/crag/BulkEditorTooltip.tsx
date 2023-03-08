import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Tooltip from '../ui/Tooltip'

export const BulkEditorTooltip: React.FC = () => {
  return (
    <Tooltip content={
      <ul className='px-4 py-2 list-disc space-y-2'>
        <li>
          <strong>Create new climbs</strong><br /> Enter one climb per line
        </li>
        <li>
          <strong>Delete climbs</strong><br />Delete the entire line
        </li>
        <li>
          <strong>Change left-to-right order</strong><br />Copy-n-paste lines
        </li>
        <li>
          <strong>Climb ID</strong><br />Don't edit the strange text: <i>646756eb-7552-4715-8e17-d4c1073b5d51</i>
        </li>
        <li>
          Remember to press <strong>Save</strong> when done 😀
        </li>
      </ul>
      }
    >
      <div className='flex items-center gap-2 text-xs'><span className='text-info link-dotted'>Help</span><QuestionMarkCircleIcon className='text-info w-5 h-5' /></div>
    </Tooltip>
  )
}

export const BulkEditorTipSheet: React.FC = () => {
  return (
    <div className='collapse collapse-plus'>
      <input type='checkbox' className='hover:underline' />
      <div className='collapse-title hover:underline'>
        Tell me more about the format
      </div>
      <div className='collapse-content'>
        <div className='alert alert-success shadow-md'>
          <div className='block'>
            Syntax:
            <div className='ml-4 text-base font-semibold'>&lt;Climb unique ID&gt; | &lt;Climb name&gt; | &lt;Grade&gt; | &lt;Discipline codes&gt;</div>
            <div className='mt-2 ml-4'>* Discipline codes: <b>B T S A TR</b> (Bouldering Trad Sport Aid Top-rope)</div>

            <div className='mt-6'>
              Example:<br />
              <code className='ml-4 font-semibold'>e6f9ba15-27e8-5150-9709-14c5a70502a1 | Chain Reaction | 5.12c | S</code>
            </div>

            <div className='mt-6'>
              <div>To add new climbs simply enter one climb per line:</div>
              <code className='pl-4 font-semibold'>Biographie | 9a+ | S<br /></code>
              <code className='pl-4 font-semibold'>La Chose | 7c+ | S</code>
              <div className='mt-4'><b>Pro tip</b>: Climb IDs are not required when adding new climbs.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
