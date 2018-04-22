"use strict";
import moment from 'moment';
import { Component, PropTypes } from 'react';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import { Row, Col,  Modal, Icon }    from 'antd';
import NavContainer from '../../components/NavContainer.jsx';
import Card from '../../components/Card.jsx';
import TimerPage from '../../TimerPage.jsx';
import Button from '../../components/Button.jsx';
class Page extends TimerPage {
	constructor (props) {
		super(props);
		this.onBack = this.bind(this.onBack,this);
	    this.onHome = this.bind(this.onHome,this);
		this.selectType = this.bind(this.selectType,this);
	}
	onBack(){
	  baseUtil.goHome('selectMiTypeBack'); 
	}
	onHome(){
	  baseUtil.goHome('selectMiTypeHome'); 
	}
	selectType(typeCode){//01油田医保（管局） 02 市政医保
		console.info('this ', this );
		if(this.props.onSelect)this.props.onSelect(typeCode);
	}
	render () { 
		const width           = document.body.clientWidth - 36,
		
        containerHeight = document.body.clientHeight - 13.5 * 12,
        height          = containerHeight * 5 / 7,
        cardWidth       = (width - 4 * 1.5 * 12) / 2,
        cardHeight      = height / 2 - 2 * 12,

        imgHeight       = cardHeight / 4,
        upImgWidth      = imgHeight * 600 / 376,
        weixinImgWidth  = imgHeight,
        alipayImgWidth  = imgHeight,
        cashImgWidth    = imgHeight * 600 / 365,

        cardStyle       = {
          height: cardHeight + 'px',
          textAlign: 'center',
          paddingTop: (cardHeight / 4) + 'px',
        };
		
		var fontStyle = {
			position: 'absolute',
			width: '100%',
			textAlign: 'center',
			left: '0',
			fontSize:'6rem',
			bottom: '3rem',
		};
		return (
	      <NavContainer title='选择参保类型' onBack={this.onBack} onHome={this.onHome} >
		      <Row style = {{paddingTop: '120px'}} gutter = {2 * 1.5 * 12} type = 'flex' justify = 'center' >
			      <Col style = {{paddingBottom:  '36px'}} span = {12} >
			      	<Card shadow = {true} style = {cardStyle} onClick = {() => this.selectType('01')} >
			          <font style = {fontStyle} >管局<br/>医保</font>
			        </Card>
			      </Col>
			      <Col style = {{paddingBottom: '36px'}} span = {12} >
			        <Card shadow = {true} style = {cardStyle} onClick = {() => this.selectType('02')} >
			          <font style = {fontStyle}>市政<br/>医保</font>
			        </Card>
			      </Col>
		      </Row>
		  </NavContainer>
	    );
	}
}
module.exports = Page;