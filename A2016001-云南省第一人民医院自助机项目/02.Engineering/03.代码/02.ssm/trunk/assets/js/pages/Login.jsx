import React, { PropTypes } from 'react';
import { Button } from 'antd';
import styles from './Login.css';
import NavContainer from '../components/NavContainer.jsx';
import Card from '../components/Card.jsx';
//import medicalCardUtil  from '../../utils/medicalCardUtil';
//import miCardUtil  from '../../utils/miCardUtil';
import baseUtil from '../utils/baseUtil.jsx';

class Login extends React.Component {

  constructor(props) {
    super(props);
  }
  componentWillMount(){
	 baseUtil.speak('card_insertMedicalCard');
  }
  componentWillReceiveProps(nextProps){ 	
	  const { patient } = nextProps ;
	  if(patient.no && this.props.patient.no !=patient.no  ){
		 const { state } = this.props.location;
		 var { cardType } = patient;
		 if( cardType && cardType == "operator" ){
			//baseUtil.goHome('loginOptLogin'); 
			 this.props.history.push("/opt/main"); 
			return;
		 }
		 if(state && state.dispatch){
			this.props.history.push(state.dispatch); 
		 }else{
			baseUtil.goHome('loginNoDipatch'); 
		 }
	  }
  }
  componentDidMount() {
	  if(this.props.location.action == 'POP'){
		  baseUtil.goHome('loginPop'); ; //回退的，去首页
	  }
  }
  onBack(){
	  baseUtil.goHome('loginBack'); 
  }
  onHome(){
	  baseUtil.goHome('loginHome'); 
  }
  render() {
    let width = document.body.clientWidth - 108;
    let cardHeight =document.body.clientHeight  * 4 / 7;

    let cardStyle = {
      width: (width / 2) + 'px', 
      height: cardHeight + 'px', 
    };
    return (
		 <NavContainer  title='身份认证' onBack={this.onBack} onHome={this.onHome} >
		    <div style = {{position: 'relative', width: '100%', height: (document.body.clientHeight - 132) + 'px'}} >
		      <div width = '100%' height = '50rem' style={{margin:(document.body.clientHeight - 732)/2+'px'}} >
		        <div className = 'login_guideTextContainer' >
		          <font className = 'login_guideText' >请插入您的就诊卡</font>
		        </div>
		        <div style = {{height: '30rem', width: '30rem', margin: '3rem auto'}} >
	      			<img alt = "" src = './images/guide/med-card-read.gif' className = 'login_guidePic' />
	      		</div>
		      </div>
		    </div>
	      </NavContainer>
    );
  }
}
  
module.exports = Login;
