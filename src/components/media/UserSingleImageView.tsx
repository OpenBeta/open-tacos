import { Dictionary } from 'underscore'

import { TinyProfile } from '../users/PublicProfile'
import { SingleViewer } from './slideshow/SlideViewer'
import MoreFromThisUser from './MoreFromThisUser'
import { MediaType, MediaTagWithClimb, IUserProfile } from '../../js/types'
import { WithPermission } from '../../js/types/User'
import { ReactElement } from 'react'

export interface UserSingleImageViewProps {
  uid: string
  featureMedia: MediaType | null
  featureTags: MediaTagWithClimb[]
  mostRecentList: MediaType[]
  mostRecentTagMap: Dictionary<MediaTagWithClimb[]>

  userProfile: IUserProfile
  auth: WithPermission
  loaded: boolean
}

export default function UserSingleImageView ({ uid, auth, featureMedia, featureTags, mostRecentList, mostRecentTagMap, userProfile, loaded }: UserSingleImageViewProps): ReactElement | null {
  return (
    <>
      <div className='max-w-screen-2xl flex flex-col lg:flex-row items-stretch justify-center border rounded-md overflow-hidden drop-shadow-sm'>
        <SingleViewer
          loaded={loaded}
          media={featureMedia}
          tagList={featureTags}
          userinfo={<TinyProfile userProfile={userProfile} />}
          auth={auth}
        />
      </div>
      <MoreFromThisUser loaded={loaded} uid={uid} mediaList={mostRecentList} tagMap={mostRecentTagMap} />
    </>
  )
}
