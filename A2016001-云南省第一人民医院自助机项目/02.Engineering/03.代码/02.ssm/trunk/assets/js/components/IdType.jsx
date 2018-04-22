import React, { PropTypes }     from 'react';
import { Row, Col }             from 'antd';
import styles                   from './IdType.css';
import moment                   from 'moment';
import Button               from './Button.jsx';
class MiType extends React.Component {
  constructor (props) {
    super(props);
    this.onSelectType = this.onSelectType.bind(this);
    this.types = [
	  {code:'1',name:'患者本人银行卡' },
	  {code:'0',name:'他人银行卡'},
    ];
  }

  onSelectType (type) {
	  if(this.props.onSelectType)this.props.onSelectType(type);
  }

  componentWillMount () {
  }
  init(value){
  }
  render () {
    // let { } = this.props;
 	return(
	  <div className = 'idtype_container' >
	    <div className = 'idtype_innerContainer' >
	      <Row>
	      {
	    	  this.types.map((type, idx) => {
                return (
	              <Col key = {idx} span = {12} className='idtype_career' >
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