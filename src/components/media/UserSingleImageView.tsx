export {}
// import { Dictionary } from 'underscore'
// import { ReactElement } from 'react'

// import { TinyProfile } from '../users/PublicProfile'
// import { SingleViewer } from './slideshow/SlideViewer'
// import MoreFromThisUser from './MoreFromThisUser'
// import { MediaWithTags, IUserProfile } from '../../js/types'
// import { WithPermission } from '../../js/types/User'

// export interface UserSingleImageViewProps {
//   uid: string
//   featureMedia? MediaWithTags
//   mostRecentList: MediaType[]
//   mostRecentTagMap: Dictionary<HybridMediaTag[]>
//   userProfile: IUserProfile
//   auth: WithPermission
//   loaded: boolean
// }

// export default function UserSingleImageView ({ uid, auth, featureMedia, featureTags, mostRecentList, mostRecentTagMap, userProfile, loaded }: UserSingleImageViewProps): ReactElement | null {
//   return (
//     <>
//       <div className='max-w-screen-2xl flex flex-col lg:flex-row items-stretch justify-center border rounded-md overflow-hidden drop-shadow-sm'>
//         <SingleViewer
//           loaded={loaded}
//           media={featureMedia}
//           tagList={featureTags}
//           userinfo={<TinyProfile userProfile={userProfile} />}
//           auth={auth}
//           keyboardTip={false}
//         />
//       </div>
//       <MoreFromThisUser loaded={loaded} uid={uid} mediaList={mostRecentList} tagMap={mostRecentTagMap} />
//     </>
//   )
// }
