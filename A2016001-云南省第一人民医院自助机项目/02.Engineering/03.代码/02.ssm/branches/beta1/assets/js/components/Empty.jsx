import React, { PropTypes } from 'react';
import { Icon }             from 'antd';
import styles               from './Empty.css';

class Empty extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div className ='empty' >
          <Icon type = 'info-circle-o' style = {{fontSize: '10rem', color: '#BC1E1E'}} /><br/><br/>
          {this.props.info}
        </div>
    );
  }
}
module.exports = Empty;