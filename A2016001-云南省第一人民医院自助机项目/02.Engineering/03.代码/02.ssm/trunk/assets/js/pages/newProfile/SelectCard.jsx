"use strict";

import { Component, PropTypes } from 'react';
import { Row, Col, Modal, Icon } from 'antd';
import styls from './SelectCard.css';

import baseUtil from '../../utils/baseUtil.jsx';
import logUtil, { log } from '../../utils/logUtil.jsx';

import NavContainer from '../../components/NavContainer.jsx';
import Button from '../../components/Button.jsx';
import Steps from '../../components/Steps.jsx';
import MiType from '../../components/MiType.jsx';

class Page extends Component {
	constructor(props) {
		super(props);
		this.onBack = this.onBack.bind(this);
		this.onHome = this.onHome.bind(this);
		this.selectType = this.selectType.bind(this);
		this.state = {
			miTypeModal: false,
			steps: ['读取医保卡', '校验手机号', '收费', '发卡'],
			cardType: 'mi',
		}
	}
	componentDidMount() {
	}
	onBack() {
		baseUtil.goHome('miCardBack');
	}
	onHome() {
		baseUtil.goHome('miCardHome');
	}
	selectType(type) {
		log('建档-选择希望补的卡 ', type);
		if (this.props.onSelect) this.props.onSelect(type);
	}

	render() {
		var width = document.body.clientWidth - 48;
		var careerWidth = width - 36;
		var modalWinTop = 13;

		return (
			<NavContainer title='选择要补办的卡' onBack={this.onBack} onHome={this.onHome} >
				<Steps steps={this.state.steps} current={1} />
				<Row>
					<Col span={12} onClick={()=>{this.selectType('id')}}>
						<div style={{ height: '38rem', width: '30rem', margin: '3rem auto' }} >
							<div className='profile_scard_block' >补办自费卡</div>
							<Button text = "补办自费卡" onClick={()=>{this.selectType('id')}}/>
						</div>
					</Col>
					<Col span={12} onClick={()=>{this.selectType('mi')}}>
						<div style={{ height: '38rem', width: '30rem', margin: '3rem auto'}} >
							<div className='profile_scard_block' >补办医保关联卡</div>
							<Button text = "补办医保关联卡" onClick={()=>{this.selectType('mi')}}/>
						</div>
					</Col>
				</Row>
			</NavContainer>
		);
	}
}
module.exports = Page;