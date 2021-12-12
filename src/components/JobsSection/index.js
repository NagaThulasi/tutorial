import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Loader from 'react-loader-spinner'
import EachJob from '../EachJob'
import ProfileSection from '../ProfileSection'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class JobsSection extends Component {
  state = {
    searchInput: '',
    employmentType: '',
    salaryRange: '',
    jobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput, employmentType, salaryRange} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?&employment_type=${employmentType}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobs: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchButton = () => {
    this.getJobs()
  }

  onChangeEmploymentType = event => {
    this.setState({employmentType: event.target.value}, this.getJobs)
  }

  onChangeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobs)
  }

  onClickRetryBtn = () => {
    this.getJobs()
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getTypeOfEmploymentsData = () => (
    <>
      <h5>Type of employment</h5>
      <ul className="employment-type-list">
        {employmentTypesList.map(eachType => (
          <li className="each-employment-type">
            <input
              type="checkbox"
              id={eachType.employmentTypeId}
              className="checkbox-element"
              value={eachType.employmentTypeId}
              onChange={this.onChangeEmploymentType}
            />
            <label htmlFor={eachType.employmentTypeId}>{eachType.label}</label>
          </li>
        ))}
      </ul>
    </>
  )

  getSalaryData = () => (
    <>
      <h5>Salary Range</h5>
      <ul className="salary-range-list">
        {salaryRangesList.map(eachItem => (
          <li className="each-salary-item">
            <input
              type="radio"
              id={eachItem.label}
              onChange={this.onChangeSalaryRange}
              value={eachItem.salaryRangeId}
            />
            <label htmlFor={eachItem.label}>{eachItem.label}</label>
          </li>
        ))}
      </ul>
    </>
  )

  renderSuccessView = () => {
    const {jobs, searchInput} = this.state
    return (
      <div className="jobs-container">
        <div className="left-side-content">
          <ProfileSection />
          <hr className="horizontal-line" />
          {this.getTypeOfEmploymentsData()}
          <hr className="horizontal-line" />
          {this.getSalaryData()}
        </div>
        <div className="jobs-section-success view">
          <div className="search-input-container">
            <input
              type="search"
              onChange={this.onChangeSearchInput}
              className="input-element"
              value={searchInput}
              placeholder="Search"
            />
            <button
              type="button"
              className="search-button"
              onClick={this.onClickSearchButton}
            >
              <AiOutlineSearch className="search-icon" />
            </button>
          </div>
          <ul className="jobs-list">
            {jobs.map(eachJob => (
              <EachJob key={eachJob.id} jobDetails={eachJob} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => {
    const {searchInput} = this.state
    return (
      <>
        <div className="search-input-container">
          <input
            type="search"
            onChange={this.onChangeInput}
            className="input-element"
            value={searchInput}
            placeholder="Search"
          />
          <button
            type="button"
            className="search-button"
            onClick={this.onClickSearchButton}
          >
            <AiOutlineSearch className="search-icon" />
          </button>
        </div>
        <div className="failure-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="jobs-failure-view"
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
      </>
    )
  }

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

export default JobsSection
