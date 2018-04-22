import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Icon,Row, Col  } from 'antd';
import MenuBlock from '../components/homepage/MenuBlock.js';

import styles from './Homepage.css';
import logo from '../assets/logo.png'

class HomePage extends React.Component {
	constructor(props) {
	    super(props);
	}
	componentWillMount(){
		this.props.dispatch({type: 'home/load'});
	}
	menuSelect(e,menu){
		this.props.dispatch(routerRedux.push({
			pathname: menu.pathname,
			//query: { modal: true }, //传参样例
			state : {nav:{title:menu.alias}}
		}));
	}
	
	componentDidMount(){
		
	}
	
	render(){
		const {menus} = this.props.home;
		const scope = this;
		return (
				<div>
					<div className={styles.header}>
						<div className={styles.logo}><img className={styles.image} src={logo} /></div>
						<div className={styles.title}>联想智慧医疗自助机系统</div>
						<div className={styles.tail}></div>
						<div className={styles.btn}>退卡</div>
						<div className={styles.line}></div>
					</div>
					<div className={styles.container}>
						<div className={styles.center}>
							<Row className={styles.row}>
								{
									menus.map(function(menu,index){
										let span = 4*menu.colspan;
										return (
											<Col span={span} key={index} className={styles.col}>
										    	<MenuBlock onSelect={scope.menuSelect.bind(scope)} menu={menu}/>
										    </Col>
										)
									})
								}
					    </Row>
					    </div>
					</div>
					<div className={styles.footer}>
						Powered By Lenovo HIT
					</div>
				</div>
		);	
	}
}
export default connect(({home}) => ({home}))(HomePage);




