import React from 'react'
import './noresponse.scss'

const NoResponse = (props) => {
    const {title} = props;
    return (
        <div className="no-responses-container">
          <p>{title}</p>
        </div>
      );
    
}

export default NoResponse