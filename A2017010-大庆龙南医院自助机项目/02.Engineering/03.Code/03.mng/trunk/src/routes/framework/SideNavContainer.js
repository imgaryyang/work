import React, { Component, PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { Menu, Icon} from 'antd';
import { connect } from 'dva';
import styles from './SideNavContainer.css';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function SideNavContainer (props) {
	
	const { top } = props.frame.current;
	const menus  = top ? (top.children||[]) : [];
	
	function handleSideMenu({domEvent,item,key,keyPath}){
		props.dispatch(routerRedux.push(key));
	}
	
return (//selectedKeys={[current]} openKeys={openKeys}	
	<div className={styles.frame}>
	    <aside className={styles.sider}>
		    <Menu onClick={handleSideMenu} style={{ width: 240 }} theme="light" mode="inline">
		    {
		    	menus.map(function(menu,index){
		    		var subMenus = menu.children;
		    		if(subMenus && subMenus.length>0){
		    			return (
		    					<SubMenu key={menu.key} title={<span><Icon type={menu.icon} /><span>{menu.name}</span></span>}>
		    					{
		    						subMenus.map(function(sub,index){
		    							return <Menu.Item key={sub.key}>{sub.name}</Menu.Item>
		    						})
		    					}
		    					</SubMenu>
		    			)
		    		}else{
		    			return <Menu.Item key={menu.key}><span><Icon type={menu.icon} /><span>{menu.name}</span></span></Menu.Item>
		    		}
		    	})
		    }
		    </Menu>
	    </aside>
		<div className={styles.center}>
			<div className={styles.content}>
				{props.children}
			</div>
			<div className={styles.footer}>
				Lenovohit 版权所有 © 2016 由联想智慧医疗实施部支持
			</div>
		</div>
    </div>
  );
}
export default connect(({frame,app}) => ({frame,app}))(SideNavContainer);
