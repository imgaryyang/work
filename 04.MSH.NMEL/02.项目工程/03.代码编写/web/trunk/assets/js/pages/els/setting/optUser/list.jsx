'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Steps, Form, Input, Row, Col, Button } from 'antd';
const Step = Steps.Step;
const FormItem = Form.Item;

class ChangeNumForm extends Component {
	constructor (props) {
		super(props);

		// this.state = {
		// 	stepIdx = 0,
		// 	steps = steps,
  //   	};
	}

	render() {
		const { getFieldProps } = this.props.form;
		let phone = '186****3949';

		const formItemLayout = {
			labelCol: { span: 7 , offset: 3 },
			wrapperCol: { span: 5 },
		};

		return (
				<Form horizontal form={this.props.form} >
						<FormItem label = '原手机号' {...formItemLayout} >
							<Input placeholder={phone} {...getFieldProps('oldPhoneNum')} disabled='true' />
						</FormItem>
						<FormItem label = '登录密码' {...formItemLayout} >
							<Input type='password' placeholder='请输入密码' {...getFieldProps('password')} />
						</FormItem>
						<FormItem wrapperCol={{ span: 12, offset: 9 }}>
							<Button type="primary" >下 一 步</Button>
						</FormItem>
				</Form>
		)
	}

}

ChangeNumForm = Form.create()(ChangeNumForm);

class ChangeNum extends Component {
	constructor (props) {
		super(props);

		const steps = [{
		  title: '身份验证',
		}, {
		  title: '输入新手机号',
		}, {
		  title: '完成',
		}].map((s, i) => <Step key={i+1} title={s.title} description={s.description} />);

		this.state = {
			stepIdx : 0,
			steps : steps
    	};

	}

	componentWillMount() {
	}

	render () { 
		
		// switch () {
		// case 0 : 
		// stepContent = <div> 
		// case 1 :
		// case 2 :
		// default : return <div></div>
		// }

		console.info('-----------UpdatePhone--------------');
		return (
			<div>
				<Col span={16} offset={4}>
					<div style={{ margin : '20px' }}>
						<Steps current={this.state.stepIdx}>
							{this.state.steps}
						</Steps>
					</div>
				</Col>
				<Col>
					<ChangeNumForm></ChangeNumForm>
				</Col>
			</div>

    	);
  }
}

module.exports = ChangeNum;