import React, { PropTypes } from 'react';
import { message }          from 'antd';
import styles               from './Info.css';
import Card                 from './Card.jsx';
import BackTimer            from './BackTimer.jsx';

class Info extends React.Component {
  constructor(props) {
	  super(props);
  }

  componentDidMount() {
  }

  render() {
	 var autoBack = (this.props.autoBack === false)?false:true;
	 var showDoneImg = (this.props.showDoneImg === false)?false:true;
			  
    return (
      <div width = '80%' height = '50rem' >
        <div className = 'info_msg' >{this.props.info}</div>
        {autoBack ? <BackTimer style = {{marginTop: '4rem'}} /> : null}
        {autoBack ? <img src ='./images/base/done.png' className = 'info_doneImg' /> : null}
      </div>
    );
  }
}
module.exports = Info;