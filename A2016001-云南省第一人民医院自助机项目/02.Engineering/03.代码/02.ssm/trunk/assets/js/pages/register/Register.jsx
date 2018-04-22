"use strict";
import React, { PropTypes }   from 'react';
import { Row, Col, Modal , Checkbox, Select, TreeSelect }  from 'antd';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import Button from '../../components/Button.jsx';
import Input from '../../components/Input.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import NumKeyboard from '../../components/keyboard/NumKeyboard.jsx';
import Numbar from '../../components/keyboard/Numbar.jsx';
var b_0103 = './images/bank/0103.png';
var b_0104 = './images/bank/0104.png';
var b_0301 = './images/bank/0301.png';
var b_0306 = './images/bank/0306.png';
var b_0308 = './images/bank/0308.png';
var b_6509 = './images/bank/6509.png';
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

const logos = Object.freeze({
	"b_0103" : {src : b_0103},
	"b_0104" : {src : b_0104},
	"b_0301" : {src : b_0301},
	"b_0306" : {src : b_0306},
	"b_0308" : {src : b_0308},
	"b_6509" : {src : b_6509}
});

class Register extends React.Component{
	constructor(props){
		super(props);
		this.onBack = this.onBack.bind(this);
		this.onHome = this.onHome.bind(this);
		this.loadAreas = this.loadAreas.bind(this);
		this.loginMachine = this.loginMachine.bind(this);
		this.onSelectBank = this.onSelectBank.bind(this);
		this.onSelectArea = this.onSelectArea.bind(this);
		this.onChangeCashBox = this.onChangeCashBox.bind(this);
		this.onChangeFloor = this.onChangeFloor.bind(this);
		this.onChangeHisUser = this.onChangeHisUser.bind(this);
		this.renderTitle = this.renderTitle.bind(this);
		this.renderMsg = this.renderMsg.bind(this);
		this.renderBank = this.renderBank.bind(this);
		this.readerRegister = this.readerRegister.bind(this);
		this.register = this.register.bind(this);
		this.arrayToTree = this.arrayToTree.bind(this);
		this.state = {
				code : '',//编号
				name : '',//名称
				mngName : '',//管理方名称
				hisUser : '',//HIS用户
				ip : '',//IP
				mac : '',//mac地址
				areaTrees : [],//区域树数据
				areas: [],//区域
				area: '', 
				floor : '',//楼层
				address: '',
				banks : [
				         {sx:'GF',name:'广发银行',code:'0306'},
				         {sx:'NH',name:'农业银行',code:'0103'},
				         {sx:'ZH',name:'招商银行',code:'0308'},
				         {sx:'NX',name:'云南农信',code:'6509'},
				         {sx:'JT',name:'交通银行',code:'0301'},
				         {sx:'ZG',name:'中国银行',code:'0104'}
			         ],
				bank:{},
				cashbox:'0',
				machine: {},
		}
	}
	componentWillMount(){
		let fetch = Ajax.get("/api/ssm/base/area/list",null,{catch: 3600});
		fetch.then(res=>{
			if(res && res.success){
				const areas = res.result||[];
				const areaTrees = this.arrayToTree(areas);
				this.setState({
					areaTrees: areaTrees || [],
				});
			}
		});
	}
	componentDidMount(){
		var {machine,banks} = this.state;
		if(!machine || !machine.id){
			let fetch = Ajax.post("/api/ssm/base/machine/login",null,{catch: 3600});
			fetch.then(res => {
				if(res && res.success){
					var _machine = res.result||[];
					var address = _machine.address;
					var areaArr = address.split('-');
					var _bank = {};
					for(var bk of banks){
						if(bk.code == _machine.mngCode){
							_bank = bk; 
							break;
						}
					}
					this.setState({
						code : _machine.code || '',//编号
						name : _machine.name || '',//名称
						mngName : _machine.mngName || '',//管理方名称	
						hisUser : _machine.hisUser || '',//HIS用户
						ip : _machine.ip || '',//IP
						mac : _machine.mac || '',//mac地址
						cashbox : _machine.cashbox || '0',//是否有钱箱
						address : _machine.address || '',
						area : areaArr[1],
						floor : areaArr[2],
						machine : _machine,
						bank: _bank,
					});
				}
			});
		}
	}
	onBack(){
		baseUtil.goOptHome('cashBack');
	}
	onHome(){
		baseUtil.goOptHome('cashHome');
	}
	loadAreas(){
		
	}
	loginMachine(){
	}
	
	register(){
		var {bank,code,cashbox,area,floor,hisUser} = this.state;
		if(!bank.sx){
			baseUtil.warning('选银行');
			return;
		}else{
			if(!code || code.length < 4 ){
				baseUtil.warning('代码不少于4位');
				return;
			}else if(code.length>4){
				baseUtil.warning('请清空重新输入编号');
			}else{
				var  machine = {
						code : bank.sx + code,
						name : bank.name + code,
						mngCode: bank.code,
						mngName: bank.name,
						cashbox: cashbox,
						area: area,
						floor: floor,
						hisUser: hisUser,
				};
				let fetch = Ajax.post("/api/ssm/base/machine/register/"+area+"/"+floor, machine, {catch: 3600});
				fetch.then(res => {
					if(res && res.success){
						var _machine = res.result || [];
						this.setState({
							machine: _machine,
						});
						baseUtil.notice("注册成功");
					}
				})
			}
		}		
	}
	
	onSelectBank(bank){
		this.setState({
			bank : bank,//并不能够马上取到值，需要回掉一下
		},()=>{
			console.log('选择的银行是：'+this.state.bank.name+'****'+this.state.cashbox);
		});
	}
	onChangeCashBox(){
		this.setState({
			cashbox : '1',
		})
	}
	onKeyDown(key){
		var old = this.state.code;
		var value = old;
		if('清空'==key) value="";
		else if('删除'==key)value =old.substr(0, old.length - 1);//删除
		else if(old.length < 4) value=old+key;
		this.setState({code:value});
	}
	
	onSelectArea(area){
		this.setState({
			area: area,
		});
	}
	onChangeFloor(event){
		this.setState({
			floor: event.target.value,
		});
	}
	onChangeHisUser(event){
		this.setState({
			hisUser: event.target.value,
		});
	}
	arrayToTree(array){
		var map={},root=[];
		for(var obj of array){
			obj.children = [];
			map[obj.id] = obj; 
		}
		for(var obj of array){
			if(obj.parent){
				var parent = map[obj.parent];
				if(parent){
					parent.children.push(obj);
					obj.parent=parent;
				}else{root.push(obj);}
			}else{
				root.push(obj);
			}
		}
		return root;
	}
	render(){
		var style1 = {
				border : this.state.cash? '1px soild red' : '1px soild gray'
		}
		return (
				<NavContainer title='自助机注册' onBack={this.onBack} onHome={this.onHome} >
				{this.renderTitle('详细信息')}
				{this.renderMsg()}
				{this.renderTitle('选择银行')}
				{this.renderBank()}
				{this.readerRegister()}
				<Numbar onKeyDown={this.onKeyDown.bind(this)}/>
				<div style={{color:'white',fontSize:'2rem'}}>
					<button onClick = {this.register} style={{width:'100%',height:'100px',backgroundColor:'red'}}>确定</button>
				</div>
				</NavContainer>
		);
	}
	renderTitle(title){
		return (
				<ul className='re_act_title'>
				<li className='re_act_line'></li>
				<li className='re_act_textwrapper'><span className='re_act_text'>{title}</span></li>
				</ul>
		);
	}
	renderMsg(){
		return(
				<Row>
				<Row style={{fontSize:'2rem',height:'50px'}}>
					<Col span={3}>编号 ： </Col>
					<Col span={3}>{this.state.code}</Col>
					<Col span={3}>&nbsp;&nbsp;名称 ： </Col>
					<Col span={6}>{this.state.name}</Col>
					<Col span={2}>&nbsp;&nbsp;银行 ： </Col>
					<Col span={7}>{this.state.mngName}</Col>
				</Row>
				<Row style={{fontSize:'2rem',height:'50px'}}>
					<Col span={3}>HIS用户名 ： </Col>
					<Col span={3}>{this.state.hisUser}</Col>
					<Col span={3}>&nbsp;&nbsp;IP ： </Col>
					<Col span={6}>{this.state.ip}</Col>
					<Col span={2}>&nbsp;&nbsp;MAC ： </Col>
					<Col span={7}>{this.state.mac}</Col>
				</Row>	
				</Row>
		);
	}
	renderBank(){
		var {banks, bank} = this.state;
		var scope = this;
		return (
				<div  style={{height:'200px'}}>
				{
					banks.map(function(bk,index){
						var logo = logos['b_'+bk.code];
						var bg = (bk.code == bank.code)?'3px solid red':'3px solid gray';
						return (
								<div key = {index}>
								<Col span={8}>
								<Row style={{height:'100px'}}>
								<div id={bk.code} onClick={() => scope.onSelectBank(bk)} style={{color:'red',backgroundColor:'white',width:'300px',height:'50px',margin:'10px',border:bg}}>
								<Col span={8}><img style={{height:'40px',width:'40px'}} src={logo.src} /></Col>
								<Col span={16}>{bk.name}</Col>	
								</div>
								</Row>	
								</Col>
								</div>
						)}
					)}
				</div>
		);
	}
	readerRegister(){
		const loop = data => data.map((item) => {
			if (item.children && item.children.length) {
				return <TreeNode key={item.code} title={item.name} value={item.code} >{loop(item.children)}</TreeNode>;
			}
			return <TreeNode key={item.code} title={item.name} value={item.code} />;
		});
		return (<div style={{height:'180px'}}>
				<Row style={{fontSize:'2rem'}}>
					{this.renderTitle('注册信息')}
					<Col span={2}><span>&nbsp;&nbsp;编号 ： </span></Col>
					<Col span={4}><Input focus = {true}  value = {this.state.code} /></Col>
					
					<Col span={2}><span>&nbsp;&nbsp;钱箱 ： </span></Col>
					<Col span={2}>
						<input type='checkbox' ref='cashbox' checked={this.state.cashbox=='1'?true:false} onClick={this.onChangeCashBox}  style={{width:'30px',height:'30px'}} />
					</Col>
					<Col span={2}><span>&nbsp;&nbsp;楼栋 ： </span></Col>
					<Col span={4}>
						<TreeSelect value={this.state.area} treeDefaultExpandAll onSelect={this.onSelectArea}  size = 'large' style={{width:'200px',height:'40px'}}>
						{loop(this.state.areaTrees)}
					</TreeSelect>	
					</Col>
					<Col span={2}><span>&nbsp;&nbsp;楼层 ： </span></Col>
					<Col span={2}>
						<input value={this.state.floor} style={{width:'100px',height:'40px'}} onChange={this.onChangeFloor} />
					</Col>
					<Col span={2}><span>HIS用户 ： </span></Col>
					<Col span={2}>
						<input value={this.state.hisUser} style={{width:'100px',height:'40px'}} onChange={this.onChangeHisUser} />
					</Col>
				</Row> 
				</div>
		)
	}
}

module.exports = Register;