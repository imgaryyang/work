import React, { Component } from 'react';
import { connect } from 'dva';
import { Tree, Card, Spin } from 'antd';

const TreeNode = Tree.TreeNode;

class CtrlParamTree extends Component {

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'ctrlParam/loadTypes',
    });
  }

  componentWillReceiveProps(props) {
    if (this.props.ctrlParam.selectedType.code !== props.ctrlParam.selectedType.code) {
      const selectedType = props.ctrlParam.selectedType;
      const values = {
        controlClass: selectedType.type === '2' ? selectedType.code : '',
      };
      this.onSearch(values);
    }
  }

  onSelect(keys, e) {
    const selectedType = e.node.props.item;
    this.props.dispatch({
      type: 'ctrlParam/setState',
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
      type: 'ctrlParam/load',
      payload: {
        query: values,
      },
    });
  }

  render() {
    const { ctrlParam, base } = this.props;
    const { tree } = ctrlParam;
    const { wsHeight } = base;

    const loop = data => data.map((item, idx) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode key={`${item.group}${item.code}${idx}`} title={item.dis} item={item} >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (<TreeNode key={`${item.group}${item.code}${idx}`} title={item.dis} item={item} />);
    });

    return (
      <div style={{ padding: '5px', paddingLeft: '3px', paddingTop: '3px' }} >
        <Card style={{ height: `${wsHeight - 8}px` }} className="card-padding-10" >
          <div style={{ height: `${wsHeight - 8 - 25}px`, overflow: 'auto' }} >
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
          </div>
        </Card>
      </div>
    );
  }
}
export default connect(({ ctrlParam, base }) => ({ ctrlParam, base }))(CtrlParamTree);
