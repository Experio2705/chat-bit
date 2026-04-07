import React from 'react'
import './Css/Otherwise.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket ,faPersonCirclePlus,faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
const Otherwise = ({setView}) => {
  return (
        <div className="chat-none" onClick={()=>setView("addcontact")}>
          <FontAwesomeIcon icon={faPersonCirclePlus} className='chat-none-icon' style={{color:'rgb(60, 60, 60)'}}/>
          <p>Add contact</p>
        </div>
  )
}

export default Otherwise