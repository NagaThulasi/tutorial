import './index.css'

const EachSkill = props => {
  const {skillDetails} = props
  return (
    <li className="each-skill">
      <img
        src={skillDetails.imageUrl}
        alt={skillDetails.name}
        className="image"
      />
      <p>{skillDetails.name}</p>
    </li>
  )
}

export default EachSkill
