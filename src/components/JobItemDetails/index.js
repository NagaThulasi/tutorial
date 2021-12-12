import {Component} from 'react'

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {RiHandbagFill} from 'react-icons/ri'
import {BsBoxArrowUpRight} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import EachSkill from '../EachSkill'

import SimilarJob from '../SimilarJob'

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
    imageUrl: data.image_url,
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
      console.log(data)

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
      console.log(updatedSimilarJobs)
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

  renderSkills = skills => (
    <>
      <h1 className="skills">Skills</h1>
      <ul className="each-skill-container">
        {skills.map(eachSkill => (
          <EachSkill key={eachSkill.name} skillDetails={eachSkill} />
        ))}
      </ul>
    </>
  )

  renderLifeAtCompany = () => {
    const {lifeAtCompany} = this.state
    return (
      <div>
        <h1 className="life-at-company-head">Life At Company</h1>
        <div className="life-at-company-description-container">
          <p className="life-at-company-description">
            {lifeAtCompany.description}
          </p>
          <img src={lifeAtCompany.imageUrl} alt="life at company" />
        </div>
      </div>
    )
  }

  renderSimilarJobsView = () => {
    const {similarJobs} = this.state
    return (
      <>
        <h2>Similar Jobs</h2>
        <ul className="similar-jobs-container">
          {similarJobs.map(eachJob => (
            <SimilarJob key={eachJob.id} similarJobDetails={eachJob} />
          ))}
        </ul>
      </>
    )
  }

  renderSuccessView = () => {
    const {jobDetails, skills} = this.state
    return (
      <>
        <Header />
        <div className="container">
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
                  <AiFillStar className="star" />
                  <p className="rating">{jobDetails.rating}</p>
                </div>
              </div>
            </div>
            <div className="job-details-container">
              <div className="job-location-container">
                <MdLocationOn />
                <p className="location">{jobDetails.location}</p>
                <RiHandbagFill />
                <p className="job-type">{jobDetails.employmentType}</p>
              </div>
              <p className="salary">{jobDetails.packagePerAnnum}</p>
            </div>
            <hr />
            <div className="description-heading-container">
              <h3>Description</h3>
              <div className="anchor-element-container">
                <a
                  href={jobDetails.companyWebsiteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit
                </a>
                <BsBoxArrowUpRight className="arrow-icon" />
              </div>
            </div>
            <p>{jobDetails.jobDescription}</p>
            <div>{this.renderSkills(skills)}</div>
            <div>{this.renderLifeAtCompany()}</div>
          </div>
          <div>{this.renderSimilarJobsView()}</div>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetryBtn = () => {
    this.getJobDetails()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="jobs-failure-heading">Oops!Something Went Wrong</h1>
      <p className="jobs-failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickRetryBtn}
      >
        Retry
      </button>
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
