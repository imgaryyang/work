import React, { PropTypes }     from 'react';
import { Row, Col,  Modal, Icon }    from 'antd';
import styles                   from './SelectAllDoctor.css';
import Button from '../../components/Button.jsx';
import moment                   from 'moment';

class Doctor extends React.Component {

  constructor (props) {
    super(props);
    this.onSelectDoctor = this.onSelectDoctor.bind(this);
  }

  onSelectDoctor (doctor) {
	  if(this.props.onChoose)this.props.onChoose(doctor);
  }

  componentWillMount () {
  }
  init(value){
  }
  render () {
    let { doctors } = this.props;
	  
 	return(
	  <div className = 'doctor_container' >
	    <div className = 'doctor_innerContainer' >
	      <Row>
	      {
	    	  doctors.map((doctor, idx) => {
                return (
	              <Col key = {idx} span = {6} className='doctor_doctor' style = {{padding: '2px'}} >
	                <div onClick = {() => this.onSelectDoctor(doctor)  } >
	                  <span>{doctor.name}</span>
	                </div>
	              </Col>
		    	)
		      })
	      }
	      </Row>
	      <Row><Col span={24}> <Button text="全部医生" onClick = {() => this.onSelectDoctor(null)  }  /></Col></Row> 
	    </div>
	  </div>
    );
  }
}
module.exports = Doctor;