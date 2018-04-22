import React, { Component } 		from 'react';
import { routerRedux } 					from 'dva/router';
import { connect } 							from 'dva';

import { Icon,Row, Col  } 			from 'antd';
import { MenuBlock } 								from '../components';

import styles 									from './Homepage.css';
import logo 										from '../assets/logo.png'
import coLogo 									from '../assets/co-logo.png'
import config 									from '../config';

class HomePage extends Component {

	constructor(props) {
	  super(props);
	}

	componentWillMount () {
		this.props.dispatch({type: 'frame/loadMenus'});
	}
	componentDidMount () {
		this.props.dispatch({//保证无残存订单信息
			type: 'deposit/clearOrders',
		});
		this.props.dispatch({//支付完毕后清空支付信息残留信息
			type:'payment/reset'
		});
		this.props.dispatch({//保证无残存用户信息
			type: 'patient/logout',
		});
		this.props.dispatch({//清空支付信息
		    type: 'refund/clear',
		});
	}
	menuSelect (e, menu) {
		const {home, patient} = this.props;
		this.props.dispatch(routerRedux.push({
			pathname: menu.pathname,
			state : {nav:{title:menu.alias}}
		}));
	}
	
	componentDidMount () {
	}
	
	render(){

		const {menus} = this.props.frame;
		const scope = this;

		let headerStyle = {
			width: '100%',
			height: config.home.header.height + 'rem',
			padding: config.home.header.padding + 'rem',
		};

		let rowHeight = (config.home.header.height - config.home.header.padding * 2); //rem

		let headerLogoStyle = {
			width: rowHeight + 'rem',//(rowHeight * config.remSize) + 'px',
			height: rowHeight + 'rem',
		}

		let headerTitleStyle = {
			lineHeight: rowHeight + 'rem',
			fontSize: '3rem',
		}

		let headerBtnStyle = {
			lineHeight: rowHeight + 'rem',
		}

		let menuStyle = {
			width: '100%',
			height: (_screenHeight - config.home.header.height * config.remSize - config.home.footer.height * config.remSize) + 'px',
		};

		let footerStyle = {
			width: '100%',
			height: config.home.footer.height + 'rem',
		};

		let baseSpan = 24 / config.home.menu.colsPerRow;

		return (
			<div>

				<div className = {styles.header} style = {headerStyle} >
					<Row >
						<Col span = {3} className = {styles.headerLogo} ><img src = {logo} className = {styles.bottomLogo} style = {headerLogoStyle} /></Col>
						<Col span = {16} className = {styles.headerTitle} style = {headerTitleStyle} >{config.title}</Col>
						<Col span = {5} className = {styles.headerBtn} style = {headerBtnStyle} ><div onClick = {() => {
							this.props.dispatch({type: 'patient/logout'});
						}} >退卡</div></Col>
					</Row>
				</div>

				<div className = {styles.container} style = {menuStyle} >
					<div className = {styles.center} >
						<Row className = {styles.row} >
							{
								menus.map(function(menu, index){
									let span = baseSpan * menu.colspan;
									return (
										<Col span = {span} key = {index} className = {styles.col} >
								    	<MenuBlock onSelect = {scope.menuSelect.bind(scope)} menu = {menu} />
								    </Col>
									)
								})
							}
				    </Row>
				  </div>
				</div>

				<div className = {styles.footer} style = {footerStyle} >
					{/*<img src = {coLogo} className = {styles.bottomLogo} />*/}
					<div className = {styles.bottomLogo} style = {{backgroundImage: 'url(' + coLogo + ')'}} ></div>
					<Row >
						<Col span = {10} className = {styles.bottomLine} ><span style = {{right: '0'}} ></span></Col>
						<Col span = {4} className = {styles.bottomText} >联想智慧医疗</Col>
						<Col span = {10} className = {styles.bottomLine} ><span style = {{left: '0'}} ></span></Col>
					</Row>
				</div>

			</div>
		);

	}
}

export default connect(({frame, patient}) => ({frame, patient}))(HomePage);


