import React,{ Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card,Modal } from 'antd';
import WorkSpace from '../../components/WorkSpace';
import styles from './Step1.css';
import idcard from '../../assets/guide/idcard-read.gif';
import Confirm from '../../components/Confirm';
import config from '../../config';
import searchIcon           from '../../assets/base/search.png';
import Career from '../../components/Career';
class Step1 extends Component {
  constructor (props) {
    super(props);
    this.next = this.next.bind(this);
    this.checkPatientExist = this.checkPatientExist.bind(this);
    this.showCareer = this.showCareer.bind(this);
    this.onSelectCareer = this.onSelectCareer.bind(this);
  }
  state = {showConfirm: false,showCareerModal:false,career:{}} ; 
  componentDidMount() {
	const { idCardInfo } = this.props.patient;
	if(idCardInfo.userName ){
		console.info('读取身份证成功，身份证号码：',idCardInfo.idNo);
		this.checkPatientExist(idCardInfo);
		return;
	}
    this.props.dispatch({
      type: 'patient/listenIdCard',
    });   
  }
  componentWillReceiveProps(nextProps){
  	const { idCardInfo:old } = this.props.patient;
  	const { idCardInfo:card } = nextProps.patient;
	if(!old.userName && card.userName ) {
		console.info('读取身份证成功，身份证号码：',card.idNo);
		this.checkPatientExist(card);
	}
  }
  checkPatientExist(idCardInfo){
	console.info('检查患者档案是否存在', idCardInfo);
	const {userName, sex, nation,birthday} = idCardInfo;
	const {address,idNo,issuer,effectiveDate} = idCardInfo;
	var gender = '3';
	if('男' == sex)gender = '1';
	if('女' == sex)gender = '2';
	const profile={
	  name:userName,gender:gender,idNo:idNo,birthday:birthday,
	  address:address,unitCode:'0000',medicalCardNo:'',opentype:'1'
    };
	this.props.dispatch({
		type: 'patient/loadPatientInfo',
		payload:{patient:profile},
		callback:(p)=>{
		  if(p.no && p.medicalCardNo != p.no ){//卡号已经存在
			console.info('患者卡号已存在');
			this.showConfirm();
		  }else{
			console.info('患者卡号不存在');
			if(p.no){
				console.info('患者档案存在，不能选择职业');
				this.next();
			}else {
				this.showCareer();
			}
		  }
		}
	});
  }
  showCareer(){
	  this.setState({showCareerModal:true});
	
  }
  onSelectCareer(career){
	 const { idCardInfo } = this.props.patient;
	 this.setState({
		 showCareerModal:false,
		 career:career||{}
	 },()=>{
		 this.props.dispatch({
				type: 'patient/setState',
				payload:{
					idCardInfo:{
						careerName:career.name,
						careerCode:career.code,
						...idCardInfo
					}
				},
		 		callback:()=>{
		 			this.next(); 
		 		}
		 });
	});
  }
  showConfirm(){
	  this.setState({showConfirm:true});
  }
  next(){
    if(this.props.onNext)this.props.onNext();
  }
  render () {
	var  careerWidth = config.getWS().width - config.navBar.padding * 2 * config.remSize;
	var  modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 5;
    return (
    	<WorkSpace width = '100%' height = '50rem' >
    		<div className = {styles.guideTextContainer} >
    			<font className = {styles.guideText} >请将您的身份证放置到身份证读卡器</font>
    		</div>
    		<div style = {{height: '30rem', width: '30rem', margin: '3rem auto'}} >
	  			<img alt = "" src = {idcard} className = {styles.guidePic} />
	  		</div>
	  		<Modal visible = {this.state.showCareerModal} closable = {false} footer = {null} width = {careerWidth + 'px'} style = {{top: modalWinTop + 'rem'}} >
	 		    <div>
	 			  <Career width = {careerWidth - 32} onSelectCareer={this.onSelectCareer} />
	 		    </div>
	 		 </Modal>	
    		<Confirm info = '您已经申请过就诊卡，如果您需要挂失或者补办就诊卡，请到"就诊卡挂失补办"菜单进行操作!' visible = {this.state.showConfirm} 
                buttons = {[{text: '确定', onClick: () =>{
               	 this.setState({showConfirm: false});
               	 this.props.dispatch(routerRedux.push('/homepage'));
                }},]}
               />
    	</WorkSpace>
    );	
  }
}  

export default  connect(({patient}) => ({patient}))(Step1);