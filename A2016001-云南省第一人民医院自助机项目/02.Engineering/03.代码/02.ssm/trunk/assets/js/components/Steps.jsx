import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import styles from './Steps.css';

class Steps extends React.Component {

  constructor(props) {
    super(props);
  }
 
  render() {
  	let steps = this.props.steps.map(
  		(title, idx) => {
  			let span = idx % 2 == 0 ? Math.ceil(24/this.props.steps.length) : Math.floor(24/this.props.steps.length);
  			let bgColor = {
  				backgroundColor: idx + 1 == this.props.current ? '#BC1E1E' : '#E4E4E4'
  			}
  			let fontColor = {
  				color: idx + 1 == this.props.current ? '#BC1E1E' : '#4E4E4E'
  			}
        let lineClass = '';
        if (idx == 0) lineClass = 'steps_leftLine';
        else if (idx == this.props.steps.length - 1) lineClass = 'steps_rightLine';
        else lineClass = 'steps_centerLine';
				return (
					<Col span = {span} className = 'steps_col' style = {fontColor} key = {'STEPS_' + idx} >
            <span className = {'steps_backLine ' + lineClass} />
						<div className = 'steps_roundedBg' >
							<div className = 'steps_roundedNo' style = {bgColor} >{idx + 1}</div>
						</div>
						<font>{title}</font>
					</Col>
				);
  		}
  	);

    return (
      <div className = 'steps_container' >
      	<Row className = 'steps_row' >
  		  	{steps}
  		  </Row>
      </div>
    );
  }

}
  
module.exports = Steps;
