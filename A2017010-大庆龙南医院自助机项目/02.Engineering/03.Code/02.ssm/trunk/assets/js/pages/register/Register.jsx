"use strict";
import React, { PropTypes }   from 'react';
import { Row, Col, Modal ,Checkbox}  from 'antd';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import Button from '../../components/Button.jsx';
import Input from '../../components/Input.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import NumKeyboard from '../../components/keyboard/NumBar.jsx';
var b_0103 = './images/bank/0103.png';
var b_0104 = './images/bank/0104.png';
var b_0301 = './images/bank/0301.png';
var b_0306 = './images/bank/0306.png';
var b_0308 = './images/bank/0308.png';
var b_6509 = './images/bank/6509.png';

const logos = Object.freeze({
	"b_0103" : {src : b_0103},
	"b_0104" : {src : b_0104},
	"b_0301" : {src : b_0301},
	"b_0306" : {src : b_0306},
	"b_0308" : {src : b_0308},
	"b_6509" : {src : b_6509},
	"b_0105" : {src : b_6509}
});


class Page extends React.Component{
	constructor(props){
		super(props);
		this.onBack = this.onBack.bind(this);
	    this.onHome = this.onHome.bind(this);
	    this.renderBank = this.renderBank.bind(this);
	    this.onSelectBank = this.onSelectBank.bind(this);
	    this.isExistCashBox = this.isExistCashBox.bind(this);
	    this.submit = this.submit.bind(this);
		this.state = {
			code : 'JS',//编号
			name : '',//名称
			mngName : '',//管理方名称
			hisUser : '',//HIS用户
			ip : '',//IP
			mac : '',//mac地址
			banks : [
						{sx:'JS',name:'建设银行',code:'0105'},
					],
			bank:{sx:'JS',name:'建设银行',code:'0105'},
			cash:true,
			cashbox:'1',
		}
	}
	onBack(){
		 baseUtil.goHome('cashBack');
	  }
	onHome(){
		 baseUtil.goHome('cashHome');
	  }
	onSelectBank(banks){
		console.log("选择银行",banks);
		this.setState({
			bank : banks,//并不能够马上取到值，需要回掉一下
			},()=>{
				console.log('选择的银行是：'+this.state.bank.name+'****'+this.state.cash);
			});
		
	}
	
	isExistCashBox(){
		//this.state.cashbox = !this.state.cashbox;	
		this.setState({
			cashbox : '1',
		})
		console.log(this.state.cashbox);
	}
	onKeyDown(key){
		  var old = this.state.code;
		  var value = old;
		  console.log('old',this.state);
		  if('清空'==key) value="JS";
		  else if('删除'==key){
			  if(old.length>2) value =old.substr(0, old.length - 1);//删除
		  }
		  else if(old.length < 6) value=old+key;
		  console.info(value);
		  this.setState({code:value});
	  }
	componentDidMount(){
		console.log('加载自助机信息');
		let fetch = Ajax.get("/api/ssm/base/machine/loginMachine",null,{catch: 3600});
		fetch.then(res => {
			if(res && res.success){
				var machine = res.result||[];
				console.log('加载信息',machine);
				this.setState({
					code : machine.code || '',//编号
					name : machine.name || '',//名称
					mngName : machine.mngName || '',//管理方名称	
					hisUser : machine.hisUser || '',//HIS用户
					ip : machine.ip || '',//IP
					mac : machine.mac || '',//mac地址
					cashbox : machine.cashbox || '0',//是否有钱箱
				});
			}
		})
		
	}
	submit(){
		//console.log(this.state);
		var {bank,code,cashbox} = this.state;
		if(!bank.sx){
			alert('选银行');
			return;
		}else{
			if(!code || code.length < 6 ){
				alert('代码不少于6位');
				return;
			}else{
				var num = code.substring(2,6);
				var  machine = {
						code : bank.sx+num,
						name : bank.name+num,
						mngCode: bank.code,
						mngName: bank.name,
						cashbox:cashbox,
						hisUser:(parseInt(num)+10000)+'',
					};
					console.log('machine',machine);
						let fetch = Ajax.post("/api/ssm/base/machine/register",machine,{catch: 3600});
						fetch.then(res => {
							if(res && res.success){
								 var machine = res.result||[];
								 this.setState({
										code : machine.code,//编号
										name : machine.name,//名称
										mngName : machine.mngName,//管理方名称	
										hisUser : machine.hisUser,//HIS用户
										ip : machine.ip,//IP
										mac : machine.mac,//mac地址
									});
								 console.log('机器',machine);
							}
						})
			}
		}		
	  }
	render(){
		var style1 = {
				border : this.state.cash? '1px soild red' : '1px soild gray'
		}
		return (<NavContainer title='自助机注册' onBack={this.onBack} onHome={this.onHome} >
					{this.renderTitle('详细信息')}
					{this.renderMsg()}
					{this.renderTitle('选择银行')}
					{this.renderBank()}
					{this.renderDate()}
					<NumKeyboard onKeyDown={this.onKeyDown.bind(this)}/>
					<div style={{color:'white',fontSize:'4rem'}}>
						<button onClick = {this.submit} style={{width:'100%',height:'100px',backgroundColor:'red'}}>确定</button>
					</div>
				</NavContainer>);
	}
	renderTitle(title){
		return (
		  <ul className='re_act_title'>
		  	<li className='re_act_line'></li>
		  	<li className='re_act_textwrapper'><span className='re_act_text'>{title}</span></li>
		  </ul>
		)
	 }
	renderMsg(){
		return(
				<Row>
					<Row style={{fontSize:'2rem'}}>
						<Col span={3}>编号 ： </Col>
						<Col span={3}>{this.state.code}</Col>
						<Col span={3}>&nbsp;&nbsp;名称 ： </Col>
						<Col span={3}>{this.state.name}</Col>
						<Col span={3}>&nbsp;&nbsp;银行 ： </Col>
						<Col span={3}>{this.state.mngName}</Col>
						<Col span={3}>&nbsp;&nbsp;HIS用户名 ： </Col>
						<Col span={3}>{this.state.hisUser}</Col>
					</Row>
					<Row style={{fontSize:'2rem'}}>
						<Col span={2}>IP ： </Col>
						<Col span={10}>{this.state.ip}</Col>
						<Col span={2}>&nbsp;&nbsp;MAC ： </Col>
						<Col span={10}>{this.state.mac}</Col>
					</Row>	
				</Row>
		)
	}
	renderBank(){
		var scope = this;//闭包问题，this指针错误
		return (
				<div  style={{height:'200px'}}>
				{
					this.state.banks.map(function(banks,index){
					var logo = logos['b_'+banks.code];
					var bg = (banks.code == scope.state.bank.code)?'1px solid red':'1px solid gray';
					console.log('scope'+bg);
					return (
							<div key = {index}>
							<Col span={8}>
								<Row>
								<div id={banks.code} onClick={() => scope.onSelectBank(banks)} style={{color:'red',backgroundColor:'white',width:'300px',height:'80px',margin:'5px',border:bg}}>
									<Col span={8}><img style={{height:'40px',width:'40px'}} src={logo.src} /></Col>
									<Col span={16}>{banks.name}</Col>	
								</div>
								</Row>	
							</Col>
							</div>
					)}
				)}
				</div>
		)
	}
	
	renderDate(){
		return (
				  <Row style={{fontSize:'2rem'}}>
				  {this.renderTitle('数据')}
				  	<Col span={2}><span>编号 ： </span></Col>
				  	<Col span={4}><Input focus = {true} styles={{height:'2rem'}} value = {this.state.code}/></Col>
				  	<Col span={2}><span></span></Col>
				  	<Col span={2}><span>钱箱 ： </span></Col>
				  	<Col span={4}>
				  		<input type='checkbox' ref='cashbox' checked={this.state.cashbox=='1'?true:false} onClick={this.isExistCashBox}  style={{width:'40px',height:'40px'}} />
				  	</Col>
				  	<Col span={2}><span>区域 ： </span></Col>
				  	<Col span={4}><input type='checkbox'  style={{width:'40px',height:'40px'}}/></Col>
				  </Row>  
				)
	}
	
}

module.exports = Page;