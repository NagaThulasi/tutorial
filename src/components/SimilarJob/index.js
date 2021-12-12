import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {RiHandbagFill} from 'react-icons/ri'

import './index.css'

const SimilarJob = props => {
  const {similarJobDetails} = props
  return (
    <li className="each-similar-job-container">
      <div className="image-title-container">
        <img
          src={similarJobDetails.companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div>
          <p className="title">{similarJobDetails.title}</p>
          <div className="rating-container">
            <AiFillStar className="star" />
            <p className="rating">{similarJobDetails.rating}</p>
          </div>
        </div>
      </div>
      <p>Description</p>
      <p className="description">{similarJobDetails.jobDescription}</p>
      <div className="job-details-container">
        <div className="location-container">
          <MdLocationOn className="location" />
          <p>{similarJobDetails.location}</p>
        </div>
        <div className="location-container">
          <RiHandbagFill className="location" />
          <p>{similarJobDetails.employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJob
