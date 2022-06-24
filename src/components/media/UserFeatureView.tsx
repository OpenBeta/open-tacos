import { TinyProfile } from '../../components/users/PublicProfile'
import { SingleViewer } from '../../components/media/slideshow/SlideViewer'
import MoreFromThisUser from '../../components/media/MoreFromThisUser'
import { MediaType, MediaTagWithClimb, IUserProfile } from '../../js/types'
import { WithPermission } from '../../js/types/User'
import { ReactElement } from 'react'

interface UserFeatureViewProps {
  uid: string
  featureMedia: MediaType | null
  tagList: MediaTagWithClimb[]
  mostRecentList: MediaType[]
  userProfile: IUserProfile
  auth: WithPermission
  loaded: boolean
}

export default function UserFeatureView ({ uid, auth, featureMedia, mostRecentList, tagList, userProfile, loaded }: UserFeatureViewProps): ReactElement | null {
  console.log('#loading single image view')
  // if (featureMedia == null) return null
  return (
    <>
      <div className='max-w-screen-xl flex flex-col lg:flex-row items-stretch justify-center border rounded-md overflow-hidden drop-shadow-sm'>
        <SingleViewer
          loaded={loaded}
          media={featureMedia}
          tagList={tagList}
          userinfo={<TinyProfile userProfile={userProfile} />}
          auth={auth}
        />
      </div>
      <MoreFromThisUser loaded={loaded} uid={uid} mediaList={mostRecentList} />
    </>
  )
}
