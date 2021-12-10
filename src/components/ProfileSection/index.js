import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProfileSection extends Component {
  state = {
    profileDetails: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  updatedProfile = data => {
    const newData = {
      name: data.name,
      profileImageUrl: data.profile_image_url,
      shortBio: data.short_bio,
    }

    return newData
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const profileData = data.profile_details
      const updatedProfileData = this.updatedProfile(profileData)

      this.setState({
        profileDetails: updatedProfileData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-section-container">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-image"
        />
        <h1 className="name">{profileDetails.name}</h1>
        <p className="bio-data">{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <button type="button" className="retry-button">
      Retry
    </button>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default ProfileSection
