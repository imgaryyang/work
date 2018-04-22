import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import {Tabs,Spin} from 'antd';
import List from './ClientMenuList';
const TabPane = Tabs.TabPane;

class ClientMenuTab extends React.Component {

	constructor(props) {
	    super(props);
	}
	
	componentWillMount(){
		this.props.dispatch({
			type:'clientMenu/addOrActiveTab',
			tab:{title:'列表',cmp:<List/>,key:'list'}
		});
	}
	
	componentDidMount(){
	}
	
	componentDidUpdate(){
	}
	removeTab(targetKey){
		if('list' != targetKey){
			this.props.dispatch({
				type:'clientMenu/removeTab',
				key:targetKey
			});
		}else{console.info('列表不允许删除')}
	}
	addTab(targetKey){
		
	}
	onEditTab(targetKey, action) {
	    this[action+'Tab'](targetKey);
	}
	onChange(activeKey) {
		this.props.dispatch({
			type:'clientMenu/activeTab',
			key:activeKey
		});
	}
	render(){
		const {tabs,activeKey,spin} = this.props.clientMenu;
		return (
			<Spin spinning={spin} >
			<Tabs hideAdd  type="editable-card" animated={false} activeKey={activeKey} 
				onChange={this.onChange.bind(this)}  onEdit={this.onEditTab.bind(this)} >
			{
				tabs.map(function(tab,map){
					return (
						<TabPane tab={tab.title} key={tab.key} >
							{tab.cmp}
						</TabPane>
					)
				})
			}
				
			</Tabs>
			</Spin>
		);	
	}
}
export default connect(({clientMenu})=>({clientMenu}))(ClientMenuTab);
//<TabPane tab={"列表"} key='list' >
//<List/>
//</TabPane> 