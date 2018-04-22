import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Popconfirm, notification, Tree, Card } from 'antd';
import Editor from './MngMenuEditor';

import styles from './MngMenu.css';

const TreeNode = Tree.TreeNode;

class MenuList extends Component {

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.forAdd = this.forAdd.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'mngMenu/load',
    });
  }

  /* onDelete (record) {
    this.props.dispatch({
      type: 'mngMenu/delete',
      id: record.id
    });
  }*/

  onSelect(keys, e) {
    this.props.dispatch({
      type: 'mngMenu/setState',
      state: {
        selectedNode: e.node.props.item,
        menu: e.node.props.item,
      },
    });
  }

  onCheck(keys) {
    // console.log(keys);
    this.props.dispatch({
      type: 'mngMenu/setState',
      state: {
        checkedKeys: keys,
      },
    });
  }

  forAdd(type) {
    let parent = {};
    if (type === 1) { // 新增同级菜单
      parent = this.props.mngMenu.selectedNode.parent ? this.props.mngMenu.selectedNode.parent : {};
    } else {  // 新增子菜单
      parent = this.props.mngMenu.selectedNode;
    }

    this.props.dispatch({
      type: 'mngMenu/setState',
      state: {
        menu: {
          parent,
        },
      },
    });
  }

  forDelete() {
    const { checkedKeys } = this.props.mngMenu;
    if (checkedKeys.length > 0) {
      this.props.dispatch({
        type: 'mngMenu/deleteSelected',
      });
    } else {
      notification.warning({
        message: '警告!',
        description: '请先选择要删除的菜单！',
      });
    }
  }

  render() {
    const treeCardHeight = document.documentElement.clientHeight;

    const { dispatch, mngMenu } = this.props;
    const { menus, selectedNode, menu, checkedKeys } = mngMenu;
    const selectedKeys = [];
    if (selectedNode.id) { selectedKeys.push(selectedNode.id); }
    const del = this.forDelete.bind(this);

    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.id} title={item.name + (item.name === item.alias ? '' : `（${item.alias}）`)} item={item} >{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.id} title={item.name + (item.name === item.alias ? '' : `（${item.alias}）`)} item={item} />;
    });

    return (
      <div >
        <Row>
          <Col span={8} style={{ backgroundColor: '#ffffff', padding: '5px', paddingLeft: '3px', height: '100%' }} >
            <Card style={{ height: `${treeCardHeight - 145 - 60}px` }} >
              <div style={{ marginBottom: '11px', whiteSpace: 'nowrap' }} >
                <Button type="primary" icon="menu-unfold" style={{ marginRight: '4px' }} onClick={() => this.forAdd(1)}>新增同级菜单</Button>
                <Button type="primary" icon="code-o" style={{ marginRight: '4px' }} onClick={() => this.forAdd(2)}>新增子菜单</Button>
                {
                  (checkedKeys.length > 0) ? (
                    <Popconfirm placement="left" cancelText="否" okText="是" onConfirm={del} title="您确定要删除选中的菜单么?" >
                      <Button type="danger" icon="close-circle-o" >删除</Button>
                    </Popconfirm>
                  ) : (<Button type="danger" icon="close-circle-o" onClick={del} >删除</Button>)
                }
              </div>
              <div style={{ height: `${treeCardHeight - 145 - 60 - 48 - 28}px`, overflow: 'auto' }} >
                {
                menus.length > 0 ? (
                  <Tree
                    checkable
                    onSelect={this.onSelect}
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                    selectedKeys={selectedKeys}
                  >
                    {loop(menus)}
                  </Tree>
                ) : '正在载入...'
              }
              </div>
            </Card>
          </Col>
          <Col span={16} style={{ backgroundColor: '#ffffff', padding: '5px', paddingRight: '0' }} >
            <Card className={styles.editorCard} >
              <Editor menu={menu} menus={menus} />
            </Card>
          </Col>
        </Row>

      </div>
    );
  }

}
export default connect(({ mngMenu }) => ({ mngMenu }))(MenuList);

