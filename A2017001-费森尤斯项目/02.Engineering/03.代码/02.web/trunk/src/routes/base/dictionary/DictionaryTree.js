import React, { Component } from 'react';
import { connect } from 'dva';
import { Tree, Card } from 'antd';

const TreeNode = Tree.TreeNode;

class DictionaryTree extends Component {

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'dict/loadTypes',
    });
  }

  onSelect(keys, e) {
    const selectedType = e.node.props.item;
    this.props.dispatch({
      type: 'dict/setState',
      payload: {
        selectedType,
        selectedGroup: selectedType.code ? selectedType.group : '',
        selectedColumnName: selectedType.type === '2' ? selectedType.code : '',
        selectedColumnDis: selectedType.type === '2' ? selectedType.dis : '',
      },
    });
  }

  render() {
    /* global document*/
    // const treeCardHeight = document.documentElement.clientHeight;
    const { dict, base } = this.props;
    const { tree } = dict;
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
          <div style={{ height: `${wsHeight - 8 - 28}px`, overflow: 'auto' }} >
            {
              tree.length > 0 ? (
                <Tree
                  onSelect={this.onSelect}
                >
                  {loop(tree)}
                </Tree>
              ) : '正在载入...'
            }
          </div>
        </Card>
      </div>
    );
  }
}
export default connect(
  ({ dict, base }) => ({ dict, base }),
)(DictionaryTree);

