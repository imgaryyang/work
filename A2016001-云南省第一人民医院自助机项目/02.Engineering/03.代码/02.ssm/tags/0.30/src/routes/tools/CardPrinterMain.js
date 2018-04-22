import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import Confirm from '../../components/Confirm';
import styles from './WriteCard';
import {WorkSpace, Card,MenuBlock, Button, Input, NumKeyboard} from '../../components';

class CardPrinterMain extends React.Component {

  constructor(props) {
    super(props);
    this.moveCardToReader = this.moveCardToReader.bind(this);
    this.moveCardToOut = this.moveCardToOut.bind(this);
    this.readAndOut = this.readAndOut.bind(this);
    this.moveToBasket = this.moveToBasket.bind(this);
    this.reStart = this.reStart.bind(this);
    this.print = this.print.bind(this);
    this.makeOperator = this.makeOperator.bind(this);
    this.cleanPrinter = this.cleanPrinter.bind(this);
  }
  state = {
  };
  
  moveCardToReader(){//移动至读卡区
	  this.props.dispatch({
		  type:'device/moveCardToReader',
	  }); 
  }
  moveCardToOut(){//移动至出口
	  this.props.dispatch({
		  type:'device/moveCardToOut',
	  }); 
  }
  readAndOut(){//读卡吐卡
	  this.props.dispatch({
		  type:'device/readAndOut',
	  }); 
  }
  moveToBasket(){//排卡
	  this.props.dispatch({
		  type:'device/moveToBasket',
	  });
  }
  reStart(){//重启
	  this.props.dispatch({
		  type:'device/reStart',
	  });
  }
  print(){//打印测试
	  this.props.dispatch({
		  type:'device/printCard',
	  }); 
  }
  cleanPrinter(){//打印测试
	  this.props.dispatch({
		  type:'device/cleanPrinter',
	  }); 
  }
  makeOperator(){//打印测试
	  this.props.dispatch({
		  type:'device/makeOperator',
		  payload:{index:0}
	  }); 
  }
  render() {
	const wsHeight  = config.getWS().height * 2 / 3;
    return (
      <WorkSpace height = {wsHeight + 'px'} style = {{padding: '2rem'}} >
        <Row>
          <Col span = {4} style = {{paddingRight: '1rem'}} >
            <MenuBlock onSelect = {this.moveToBasket} 
            	menu = {{"id" : "1","alias" : "排卡","code" : "mCardCreate",
                "colspan" : "1",
                "rowspan" : "1",
                "color" : "#DB5A5A",
                "icon" : "medicalCard",}} >
            </MenuBlock>	 
          </Col>
          <Col span = {4} style = {{paddingRight: '1rem'}} >
            <MenuBlock onSelect = {this.reStart} 
            	menu = {{"id" : "1","alias" : "重启","code" : "mCardCreate",
                "colspan" : "1",
                "rowspan" : "1",
                "color" : "#DB5A5A",
                "icon" : "medicalCard",}} >
            </MenuBlock>	 
          </Col>
          <Col span = {4} style = {{paddingRight: '1rem'}} >
	          <MenuBlock onSelect = {this.print} 
	          	menu = {{"id" : "1","alias" : "打印测试","code" : "mCardCreate",
	              "colspan" : "1",
	              "rowspan" : "1",
	              "color" : "#DB5A5A",
	              "icon" : "medicalCard",}} >
	          </MenuBlock>	 
	      </Col>
	      <Col span = {4} style = {{paddingRight: '1rem'}} >
	          <MenuBlock onSelect = {this.readAndOut} 
	          	menu = {{"id" : "1","alias" : "发卡测试","code" : "mCardCreate",
	              "colspan" : "1",
	              "rowspan" : "1",
	              "color" : "#DB5A5A",
	              "icon" : "medicalCard",}} >
	          </MenuBlock>	 
	      </Col>
	      <Col span = {4} style = {{paddingRight: '1rem'}} >
	          <MenuBlock onSelect = {this.moveCardToOut} 
	          	menu = {{"id" : "1","alias" : "移动至出口","code" : "mCardCreate",
	              "colspan" : "1",
	              "rowspan" : "1",
	              "color" : "#DB5A5A",
	              "icon" : "medicalCard",}} >
	          </MenuBlock>	 
	      </Col>
	      <Col span = {4} style = {{paddingRight: '1rem'}} >
	          <MenuBlock onSelect = {this.cleanPrinter} 
	          	menu = {{"id" : "1","alias" : "清洁打印机","code" : "cleanPrinter",
	              "colspan" : "1",
	              "rowspan" : "1",
	              "color" : "#DB5A5A",
	              "icon" : "medicalCard",}} >
	          </MenuBlock>	 
	      </Col>
          <Col span = {6} style = {{paddingLeft: '1rem'}} >
          </Col>
        </Row>
        <Confirm info = {""} visible = {false}  />
       </WorkSpace>
    );
  }
}
export default connect(({device}) => ({device}))(CardPrinterMain);


//<Col span = {4} style = {{paddingRight: '1rem'}} >
//<MenuBlock onSelect = {this.makeOperator} 
//	menu = {{"id" : "1","alias" : "制作运维卡","code" : "mCardCreate",
//    "colspan" : "1",
//    "rowspan" : "1",
//    "color" : "#DB5A5A",
//    "icon" : "medicalCard",}} >
//</MenuBlock>	 
//</Col>
