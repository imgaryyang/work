import React from 'react';
import { connect } from 'dva';
import { Tree, Card, Input, Icon } from 'antd';

const TreeNode = Tree.TreeNode;

class PricChargeLeft extends React.Component {
  state = {
    searchCode: '',
  };
  onSelect(keys, e) {
    const comboId = e.node.props.originData.id;
    if (keys === '1' || keys === '2' || keys === '3') {
      this.props.dispatch({
        type: 'pricCharge/initShareLevel',
        shareLevel: keys[0],
      });
    } else {
      this.props.dispatch({
        type: 'pricCharge/addItemByItemId',
        comboId,
      });
    }
  }

  searchTemplate(e) {
    this.setState({ searchCode: e.target.value }, () => {
      this.loadTemplates(this.state.searchCode);
    });
  }

  clearSearchCode() {
    this.setState({ searchCode: '' }, () => {
      this.loadTemplates();
    });
  }

  loadTemplates(searchCode) {
    // 动态加载病历模板
    this.props.dispatch({
      type: 'pricCharge/loadItemTemplate',
      searchCode,
    });
  }
  render() {
    const { tmpTree } = this.props.pricCharge;
    const { wsHeight } = this.props.base;
// 组合模板tree
    const treeData = [
      { id: '1', comboName: '个人', children: [] },
      { id: '2', comboName: '科室', children: [] },
      { id: '3', comboName: '全院', children: [] },
    ];
// 将后端返回的数据放入树的二级
    if (tmpTree['1']) treeData[0].children = tmpTree['1'];
    if (tmpTree['2']) treeData[1].children = tmpTree['2'];
    if (tmpTree['3']) treeData[2].children = tmpTree['3'];
// 组合TreeNode
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode key={`${item.id}`} title={item.comboName} originData={item} >
            { loop(item.children)}
          </TreeNode>
        );
      }
      return (<TreeNode key={`${item.id}`} title={item.comboName} originData={item} />);
    });

    return (
      <Card style={{ height: `${wsHeight - 6}px` }} className="card-padding-5" >
        <div >
          <Input
            placeholder="搜索病历模板"
            maxLength={10}
            onChange={this.searchTemplate.bind(this)}
            value={this.state.searchCode}
            addonAfter={(<div onClick={this.clearSearchCode.bind(this)} ><Icon type="close" /></div>)}
          />
        </div>
        <div style={{ height: `${wsHeight - (16 * 2) - 28} px`, overflow: 'auto' }}>
          {
            <Tree
              onSelect={this.onSelect.bind(this)}
              expandedKeys={['1', '2', '3']}
            >
              {loop(treeData)}
            </Tree>
          }
        </div>
      </Card>
    );
  }
}
export default connect(({ pricCharge, base }) => ({ pricCharge, base }))(PricChargeLeft);
