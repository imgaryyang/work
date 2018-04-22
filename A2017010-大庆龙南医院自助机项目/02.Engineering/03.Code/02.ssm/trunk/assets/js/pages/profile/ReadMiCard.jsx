"use strict";
import moment from 'moment';
import { Component, PropTypes } from 'react';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import miCardUtil from '../../utils/miCardUtil.jsx';
import { Row, Col,  Modal, Icon }    from 'antd';
import styls from './ReadMiCard.css';
import NavContainer from '../../components/NavContainer.jsx';
import Career from '../../components/Career.jsx';
import Steps from '../../components/Steps.jsx';
import MiType from '../../components/MiType.jsx';
import TimerPage from '../../TimerPage.jsx';
import PinKeyboard from '../base/PinKeyboard.jsx';
import Button from '../../components/Button.jsx';
import idCardUtil from '../../utils/idCardUtil.jsx';
class Page extends TimerPage {
	constructor (props) {
		super(props);
		this.startMiCard = this.bind(this.startMiCard,this);
		this.onMiCardPushed = this.bind( this.onMiCardPushed,this);
		this.onSelectMiType =  this.bind(this.onSelectMiType,this);
		this.buildProfileByMi =  this.bind(this.buildProfileByMi,this);
		this.loadPatientInfo =  this.bind(this.loadPatientInfo,this);
		this.afterMiCardRead =  this.bind(this.afterMiCardRead,this);
		this.onSelectCareer =  this.bind(this.onSelectCareer,this);
		
		this.issue = this.bind(this.issue,this);
		this.reIssue = this.bind(this.reIssue,this);
		this.onEnterPass =  this.bind(this.onEnterPass,this);
		
		this.readMiCard =  this.bind(this.readMiCard,this);
		this.onCancelIdCard = this.bind(this.onCancelIdCard,this);
		this.listenIdCard = this.bind(this.listenIdCard,this);
		this.miReadSuccess = this.bind(this.miReadSuccess,this);
		this.state = {
		  showCareerModal:false,
		  showMiConfirm:false,
		  steps : ['读取医保卡', '校验手机号', '收费','发卡'],
		  profile:{},
		  medium:'',
		  password:'',
		  step:1,
		  idCardModal:false,
		  address:'',
		  miCardInfo:{},
		}
	}
	componentDidMount () {
		this.startMiCard();//开启就诊卡监听
	}
	startMiCard(){
		miCardUtil.listenCard(this.onMiCardPushed);
	}
	onMiCardPushed(cardInfo){
		if(cardInfo.state == 32796){
			baseUtil.error("无法识别的接触卡类型,请检查插卡方向或是否接触不良");
			return;
		}
		//如果有地址，则取得地址，如果没有，则需要刷身份证取得地址
		this.setState({step:1,medium:cardInfo.medium,address:cardInfo.Address||cardInfo.dw},()=>{//选择一个默认类型
			//this.onSelectMiType({code:'1',name:'大庆本地' });
			// baseUtil.speak('card_inputMiPass');
			log('市政-输入默认密码000000');
			this.onEnterPass('000000');//市政不需要输入密码
		});
	}
	onEnterPass(pwd){
		this.setState({password:pwd},()=>{
			baseUtil.mask('socket-readMiCard');
			setTimeout(()=>{ 
				this.readMiCard(1);//选择一个默认类型
			},300);
		});
	}
	onSelectMiType(type){
		log('mi建档-选择医保卡类型 ',type);
		this.setState({  showMiConfirm:false },()=>{
			baseUtil.mask('socket-readMiCard');
			setTimeout(()=>{ 
				this.readMiCard(type.code);
			},300 )
		})
	}
	readMiCard(type){
		var machine = baseUtil.getMachineInfo();
		var { medium,password } = this.state;
		var { miCardType } = this.props;// 01 油田，02 社保 
		//1交易码 2医保类型3是否是身份证 4社保卡类型 5社保卡密码	6操作员	7是否是自助机
		var cardInfo = {type,medium,password,miCardType};//
		var miCardInfo = {};
		try{
			miCardInfo = miCardUtil.readCard( cardInfo , machine.hisUser );
		}catch(e){
			baseUtil.unmask('socket-readMiCard');
			baseUtil.error('socket通信异常，请联系运维人员');
			return;
		}
		baseUtil.unmask('socket-readMiCard');
		
//		miCardInfo = {
//			"state":"0",
//			"knsj":"02^00^588392958",
//			"grbh":"1001346282","xm":"方安","xb":"女",
//			"csrq":"1982-08-17 00:00:00",
//			"sfzh":"230202198208175540",
//			"cbsf":"","age":"35","ye":"48.62","bz":"",
//			"dw":"在校生",
//			"rqlb":"3A","cwxx":"",
//			"dwdm":'NB71',
//		}
		this.setState({miCardInfo},()=>{
			this.miReadSuccess();
		})
	}
	listenIdCard(){
		baseUtil.speak('card_putIdCard');// 播放语音：请将您的身份证放置到身份证读卡器
		idCardUtil.listenCard((idCardInfo)=>{
			if(!idCardInfo.Address){
				baseUtil.warning('身份证无法识别!,建议您建档完毕后到窗口补全您的地址信息');
			}
			log('mi建档-读取身份证完毕，地址 ',idCardInfo.Address);
			this.setState({idCardModal:false,address:idCardInfo.Address},()=>{
				this.onSelectCareer({type:'0005',code:'01',name:'工人',pinyin:'GR',wb:'AW', },);//选择一个默认职业
			});
		});
	}
	miReadSuccess(){
		var { miCardInfo } = this.state;
		if(miCardInfo && miCardInfo.grbh){
			var profile = this.buildProfileByMi(miCardInfo);
			this.loadPatientInfo(profile)	
		}
	}
	onCancelIdCard(){
		const { address } = this.state;
		log('mi建档-取消读取身份证，地址 ', address);
		this.setState({idCardModal:false},()=>{
			this.onSelectCareer({type:'0005',code:'01',name:'工人',pinyin:'GR',wb:'AW', },);//选择一个默认职业
		});
	}
	buildProfileByMi(miCardInfo){
	  log("mi建档-根据医保卡构建档案信息",miCardInfo);
	  const { knsj, grbh, xm, xb, csrq, sfzh, cbsf, age, ye, bz, dw, rqlb,dwdm,miCardType} = miCardInfo;
	  const { address } = this.state;
	  var gender = '3';
	  if('男' == xb)gender = '1';
	  if('女' == xb)gender = '2';
	  var birthday =csrq ? moment(csrq).format('YYYY-MM-DD'):'';//-DD HH:mm:ss
	  const profile={
		  miPatientNo:grbh,company:dw,
		  name:xm,gender:gender,sfzh,birthday:birthday, // idNo:sfzh,
		  address:address,unitCode:'0000',medicalCardNo:'',miCardNo:knsj ,opentype:'1',
		  grbh,dwdm,knsj,miCardType,
	  };
	  return profile;
    }
    loadPatientInfo(profile){
    	log("mi建档-档案信息查询",profile);
    	const { type } = this.props;
		let fetch = Ajax.get("/api/ssm/treat/patient/info",profile,{catch: 3600});
		fetch.then(res => {
			log("mi建档-档案信息查询返回",res);
			if(res && res.success){
				var patient = res.result||{};
				if(type == 'reissue'){
					this.reIssue({...profile,...patient});
				}else{
					this.issue({...profile,...patient});
				}
			}else if( res && res.msg ){
				baseUtil.error(res.msg);
	    	}else{
	    		baseUtil.error("查询档案失败");
	    	}
		}).catch((ex) =>{
			baseUtil.error("查询档案失败");
		})
    }
    issue(patient){
    	const {relationCard, relationType} = patient;
    	log('mi建档-办卡模式，根据医保卡加载用户自费档信息完毕',patient);
		if( relationCard && (relationType == '01' || relationType == '02') && patient.no != patient.medicalCardNo){
			baseUtil.error('您已经办理过医保关联就诊卡');
			return;
		}else{//如果自费档案卡号不存在，则允许第二次办卡
			if(patient.no){
				log('mi建档-患者档案存在',patient);
				this.afterMiCardRead(patient)
			}else {
				log('mi建档-患者档案不存在');
				if(this.state.address){//地址是全的
					log('mi建档-患者地址存在');
					this.setState({showCareerModal:false,profile:patient},()=>{
						this.onSelectCareer({type:'0005',code:'01',name:'工人',pinyin:'GR',wb:'AW', },);//选择一个默认职业
					});
				}else{
					log('mi建档-患者地址不存在,读取身份证用于获取');
					this.setState({idCardModal:true},()=>{//监听身份证
						this.setState({showCareerModal:false,profile:patient},()=>{
							 this.listenIdCard();
						});
					});
				}
			}
		}
    }
    reIssue(patient){
    	const {relationCard, relationType} = patient;
    	log('mi建档-补卡卡模式，根据医保卡加载用户信息完毕',patient);
		if( relationCard && (relationType == '01' || relationType == '02') && patient.no != patient.medicalCardNo){//自费档存在且卡号存在
			log('mi建档-自费档存在且卡号存在');
			this.afterMiCardRead(patient)
		}else{
			baseUtil.error('您还未办理过医保关联就诊卡');
		}
    }
	onSelectCareer(career){
	  const { profile,address } = this.state;
	  this.setState({
		 showCareerModal:false,
		 career:career||{}
	  },()=>{
		 this.afterMiCardRead({
			 ...profile,
			 careerName:career.name,
			 careerCode:career.code,
			 occupationnum:career.code,
			 address,
		})
	  });
    }
	onBack(){
	  baseUtil.goHome('miCardBack'); 
	}
	onHome(){
	  baseUtil.goHome('miCardHome'); 
	}
	afterMiCardRead(profile){
		if(this.props.afterMiCardRead)this.props.afterMiCardRead(profile);
	}
	render () { 
		var  width = document.body.clientWidth - 48;
		var  careerWidth = width - 36;
		var  modalWinTop  = 13;
		var { step } = this.state;
		return (
	      <NavContainer title='读取医保卡' onBack={this.onBack} onHome={this.onHome} >
	      	<Steps steps = {this.state.steps} current = {1} />
	      	{
			  	step == 1?(
			  		<div>
			  			<div className = 'profile_mic_guideTextContainer' >
				          <font className = 'profile_mic_guideText' >请刷身份证或插入医保卡</font>
				        </div>
				        <Row>
				          <Col span={12}>
					        <div style = {{height: '34rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
					  		  <img alt = "" src = './images/guide/idcard-read.gif' className = 'profile_mic_guidePic' />
					  		</div>
					  	  </Col>
					  	  <Col span={12}>
					  	  	<div style = {{height: '34rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
					  	  		<img alt = "" src = './images/guide/si-card-read.gif' className = 'profile_mic_guidePic' />
					  	  	</div>
					  	  </Col>
				  		</Row>
						<Modal visible = {this.state.showMiConfirm} closable = {false} footer = {null} width = {(careerWidth/2) + 'px'} style = {{top: (modalWinTop+8) + 'rem'}} >
						  <div style = {{margin: '-16px'}}>
						 	  <MiType width = {careerWidth/2} onSelectMiType={this.onSelectMiType} />
						  </div>
						</Modal>
				  		<Modal visible = {this.state.showCareerModal} closable = {false} footer = {null} width = {careerWidth + 'px'} style = {{top: modalWinTop + 'rem'}} >
				 		    <div>
				 			  <Career width = {careerWidth - 32} onSelectCareer={this.onSelectCareer} />
				 		    </div>
				 		 </Modal>	
				 	</div>
			  	):null	
			}
	      	{
			  	step == 2?(
			  			<PinKeyboard onSubmit={this.onEnterPass} maxLength={6}/>
			  	):null	
			}
	      	<Modal visible = {this.state.idCardModal} closable = {false} footer = {null} width = {document.body.clientWidth * 0.6836 + 'px'} style={{top:'17rem'}} >
		      <div style = {{	backgroundColor:'#f5f5f5',marginTop:'-16px',marginBottom:'-50px',marginLeft:'-16px',marginRight:'-16px',}}>
			        <div className = 're_act_guideTextContainer' >
						<font className = 're_act_guideText' >放置您的身份证便于以后的就诊!!!</font>
					</div>	
					<div style = {{height: '30rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
						<img alt = "" src = './images/guide/idcard-read.gif' className = 're_act_guidePic' />
					</div>
		      </div>
		    </Modal>
		  </NavContainer>
	    );
	}
}
module.exports = Page;


//<Row style = {{padding : '1.5rem'}} >
//<Col span = {8}>&nbsp;</Col>
//<Col span = {8}><Button text = "没带"  onClick = {this.onCancelIdCard} /></Col>
//<Col span = {8} >&nbsp;</Col>
//</Row>