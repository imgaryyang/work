import React, { Component } from 'react';
import { connect } from 'dva';
import { Tree, Row, Col, Button } from 'antd';
import ShadowDiv from '../../../components/ShadowDiv';

const TreeNode = Tree.TreeNode;

class MenuTree extends Component {

  constructor(props) {
    super(props);
    this.onCheck = this.onCheck.bind(this);
    this.renderMenuNode = this.renderMenuNode.bind(this);
    this.forReset = this.forReset.bind(this);
    this.forSave = this.forSave.bind(this);
    this.getCheckedKey = this.getCheckedKey.bind(this);
  }

  selectedKeys = [];

  componentWillMount(props) {
    this.props.dispatch({
      type: 'auth/loadMenus',
    });
  }
  componentWillReceiveProps(props) {
    if (props.auth.roleId == this.props.auth.roleId) return;
    this.props.dispatch({
      type: 'auth/loadMenuKeys',
    });
  }
  onCheck(selectedKeys, { halfCheckedKeys }) { // console.info(arguments,halfChecked);
    if (halfCheckedKeys) {
      for (const harfkey of halfCheckedKeys)selectedKeys.push(harfkey);
    }
    const menu = { ...this.props.auth.menu, selectedKeys };
    this.props.dispatch({
      type: 'auth/setState',
      payload: { menu },
    });
  }
  forSave() {
    this.props.dispatch({
      type: 'auth/assignMenu',
    });
  }
  forReset() {
    this.props.dispatch({
      type: 'auth/loadMenuKeys',
    });
  }

  hasInChildren(parent, map) {
    if (parent && parent.children) {
      for (const child of parent.children) {
        if (map[child.id]) return true;
        if (child && child.children) {
          if (this.hasInChildren(child, map)) return true;
        }
      }
    }
    return false;
  }
  getCheckedKey() {
    const { data, selectedKeys } = this.props.auth.menu;
    const temp = {};
    for (var key of selectedKeys) {
      temp[key] = true;
    }
    for (var key of selectedKeys) {
      const menu = data[key];
      if (this.hasInChildren(menu, temp)) delete temp[key];
    }
    return Object.keys(temp);
  }

  render() {
    const { menu } = this.props.auth;
    const { data, tree } = menu;
    const checkedKeys = this.getCheckedKey();
    return (
      <div>
        <ShadowDiv showTopShadow={false} style={{ height: `${this.props.tabHeight - 50}px` }} bodyStyle={{ height: `${this.props.tabHeight - 53}px`, overflowY: 'auto' }} >
          <Tree checkable checkedKeys={checkedKeys} onCheck={this.onCheck} >
            {
              this.renderMenuNode(tree)
            }
          </Tree>
        </ShadowDiv>
        <div style={{ textAlign: 'right', height: '50px', paddingTop: '8px' }} >
          <Button type="primary" style={{ marginRight: '10px' }} onClick={this.forSave} size="large" icon="save" >保存</Button>
          <Button onClick={this.forReset} size="large" icon="reload" >重置</Button>
        </div>
      </div>
    );
  }
  renderMenuNode(menus) {
    const disable = !this.props.auth.roleId;
    const nodes = [];
    for (const menu of menus) {
      nodes.push(
        <TreeNode disableCheckbox={disable} title={`${menu.alias}(${menu.name})`} key={menu.id}>
          {
          (menu.children && menu.children.length > 0) ? this.renderMenuNode(menu.children) : null
        }
        </TreeNode>,
      );
    }
    return nodes;
  }
}
export default connect(({ auth }) => ({ auth }))(MenuTree);
// /<Affix target={() => this}></Affix>
