import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './Steps.css';

class Steps extends React.Component {

  static displayName = 'GuideSteps';
  static description = '引导步骤';

  static propTypes = {

    /**
    * 步骤数组
    * 必填
    */
    steps: PropTypes.array.isRequired,

    /**
    * 当前步骤
    */
    current: PropTypes.number,

  };

  static defaultProps = {
  };

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
        if (idx == 0) lineClass = styles.leftLine;
        else if (idx == this.props.steps.length - 1) lineClass = styles.rightLine;
        else lineClass = styles.centerLine;
				return (
					<Col span = {span} className = {styles.col} style = {fontColor} key = {'STEPS_' + idx} >
            <span className = {styles.backLine + ' ' + lineClass} />
						<div className = {styles.roundedBg} >
							<div className = {styles.roundedNo} style = {bgColor} >{idx + 1}</div>
						</div>
						<font>{title}</font>
					</Col>
				);
  		}
  	);

    return (
      <div className = {styles.container} >
      	<Row className = {styles.row} >
  		  	{steps}
  		  </Row>
      </div>
    );
  }

}
  

export default connect()(Steps);


