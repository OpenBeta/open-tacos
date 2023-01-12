import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'

import { AreaMetadataType, AreaUpdatableFieldsType } from '../../../js/types'
import { RadioGroup } from '../../ui/form'

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
    labelTips={['Like a folder an area may only contain other smaller areas', 'A crag is where you add rope climbing routes (sport, trad, ice).', 'A boulder may only have boulder problems.']}
  />)

export const ExplainAreaTypeLockTooltip = ({ canEdit }: { canEdit: boolean }): JSX.Element | null =>
  (
    canEdit
      ? null
      : (
        <div
          className='tooltip tooltip-left tooltip-info drop-shadow-lg'
          data-tip='Selection becomes read-only when the area contains subareas or is a crag/boulder.'
        >
          <QuestionMarkCircleIcon className='text-info w-5 h-5' />
        </div>)
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
