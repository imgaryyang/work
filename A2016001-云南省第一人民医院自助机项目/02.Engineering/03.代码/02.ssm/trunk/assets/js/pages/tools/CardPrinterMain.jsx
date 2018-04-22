import React, { PropTypes } from 'react';
import { Row, Col, Icon  }   from 'antd';
import MenuBlock from '../../components/homepage/MenuBlock.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import polyfill from 'babel-polyfill';
import cardPrinter from '../../utils/cardPrinterUtil.jsx';
class CardPrinterMain extends React.Component {

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onHome = this.onHome.bind(this);
    
    this.moveCardToReader = this.moveCardToReader.bind(this);
    this.moveCardToOut = this.moveCardToOut.bind(this);
    this.readAndOut = this.readAndOut.bind(this);
    this.moveToBasket = this.moveToBasket.bind(this);
    this.reStart = this.reStart.bind(this);
    this.print = this.print.bind(this);
    this.makeOperator = this.makeOperator.bind(this);
    this.cleanPrinter = this.cleanPrinter.bind(this);
    this.state = {
    		
    }
  }
  
  async moveCardToReader(){// 移动至读卡区
    baseUtil.notice('测试开始');
    await baseUtil.sleep(500);
	try{
		cardPrinter.moveToReader();
		baseUtil.notice('移动至读卡区成功');
		await baseUtil.sleep(500);
	}catch(e){
		console.info(e);
		baseUtil.warning('移动至读卡区异常');
	}  
  }
  async moveCardToOut(){// 移动至出口
	  baseUtil.notice('测试开始');
	  await baseUtil.sleep(500);
		try{
			cardPrinter.moveToReader();
			baseUtil.notice('移动至读卡区成功');
			await baseUtil.sleep(500);
		}catch(e){
			console.info(e);
			baseUtil.warning('移动至读卡区异常');
		} 
		
  }
  async readAndOut(){// 读卡吐卡
	baseUtil.notice('测试开始');
	await baseUtil.sleep(500);
  	try{
  		const state  = cardPrinter.checkPrinterStatus();
  		if(state == 0){
  			baseUtil.notice('当前状态'+state);
  			await baseUtil.sleep(500);
    	}else{
    		baseUtil.warning('当前状态'+state);
    		return;
    	}
	}catch(e){
		console.info(e);
		baseUtil.warning('读取卡状态出错');
		return;
	} 
  	try{
  		cardPrinter.moveToReader();
		baseUtil.notice('移动至非接读卡区成功');
		await baseUtil.sleep(500);
	}catch(e){
		console.info(e);
		baseUtil.warning('移动至非接读卡区异常');
		return;
	} 
	try{
		var medicalCardNo  = cardPrinter.readCardNo();
		baseUtil.notice('读取卡号成功：'+medicalCardNo);
		await baseUtil.sleep(500);
	}catch(e){
		console.info(e);
		baseUtil.warning('读取卡号异常');
		return;
	}
	try{
		cardPrinter.moveToOut();
  		baseUtil.notice('移动至出口：成功');
  		await baseUtil.sleep(500);
	}catch(e){
		console.info(e);
		baseUtil.warning('移动至出口异常');
		return;
	}
  }
  async moveToBasket(){// 排卡
	baseUtil.notice('测试开始');
	await baseUtil.sleep(500);
	try{
		cardPrinter.moveToBasket();
		baseUtil.notice('排卡完毕');
		await baseUtil.sleep(500);
	}catch(e){
		console.info(e);
		baseUtil.warning('排卡异常');
	}
  }
  async reStart(){// 重启
	baseUtil.notice('测试开始');
	await baseUtil.sleep(500);
	try{
		cardPrinter.reset();
		baseUtil.notice('重启完毕');
		await baseUtil.sleep(500);
	}catch(e){
		console.info(e);
		baseUtil.warning('重启打印机异常');
	} 
  }
  async print(){// 打印测试
	baseUtil.notice('测试开始');
	await baseUtil.sleep(500);
  	try{
  		const state  = cardPrinter.checkPrinterStatus();
  		if(state == 0){
  			baseUtil.notice('当前状态'+state);
  			await baseUtil.sleep(500);
	    	}else{
	    		baseUtil.warning('当前状态'+state);
	    		return;
	    	}
		}catch(e){
			console.info(e);
			baseUtil.warning('读取状态出错');
			return;
		} 
  	try{
  		cardPrinter.moveToReader();
  		baseUtil.notice('移动至非接读卡区成功');
  		await baseUtil.sleep(500);
		}catch(e){
			console.info(e);
			baseUtil.warning('移动至非接读卡区异常');
			return;
		} 
		try{
  		var medicalCardNo  = cardPrinter.readCardNo();
  		baseUtil.notice('读取卡号成功：'+medicalCardNo);
  		await baseUtil.sleep(500);
		}catch(e){
			console.info(e);
			baseUtil.warning('读取卡号异常');
			return;
		}
		try{
			cardPrinter.setStandbyParameter();
			baseUtil.notice('设置基本参数成功');
			await baseUtil.sleep(500);
		}catch(e){
			console.info(e);
			baseUtil.warning('设置基本参数异常');
			return;
		}
		try{//
			var ret = cardPrinter.testPrintCard('姓名','1234567890');
			baseUtil.notice('发送打印指令成功');
		}catch(e){
			console.info(e);
			baseUtil.warning('发送打印指令异常');
			return;
		}
  }
  async cleanPrinter(){// 打印测试
	baseUtil.notice('清洁开始');
	await baseUtil.sleep(500);
	try{
		cardPrinter.clean();
		baseUtil.notice('清洁完毕');
		await baseUtil.sleep(500);
	}catch(e){
		console.info(e);
		baseUtil.warning('清洁打印机异常');
	}  
  }
  async makeOperator(){// 制作运维卡
  }
  onBack(){
	  baseUtil.goOptHome('testCardBack');
  }
  onHome(){
	  baseUtil.goOptHome('testCardHome');
  }
  render() {
	const wsHeight  = document.body.clientHeight * 2 / 3;
	var defaultMenu = {id : "1",alias : "排卡",code : "mCardCreate",colspan : "1",rowspan : "1",color : "#DB5A5A",icon : "medicalCard",};
    return (
      <NavContainer title='卡管理' onBack={this.onBack} onHome={this.onHome} >
        <Row  >
          <Col span = {4} style = {{padding: '1rem'}} >
            <MenuBlock onSelect = {this.moveToBasket} menu = {{...defaultMenu,alias : "排卡",}} /> 
          </Col>
          <Col span = {4} style = {{padding: '1rem'}} >
            <MenuBlock onSelect = {this.reStart} menu = {{...defaultMenu,alias : "重启",}} /> 
          </Col>
          <Col span = {4} style = {{padding: '1rem'}} >
	        <MenuBlock onSelect = {this.print} menu = {{...defaultMenu,alias : "打印测试",}} /> 
	      </Col>
	      <Col span = {4} style = {{padding: '1rem'}} >
	        <MenuBlock onSelect = {this.readAndOut} menu = {{...defaultMenu,alias : "发卡测试",}} /> 
	      </Col>
	      <Col span = {4} style = {{padding: '1rem'}} >
	        <MenuBlock onSelect = {this.moveCardToOut} menu = {{...defaultMenu,alias : "移动至出口",}} /> 
	      </Col>
	      <Col span = {4} style = {{padding: '1rem'}} >
	        <MenuBlock onSelect = {this.cleanPrinter} menu = {{...defaultMenu,alias : "清洁打印机",}} /> 
	      </Col>
        </Row>
       </NavContainer>
    );
  }
}
module.exports = CardPrinterMain;