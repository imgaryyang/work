import React, { PropTypes }     from 'react';
import { connect }              from 'dva';
import { Row, Col }             from 'antd';
import config                   from '../config';
import styles                   from './MiType.css';
import moment                   from 'moment';
import Button               from './Button';
class MiType extends React.Component {

  static defaultProps = {
    width: 400,
  };

  types = [
	  {code:'1',name:'昆明本地' },
	  {code:'0',name:'省内异地'},
  ];
  
//{type:'02',code:'市属',name:'农民',pinyin:'NM',wb:'PN',},
  
  state={
  }
  
  
  constructor (props) {
    super(props);
    this.onSelectType = this.onSelectType.bind(this);
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
	  <div className = {styles.container} >
	    <div className = {styles.innerContainer} >
	      <Row>
	      {
	    	  this.types.map((type, idx) => {
                return (
	              <Col key = {idx} span = {12} className={styles.career} >
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

export default connect()(MiType);


