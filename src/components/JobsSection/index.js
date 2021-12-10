import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import EachJob from '../EachJob'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobsSection extends Component {
  state = {
    searchInput: '',
    jobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?`
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

  onChangeInput = event => {
    this.setState({searchInput: event.target.value})
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {jobs, searchInput} = this.state
    return (
      <div className="jobs-section-success view">
        <input
          type="search"
          onChange={this.onChangeInput}
          className="input-element"
          value={searchInput}
          placeholder="Search"
        />
        <ul className="jobs-list">
          {jobs.map(eachJob => (
            <EachJob key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => {
    const {searchInput} = this.state
    return (
      <>
        <input
          type="search"
          onChange={this.onChangeInput}
          className="input-element"
          value={searchInput}
          placeholder="Search"
        />
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="jobs-failure-view"
        />
        <h1 className="jobs-failure-heading">Oops!Something Went Wrong</h1>
        <p className="jobs-failure-para">
          We cannot seem to find the page you are looking for.
        </p>
        <button type="button" className="retry-btn">
          Retry
        </button>
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
