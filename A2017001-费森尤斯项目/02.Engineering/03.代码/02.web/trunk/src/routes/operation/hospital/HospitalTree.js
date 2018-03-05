import React, { Component } from 'react';
import { connect } from 'dva';
import { Tree, Card, Spin } from 'antd';

const TreeNode = Tree.TreeNode;

class HospitalTree extends Component {

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'optHospital/loadTypes',
    });
  }

  componentWillReceiveProps(props) {
    if (this.props.optHospital.selectedType.code !== props.optHospital.selectedType.code) {
      const selectedType = props.optHospital.selectedType;
      const values = {
        parentId: selectedType.type === '2' ? selectedType.code : '',
      };
      this.onSearch(values);
    }
  }

  onSelect(keys, e) {
    const selectedType = e.node.props.item;
    this.props.dispatch({
      type: 'optHospital/setState',
      payload: {
        selectedType,
        selectedGroup: selectedType.code ? selectedType.group : '',
        selectedColumnName: selectedType.type === '2' ? selectedType.code : '',
        selectedColumnDis: selectedType.type === '2' ? selectedType.dis : '',
      },
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'optHospital/load',
      payload: {
        query: values,
      },
    });
  }

  render() {
    const { tree } = this.props.optHospital;
    const { wsHeight } = this.props.base;
    const cardHeight = wsHeight - 6;
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return (<TreeNode key={item.group + item.code} title={item.dis} item={item} >
          {loop(item.children)}
        </TreeNode>);
      }
      return (<TreeNode key={item.group + item.code} title={item.dis} item={item} />);
    });

    return (
      <div style={{ padding: '3px' }} >
        <Card style={{ height: `${cardHeight}px` }} className="card-padding-10 card-overflow-auto" >
          {
            tree.length > 0
            ?
              <Tree
                onSelect={this.onSelect}
                defaultExpandAll
              >
                {loop(tree)}
              </Tree>
            :
              <div className="spin-content">
                <Spin />
              </div>
          }
        </Card>
      </div>
    );
  }
}
export default connect(
  ({ optHospital, base }) => ({ optHospital, base }),
)(HospitalTree);
