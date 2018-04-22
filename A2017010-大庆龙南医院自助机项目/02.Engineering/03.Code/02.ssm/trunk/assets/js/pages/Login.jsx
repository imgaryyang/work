import React, { PropTypes } from 'react';
import { Button } from 'antd';
import styles from './Login.css';
import NavContainer from '../components/NavContainer.jsx';
import Card from '../components/Card.jsx';
import medicalCard from '../utils/medicalCardUtil.jsx';
import baseUtil from '../utils/baseUtil.jsx';
import logUtil,{log} from '../utils/logUtil.jsx';
import TimerModule from '../TimerModule.jsx';
class Login extends TimerModule {

  constructor(props) {
    super(props);
    this.startMedicalCard = this.bind(this.startMedicalCard,this);
    this.cardPushed = this.bind(this.cardPushed,this);
  }
  componentWillMount(){
	 baseUtil.speak('card_insertMedicalCard');
	 this.startMedicalCard();//开启就诊卡监听
  }
  startMedicalCard(){console.info('startMedicalCard login page');
		medicalCard.on("cardPushed",(eventKey,cardInfo)=>{//监听插卡事件
			this.cardPushed(cardInfo);
		});
		medicalCard.on("cardPoped",(eventKey,cardInfo)=>{//监听弹卡事件
		});
		medicalCard.listenCard();
  }
  cardPushed(cardInfo){
	  const loginInfo = {
	    medicalCardNo:cardInfo.cardNo,
	  }			
	  baseUtil.login(loginInfo);
  }
  componentWillReceiveProps(nextProps){ 	
	  const { patient } = nextProps ;
	  if(patient.no && this.props.patient.no !=patient.no  ){
		 const { state } = this.props.location;
		 var { cardType } = patient;
		 if( cardType && cardType == "operator" ){
			// baseUtil.goHome('loginOptLogin'); 
			this.props.history.push("/opt/main"); 
			return;
		 }
		 if(state && state.dispatch){
			 var paths = [
	              "/assay/records",
	              "/pacs/pacsRecords",
	              "/clinic/caseHistory",
	              "/clinic/CaseHistory",
			 ];
			 var print =false;
			 for(var p of paths){
				 if(state.dispatch == p )print = true;
			 }
			 log('login-url['+state.dispatch+'],账户状态[{accStatus:'+patient.accStatus+',accStatusName:'+patient.accStatusName+']');
			 if(print){
				 log('login-url['+state.dispatch+'],打印类功能允许登录');
				 this.props.history.push(state.dispatch); 
			 }else{
				 if(patient.cardType != "operator" && (patient.accStatus == '-1' || patient.accStatusName == '-1')){
					log('login-url['+state.dispatch+'],账户未开通预存功能不允许登录');
					baseUtil.error('您的账户未开通预存功能,请先到窗口开通！');
					return;
				 }
				 log('login-url['+state.dispatch+'],账户状态正常，允许登录');
				 this.props.history.push(state.dispatch); 
			 }
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
