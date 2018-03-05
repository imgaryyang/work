import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Popconfirm, notification, Tree, Card } from 'antd';
import Editor from './MenuEditor';

import styles from './Menu.css';

const { TreeNode } = Tree;

class MenuList extends Component {
  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.forAdd = this.forAdd.bind(this);
    this.refresh = this.refresh.bind(this);
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
  } */

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
    console.log(keys);
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
    } else { // 新增子菜单
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
    // console.info('delete', this.props);
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

  refresh() {
    this.props.dispatch({
      type: 'mngMenu/load',
    });
  }

  render() {
    /* global document */
    // const treeCardHeight = document.documentElement.clientHeight;

    const { mngMenu, base } = this.props;
    const { menus, selectedNode, menu, checkedKeys } = mngMenu;
    // console.log(menus);
    const { wsHeight } = base;
    // console.log(wsHeight);
    const treeCardHeight = wsHeight - 6;
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
          <Col span={8} style={{ backgroundColor: '#ffffff', padding: '3px', height: '100%' }} >
            <Card style={{ height: `${treeCardHeight}px` }} className="card-padding-10" >
              <div style={{ marginBottom: '11px', whiteSpace: 'nowrap' }} >
                <Row>
                  <Col span={7} style={{ paddingRight: '2px' }} >
                    <Button type="primary" icon="menu-unfold" style={{ width: '100%', padding: '4px 0' }} onClick={() => this.forAdd(1)}>新增同级菜单</Button>
                  </Col>
                  <Col span={7} style={{ paddingLeft: '3px', paddingRight: '2px' }} >
                    <Button type="primary" icon="code-o" style={{ width: '100%', padding: '4px 0' }} onClick={() => this.forAdd(2)}>新增子菜单</Button>
                  </Col>
                  <Col span={5} style={{ paddingLeft: '3px', paddingRight: '2px' }} >
                    {
                      (checkedKeys.length > 0) ? (
                        <Popconfirm placement="top" cancelText="否" okText="是" onConfirm={del} title="您确定要删除选中的菜单么?" style={{ width: '100%' }} >
                          <Button type="danger" icon="delete" style={{ width: '100%', padding: '4px 0' }} >删除</Button>
                        </Popconfirm>
                      ) : (<Button type="danger" icon="delete" onClick={del} style={{ width: '100%', padding: '4px 0' }} >删除</Button>)
                    }
                  </Col>
                  <Col span={5} style={{ paddingLeft: '3px' }} >
                    <Button icon="reload" style={{ width: '100%', padding: '4px 0' }} onClick={() => this.refresh()}>刷新</Button>
                  </Col>
                </Row>
              </div>
              <div style={{ height: `${treeCardHeight - 39 - 20}px`, overflow: 'auto' }} >
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
          <Col span={16} style={{ backgroundColor: '#ffffff', padding: '3px', paddingLeft: '7px' }} >
            <Card style={{ height: `${treeCardHeight}px` }} className={styles.editorCard} >
              <Editor menu={menu} menus={menus} />
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

export default connect(({ mngMenu, base }) => ({ mngMenu, base }))(MenuList);

