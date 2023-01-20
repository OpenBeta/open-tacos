import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { AreaMetadataType, AreaUpdatableFieldsType } from '../../../js/types'
import { RadioGroup } from '../../ui/form'
import Tooltip from '../../ui/Tooltip'

export type AreaTypeFormProp = 'crag' | 'area' | 'boulder'

/**
 * A react-hook-form radio button group for changing area type (area container vs crag vs boulder)
 */
export const AreaDesignationRadioGroup = ({ name = 'areaType', canEdit }: { name?: string, canEdit: boolean }): JSX.Element => (
  <RadioGroup
    groupLabel='Area designation'
    groupLabelAlt={<ExplainAreaTypeLockTooltip canEdit={canEdit} />}
    name={name}
    disabled={!canEdit}
    labels={[
      'Area',
      'Crag (sport, trad, ice)',
      'Boulder']}
    values={['area', 'crag', 'boulder']}
    labelTips={['Group other areas.', 'List rope climbing routes.', 'List boulder problems.']}
  />)

export const ExplainAreaTypeLockTooltip = ({ canEdit }: { canEdit: boolean }): JSX.Element | null =>
  (
    canEdit
      ? null
      : (
        <Tooltip content='Read only when the area has climbs or contains other areas'>
          <QuestionMarkCircleIcon className='text-info w-5 h-5' />
        </Tooltip>
        )
  )

/**
 * Convert area leaf and boulder DB attributes to form prop.
 */
export const areaDesignationToForm = ({ isBoulder, leaf }: Pick<AreaMetadataType, 'isBoulder' | 'leaf'>): AreaTypeFormProp => {
  if (isBoulder) return 'boulder'
  if (leaf) return 'crag'
  return 'area'
}

/**
 * The converse of `areaDesignationToForm()`, convert form prop to DB attributes.
 */
export const areaDesignationToDb = (attr: AreaTypeFormProp): Pick<AreaUpdatableFieldsType, 'isBoulder' | 'isLeaf'> => {
  switch (attr) {
    case 'boulder':
      return {
        isLeaf: true,
        isBoulder: true
      }
    case 'crag':
      return {
        isLeaf: true,
        isBoulder: false
      }
    default:
      return {
        isLeaf: false,
        isBoulder: false
      }
  }
}
