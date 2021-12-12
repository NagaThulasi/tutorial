import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {RiHandbagFill} from 'react-icons/ri'

import './index.css'

const EachJob = props => {
  const {jobDetails} = props
  const {id} = jobDetails
  return (
    <Link to={`/jobs/${id}`}>
      <li className="each-job-container">
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
            <MdLocationOn className="location" />
            <p className="location-text">{jobDetails.location}</p>
            <RiHandbagFill className="job-type" />
            <p className="job-type">{jobDetails.employmentType}</p>
          </div>
          <p className="salary">{jobDetails.packagePerAnnum}</p>
        </div>
        <hr />
        <p>Description</p>
        <p>{jobDetails.jobDescription}</p>
      </li>
    </Link>
  )
}

export default EachJob
