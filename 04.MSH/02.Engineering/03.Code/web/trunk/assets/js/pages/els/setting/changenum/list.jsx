'use strict';

import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Steps, Form, Input, Row, Col, Button, View, Icon, Card, Spin } from 'antd';
const Step = Steps.Step;
const FormItem = Form.Item;


class Step1 extends Component {
	constructor (props) {
		super(props);

        this.state = {
            loading: false,
        };
	}

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }

            /**
            *   下一步
            */   
            this.props.next(this.props.mobile);
        });
    }

    componentWillMount() {

    }

	render() {
		const { getFieldProps } = this.props.form;

        const passwdProps = getFieldProps('passwd', {
            rules: [
                { required: true, whitespace: true, message: '请填写密码' },
            ],
        });

		const formItemLayout = {
			labelCol: { span: 4 , offset: 7 },
			wrapperCol: { span: 4 },
		};

		return (
            <Spin spinning={this.state.loading}>
				<Form horizontal form={this.props.form}  >
					<FormItem label = '原手机号' {...formItemLayout} >
						<Input placeholder={this.props.mobile} {...getFieldProps('oldPhoneNum')} disabled='true' />
					</FormItem>
					<FormItem label = '登录密码' {...formItemLayout} required>
						<Input type='password' placeholder='请输入密码' {...passwdProps} />
					</FormItem>
					<FormItem wrapperCol={{ offset: 11 }}>
						<Button type="primary" onClick={(e)=>this.handleSubmit(e)} >下 一 步</Button>
					</FormItem>
				</Form>
            </Spin>
		)
	}
}

const defTime = 60;
var sh = 0;
class Step2 extends Component {

    constructor (props) {
        super(props);
        this.state = {
            time: defTime,
            wait: false,
            loading: false,
        };
    }

    handleSubmit(m) {
        m.preventDefault();
        /**
        *   验证短信验证码 + 更新手机号
        */
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log(errors);
                return;
            }
            this.setState({
                loading: true,
            });
            // this.save(values);

            let url = 'api/bdrp/org/optuser/els/update';
            try {
                this.props.optUser.mobile = values.mobile;
                let fetch = Ajax.put(url, this.props.optUser, {catch: 3600});
                fetch.then(res => {
                    let mobile = res.result ? res.result.mobile : '';
                    this.setState({
                        loading: false,
                    });

                    this.props.next(mobile);

                    return res;
                });
            } catch(e) {
                this.setState({
                        loading: false,
                    });
                console.info(e.message);
            }
        });
    }

    getVerifyCode( ) {

        /**
        *   1、获取短信验证码
        */
        try{
            this.props.form.validateFields( ['mobile'], {
                rules: [{ required: true, whitespace: true, message: '请输入新手机号' }]
            }, 
                (errors, values) => {
                if (!!errors) {
                    return;
                }

                this.setState({
                    wait: true,
                });

                sh = setInterval( this.refreshTime.bind(this), 1000 );
                // this.save(values);
            });
        } catch (e) {
            console.log(e.message);
        }
    }

    refreshTime() {

        let time = this.state.time;

        if ( time > 0 ) {
            this.setState({
                time: time - 1,
            })
        } else {
            clearInterval(sh);
            this.setState({
                time: defTime,
                wait: false,
            })
        }

    }

    render() {
        const { getFieldProps } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4, offset: 6 },
            wrapperCol: { span: 5 },
        };

        const verifyCodeProps = getFieldProps('verifyCode', {
            rules: [
                { required: true, whitespace: true, message: '请输入验证码' },
            ],
        });

        const mobileProps = getFieldProps('mobile', {
            rules: [
                { required: true, whitespace: true, message: '请输入新手机号' },
                { min: 11, message: '手机号码不足11位' },
            ],
        });

        let buttonText = null;
        if ( this.state.wait ) {
            buttonText = this.state.time + '后重新获取';
        } else {
            buttonText = '获取验证码';
        }

        return (
            <Spin spinning={this.state.loading}>
                <Form horizontal form={this.props.form} >
                    <FormItem label = '新手机号' {...formItemLayout} required>
                        <Input maxLength={11} placeholder='输入手机号' {...mobileProps} />
                    </FormItem>
                    <FormItem label = '验证码' {...formItemLayout} required>
                        <Col span={11}>
                            <FormItem>
                                <Input maxLength={6} placeholder='验证码' {...verifyCodeProps} />
                            </FormItem>
                        </Col>
                        <Col span={11} offset={1}>
                            <FormItem>
                                <Button size='small' disabled={this.state.wait} onClick={()=>this.getVerifyCode()} >{buttonText}</Button>
                            </FormItem>
                        </Col>
                    </FormItem>
                    <FormItem wrapperCol={{ offset: 11 }}>
                        <Button type="primary" onClick={(m)=>this.handleSubmit(m)} >下 一 步</Button>
                    </FormItem>
                </Form>
            </Spin>
        )
    }
}

Step2.propTypes = {
    optUser: PropTypes.object.isRequired,
};
Step2.defaultProps = {
    optUser: null,
};

class Step3 extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Row type='flex' justify='center' align='middle'>
                    <Col>
                        <Icon type='check-circle' style={{fontSize: 30, color: 'rgba(76,217,100,1)'}} />
                        <text style={{marginLeft: 5, fontSize: 15, color: 'rgba(76,217,100,1)'}}>修改成功</text>
                    </Col>
                </Row>
                <Row justify='center' type='flex'>
                    <Col style={{marginTop: 40,}}>
                        <text style={{fontSize: 20, color: 'rgba(76,217,100,1)'}}>手机号：{this.props.mobile}</text>
                    </Col>
                </Row>
            </div>
            )
    }
}

Step3.propTypes = {
    mobile: PropTypes.string.isRequired,
};
Step3.defaultProps = {
    mobile: null,
};


Step1 = Form.create()(Step1);
Step2 = Form.create()(Step2);

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
			stepIdx: 0,
			steps: steps,
            optUser: null,
            loading: false,
    	};
	}

	componentWillMount() {
        let url = 'api/bdrp/org/optuser/get/' + '8a8c7dde55a5331d0155a534f3250000';
        this.setState({
            loading: true,
        });
        let fetch = Ajax.get(url, null, {catch: 3600});
        fetch.then(res => {
            this.setState({
                optUser: res,
                loading: false,
            });
            return res;
        });
	}

    handleSubmit(mobile) {

        let optUser = this.state.optUser;
        optUser.mobile = mobile;

        this.setState({
            stepIdx: this.state.stepIdx + 1,
            optUser: optUser,
        });
    }

	render ( ) { 
        let mobile = this.state.optUser ? this.state.optUser.mobile : '';
        let stepContent = null;
		switch ( this.state.stepIdx ) {
			case 0 : 
				stepContent = <Step1 mobile={mobile} next={(m)=>this.handleSubmit(m)} /> ;
                break;
			case 1 :
                stepContent = <Step2 optUser={this.state.optUser} next={(m)=>this.handleSubmit(m)} /> ;
                break;
			case 2 :
                stepContent = <Step3 mobile={mobile} />;
                break;
			default : 
                stepContent = null ;
                break;
		}

		return (
            <Spin spinning={this.state.loading}>
                <Row type='flex' justify='center'>
                    <Col span={20}>
                        <Card>
                            <div style={{ margin: '10px 30px', height: 60 }}>
                                <Steps current={this.state.stepIdx}>
                                    {this.state.steps}
                                </Steps>
                            </div>
                            <div style={{height: 1, backgroundColor: '#dcdce1'}}>
                            </div>
                            <div style={{marginTop: 40}}>
                                {stepContent}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Spin>
    	);
	}
}

module.exports = ChangeNum;

// <Card >
//                 <Row type='flex' justify='center'>
//                     <Col span={16}>
//                         <div style={{ margin : '20px', height: 60 }}>
//                             <Steps current={this.state.stepIdx}>
//                                 {this.state.steps}
//                             </Steps>
//                         </div>
//                     </Col>
//                 </Row>
//                 <Row justify='center'>
//                     <Col>
//                         {stepContent}
//                     </Col>
//                 </Row>
//                 </Card>