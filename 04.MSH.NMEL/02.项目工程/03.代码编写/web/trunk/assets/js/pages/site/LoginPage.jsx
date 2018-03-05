import React from 'react';
import TweenOne from 'rc-tween-one';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Form,  Icon, Card,Input, Button } from 'antd';
import QueueAnim from 'rc-queue-anim';
require('../../ajax.jsx'); 

const FormItem = Form.Item;

function handleSubmit() {
	let username = document.getElementById('username').value;
	let usepsswd = document.getElementById('usepsswd').value;
	if(!username ){
		alert("请输入用户名!");
		return;
	}
	if(!username ){
		alert("请输入密码!");
		return;
	}
	Ajax.get('api/bdrp/pre/login')
		.then(res => {
			let encPswd = RSAUtils.encryptedPassword(res.result.random,usepsswd,res.result.modulus1, res.result.exponent1);
			document.getElementById('usepsswd').value = encPswd;
			document.getElementById('loginForm').submit();
	});
}
export default function Page1() {
	
  return (
    <ScrollOverPack scrollName="page1" className="content-wrapper page" playScale={1} replay >
      <TweenOne key="image" className="imagelogin image-wrapper" animation={{ x: 0, opacity: 1, duration: 550 }}
        style={{ transform: 'translateX(-100px)', opacity: 0 }} hideProps={{ reverse: true }}
      />

      <QueueAnim className="text-wrapper" delay={300} key="text" duration={550} leaveReverse
        hideProps={{ child: null }}
      >
        <span className="line" key="line" />
        	<Card title="欢迎" style={{ width: 300 }}>
        		<Form horizontal id="loginForm" action="bdrp/login" method="POST" >
			        <div style={{ margin: '24px 0' }} />
			        <Input id="username" name="username" placeholder="邮箱或手机号" />
			        <div style={{ margin: '24px 0' }} />
			        <Input type="password" id="usepsswd" name="usepsswd" placeholder="密码" />
			        <div style={{ margin: '24px 0' }} />
			        <div key="button">
			          <Button type="primary" size="large" onClick={handleSubmit}  >
			            进入
			            <Icon type="right" />
			          </Button>
			        </div>
		        </Form>
	      </Card>
      </QueueAnim>
    </ScrollOverPack>
  );
}
