import ProfileSection from '../ProfileSection'
import JobsSection from '../JobsSection'

import Header from '../Header'

import './index.css'

const Jobs = () => (
  <>
    <Header />
    <div className="jobs-container">
      <ProfileSection />
      <JobsSection />
    </div>
  </>
)

export default Jobs
