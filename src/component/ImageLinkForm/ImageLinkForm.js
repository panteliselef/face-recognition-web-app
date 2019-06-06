import React from 'react';
import arrow from '../../arrow-right.png'
import './ImageLinkForm.css'
const ImageLinkForm = ({onInputChange,onSubmit}) => {


  return(
    <div className="">
      <p className="f3">
        {'This Magic Brain will detect faces in your pictures. Git it a try'}
      </p>
        <div className='form center'>
          <input className="f4 pa3 w-80 center shadow-5" type="text" onChange={onInputChange}/>
          <button className='w-20 pa3 f4 link ph3 shadow-5  pv2 dib white bg-light-purple' onClick={onSubmit}><img src={arrow} height="30px" ></img></button>
        </div>
      <div className="center">
      </div>
    </div>
  )
}


export default ImageLinkForm;