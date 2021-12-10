import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobs: [],
    skills: [],
    lifeAtCompany: {},
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getUpdatedSkills = eachSkill => ({
    imageUrl: eachSkill.image_url,
    name: eachSkill.name,
  })

  getLifeAtCompany = data => ({
    description: data.description,
    imageUrl: data.imageUrl,
  })

  getUpdatedJobDetails = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    id: data.id,
    jobDescription: data.job_description,
    employmentType: data.employment_type,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const jobDetails = data.job_details
      const updatedJobDetails = this.getUpdatedJobDetails(jobDetails)
      const updatedSkills = jobDetails.skills.map(eachSkill =>
        this.getUpdatedSkills(eachSkill),
      )
      const updatedCompanyDetails = this.getLifeAtCompany(
        jobDetails.life_at_company,
      )
      const updatedSimilarJobs = data.similar_jobs.map(eachJob =>
        this.getUpdatedJobDetails(eachJob),
      )
      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        skills: updatedSkills,
        lifeAtCompany: updatedCompanyDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {jobDetails} = this.state
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          <div className="logo-title-container">
            <img
              src={jobDetails.companyLogoUrl}
              alt="company logo"
              className="company-logo"
            />
            <div className="title-rating-container">
              <h1 className="job-title">{jobDetails.title}</h1>
              <div className="rating-container">
                <i className="fas fa-star"> </i>
                <p className="rating">{jobDetails.rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details-container">
            <div className="job-location-container">
              <p className="location">{jobDetails.location}</p>
              <p className="job-type">{jobDetails.employmentType}</p>
            </div>
            <p className="salary">{jobDetails.packagePerAnnum}</p>
          </div>
          <hr />
          <p>Description</p>
          <p>{jobDetails.jobDescription}</p>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default JobItemDetails
