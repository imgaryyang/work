"use strict";

import { Component, PropTypes } from 'react';
import classnames from 'classnames';
import {Icon,Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class Page extends Component {
	constructor (props) {
		super(props);
		this.state={
			currentUser:{name:'',id:''},
			modules:this.props.route.modules
		}
	}
	onclick(){
		
	}
	componentWillMount () {
		let fetch = Ajax.get("/api/el/base/user/my", null, {catch: 3600});
		fetch.then(res => {
			let user = res.result,total=res.total,start=res.start;
			this.state.currentUser = user;
	    	return res;
		}).then(()=>{
			this.setState({currentUser:this.state.currentUser});
		});
	}
	handleMenuClick(e) {
		console.log('click ', e);
		if(e.key == 'setting'){
			
		}
		if(e.key == 'changePWD'){
					
		}
		if(e.key == 'logout'){
			this.logout();
		}
		if(e.key == 'feedback'){
			this.feedback();
		}
	    this.setState({
	      current: e.key,
	    });
	}
	logout(){
		document.location.href="/api/bdrp/logout";
	}
	feedback(){
		console.info('feedback ');
	}
	render () { 
		let width = ((this.state.modules.length+1)*100)+"px"
		return (
				<div>
					<header>
						<div className="header">
							<div className="header-user">
							 <Menu onClick={this.handleMenuClick.bind(this)} selectedKeys={[this.state.current]} mode="horizontal" 
								 style={{backgroundColor:"#3186e6",borderBottomColor : "#3186e6",marginTop:'10px'}}>
						        <SubMenu title={<span><Icon type="user" />{this.state.currentUser.name}</span>}>
						            <Menu.Item key="setting">设置</Menu.Item>
						            <Menu.Item key="changePWD">修改密码</Menu.Item>
						            <Menu.Item key="feedback">反馈意见</Menu.Item>
						            <Menu.Item key="logout">退出</Menu.Item>
						        </SubMenu>
						      </Menu>
							</div> 
							<div className="header-title" href="#/home">
								<img src="../../web/images/logo-30.png"/>
								<a>民生钱包管理系统</a>
							</div> 
						</div>
						<div className="top-nav">
							<div className="top-nav-menu" style={{width:width}}>
								{
									this.state.modules.map(function (module,nindex) {
			    						return (
			    							<li className="top-nav-item"><a href={"#"+module.path}>
			    								<Icon type="mail" />{module.name}</a>
			    							</li>
			    						)
			    		    		})
								}
								<li className="top-nav-item"><a href="/store/index.php">
									<Icon type="shopping-cart" />商城</a>
								</li>
							</div>
						</div>
					</header>
					{this.props.children}
					<div className="ant-layout-footer">
			        </div>
				</div>
			);
		}
	}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;

//<div className="pure-g top-navmenu">
//{
//	this.props.route.menus.map(function (menu,nindex) {
//		return (
//			<li className="pure-u-1-4 pure-menu-item"><a href={"#"+menu.path}><Icon icon="github" />{menu.name}</a></li>
//		)
//	})
//}
//</div>
