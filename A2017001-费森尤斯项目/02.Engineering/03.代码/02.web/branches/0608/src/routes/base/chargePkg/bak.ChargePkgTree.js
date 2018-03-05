import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Tree, Card } from 'antd';

const TreeNode = Tree.TreeNode;

class ChargePkgTree extends React.Component {

	constructor (props) {
	    super(props);
	    this.onSelect = this.onSelect.bind(this);
	}
	
	componentWillMount () {
		this.props.dispatch({
			type:'chargePkg/loadTypes'
		});
	}

	onSelect (keys, e) {
		let selectedType = e.node.props.item;
		this.props.dispatch({
			type: 'chargePkg/setState',
			payload: {
				selectedType: selectedType,
				selectedGroup: selectedType.code ? selectedType.group : '',
				selectedColumnName: selectedType.type == '2' ? selectedType.code : '',
				selectedColumnDis: selectedType.type == '2' ? selectedType.dis : '',
			}
		});
	}

	render () {

		let {tree} = this.props.chargePkg;
console.info("tree+++++++++++++++++++++++++++++++++++ : ",tree);
		const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key = {item.code+item.dis} title = {item.dis} item = {item} >{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key = {item.code} title = {item.dis} item = {item} />;
    });
		
		return (
			<div style = {{padding: '5px', paddingLeft: '3px'}} >
				<Card >
					{
						tree.length > 0 ? (
							<Tree 
								onSelect = {this.onSelect}
							>
				        {loop(tree)}
				      </Tree>
						) : '正在载入...'
					}
				</Card>
			</div> 
		);	
	}
}
export default connect(({chargePkg})=>({chargePkg}))(ChargePkgTree);

