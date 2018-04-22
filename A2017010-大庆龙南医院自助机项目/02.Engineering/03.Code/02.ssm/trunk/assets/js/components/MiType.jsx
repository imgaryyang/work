import React, { PropTypes }     from 'react';
import { Row, Col }             from 'antd';
import styles                   from './MiType.css';
import moment                   from 'moment';
import Button               from './Button.jsx';
class MiType extends React.Component {
  constructor (props) {
    super(props);
    this.onSelectType = this.onSelectType.bind(this);
    this.types = [
	  {code:'1',name:'大庆本地' },
	  {code:'0',name:'省内异地'},
    ];
  }

  onSelectType (type) {
	  if(this.props.onSelectMiType)this.props.onSelectMiType(type);
  }

  componentWillMount () {
  }
  init(value){
  }
  render () {
    // let { } = this.props;
 	return(
	  <div className = 'mitype_container' >
	    <div className = 'mitype_innerContainer' >
	      <Row>
	      {
	    	  this.types.map((type, idx) => {
                return (
	              <Col key = {idx} span = {12} className='mitype_career' >
	                <div onClick = {() => this.onSelectType(type)  } >
	                  <span>{type.name}</span>
	                </div>
	              </Col>
		    	)
		      })
	      }
	      </Row>
	    </div>
	  </div>
    );
  }
}
module.exports = MiType;