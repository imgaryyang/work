import React,{ Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './RegisterMain.css';
import WorkSpace from '../../components/WorkSpace';
import Input from '../../components/Input';
import config from '../../config';
import NumBar from '../../components/keyboard/NumBar';
import { Row,Col,Card,Modal } from 'antd';
import Button               from '../../components/Button';
import b_0103              from '../../assets/bank/0103.png';
import b_0104              from '../../assets/bank/0104.png';
import b_0301              from '../../assets/bank/0301.png';
import b_0306              from '../../assets/bank/0306.png';
import b_0308              from '../../assets/bank/0308.png';
import b_6509              from '../../assets/bank/6509.png';
import alipay              from '../../assets/base/alipay.png';
import weixin              from '../../assets/base/weixin.png';
import unpay  from '../../assets/base/union-pay.png';
import checked              from '../../assets/base/checked.png';
import unchecked            from '../../assets/base/unchecked.png';
const logos={b_0103,b_0104,b_0301,b_0306,b_0308,b_6509};
class RefundMain extends Component {
	
  constructor (props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.renderInfo = this.renderInfo.bind(this);
  }
  componentWillMount () {//初始化，接管nav的返回按钮
  }
  componentWillReceiveProps(nextProps){
  }
  componentWillUnmount(){//销毁前，置空nav返回按钮
  }
  state={
	banks:[
	  {sx:'GF',name:'广发银行',code:'0306'},
	  {sx:'NH',name:'农业银行',code:'0103'},
	  {sx:'ZH',name:'招商银行',code:'0308'},
	  {sx:'NX',name:'云南农信',code:'6509'},
	  {sx:'JT',name:'交通银行',code:'0301'},
	  {sx:'ZG',name:'中国银行',code:'0104'},
	],
	bank:{},
	cash:true,
	code:'',
	
  }
  submit(){
	var {bank,code} = this.state;
	if(!bank.sx){
		alert('选银行');
		return;
	}
	if(!code || code.length < 4 ){
		alert('代码不少于4位');
		return;
	}
	var machine = {
		code : bank.sx+code,
		name : bank.name+code,
		mngCode: bank.code,
		mngName: bank.name,
	};
	this.props.dispatch({
		type:'frame/machineRegister',
		payload:{machine}
	});
  }
  onSelectBank(bank){
	  this.setState({bank});
  }
  onSelectCash(){
	  this.setState({cash:!this.state.cash});
  }
  onKeyDown(key){
	  var old = this.state.code;
	  var value = old;
	  if('清空'==key)value="";
	  else if('删除'==key)value =old.substr(0, old.length - 1);//删除
	  else if(old.length < 4)value=old+key;
	  console.info(value);
	  this.setState({code:value});
  }
  render () {
	const modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 4;
	const { baseInfo } = this.props.patient;
	
	
    return (
      <WorkSpace style = {{paddingTop: '1rem'}} >
      {
     	 this.renderInfo()
       }
      {
    	 this.renderBanks(this.state.banks)
      }
      {
    	   this.renderForm()
      }
      <NumBar styles={{height:'5rem'}} onKeyDown={this.onKeyDown.bind(this)}/>
      <Button text = "确定"  onClick = {this.submit} />
      </WorkSpace>
    );	
  }
  renderInfo(){
	const { machine } = this.props.frame;  
	return(
	  <Row style={{padding:config.navBar.padding + 'rem'}}>
	  {this.renderTitle('基本信息')}
	  {
		  
	  }
	  <Row style={{fontSize:'2rem'}}>
	  <Col span={3}>编号 ： </Col>
	  <Col span={3}>{machine.code}</Col>
	  <Col span={3}>&nbsp;&nbsp;名称 ： </Col>
	  <Col span={3}>{machine.name}</Col>
	  <Col span={3}>&nbsp;&nbsp;银行 ： </Col>
	  <Col span={3}>{machine.mngName}</Col>
	  <Col span={3}>&nbsp;&nbsp;HIS用户名 ： </Col>
	  <Col span={3}>{machine.hisUser}</Col>
	  </Row>
	  <Row style={{fontSize:'2rem'}}>
	  <Col span={2}>IP ： </Col>
	  <Col span={10}>{machine.ip}</Col>
	  <Col span={2}>&nbsp;&nbsp;MAC ： </Col>
	  <Col span={10}>{machine.mac}</Col>
	  </Row>
      </Row>
	)  
  }
  renderBanks(banks){
	if(!banks || banks.length<=0)return null;
	return(
	  <Row style={{padding:config.navBar.padding + 'rem'}}>
	  {this.renderTitle('银行')}
	  {
		  banks.map((bank,index)=>{
			  var logo = logos['b_'+bank.code] ||unpay;
			  var bg = (this.state.bank.code == bank.code)?'1px solid red':'1px solid gray';
			  return (
				<Col key={index} span={8}>
				      <div style={{margin:'5px',height:'60px',backgroundColor:'white',lineHeight:'60px',borderRadius:".6rem",border:bg}} onClick={this.onSelectBank.bind(this,bank)}>
					      <Row >
					      	<Col span={8}><img style={{height:'40px'}} src={logo}/></Col>
					      	<Col span={16}>
					      		<Row style={{fontSize:'3rem'}}>{bank.name}</Row>
					      	</Col>
					      </Row>
				      </div>
			      </Col>
			  )
		  })
	  }
      </Row>
	)  
  }
  
  renderForm(){
	  var bg = (this.state.cash)?'1px solid red':'1px solid gray';
	return(
	  <Row style={{padding:config.navBar.padding + 'rem',fontSize:'2rem'}}>
	  {this.renderTitle("数据")}
	  <Col span={2}><span>编号 ： </span></Col>
	  <Col span={4}><Input focus = {true} styles={{height:'2rem'}} value = {this.state.code}/></Col>
	  <Col span={2}><span></span></Col>
	  <Col span={2}><span>钱箱 ： </span></Col>
	  <Col span={4}>
	  <img src = {this.state.cash?checked:unchecked} width = {3*config.remSize} height = {3*config.remSize} onClick={this.onSelectCash.bind(this)} />
	  </Col>
	  <Col span={2}><span>区域 ： </span></Col>
	  <Col span={4}>
	  <img src = {this.state.cash?checked:unchecked} width = {3*config.remSize} height = {3*config.remSize} onClick={this.onSelectCash.bind(this)} />
	  </Col>
      </Row>
	)  
  }
  renderTitle(title){
	return (
	  <ul className={styles.title}>
	  	<li className={styles.line}></li>
	  	<li className={styles.textwrapper}><span className={styles.text}>{title}</span></li>
	  </ul>
	)
  }
}  

export default  connect(({refund,patient,frame}) => ({refund,patient,frame}))(RefundMain);
