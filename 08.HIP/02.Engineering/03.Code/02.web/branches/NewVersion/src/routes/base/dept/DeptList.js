import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Popconfirm, notification, Tree, Card } from 'antd';


import Editor from './DeptEditor';

// import styles from './Dept.css';

const { TreeNode } = Tree;

class DeptList extends Component {
  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.forAdd = this.forAdd.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  onSelect(keys, e) {
    const deptId = e.node.props.item.key;
    console.log('onSelect:', e.node.props.item);
    if (!deptId.includes('DICT')) {
      this.props.dispatch({
        type: 'department/getInfo',
        Id: deptId,
      });
    } else {
      this.props.dispatch({
        type: 'department/setState',
        state: {
          selectedNode: e.node.props.item,
          menu: e.node.props.item,
        },
      });
    }
  }
  onCheck(keys) {
    console.log(keys);
    this.props.dispatch({
      type: 'department/setState',
      state: {
        checkedKeys: keys,
      },
    });
  }

  forAdd(/* type */) {
    // let parent = '';
    let Type = '';
    // 新增菜单
    Type = this.props.department.selectedNode.deptType;
    this.props.dispatch({
      type: 'department/setState',
      state: {
        menu: {
          deptType: Type,
        },
      },
    });
  }

  forDelete() {
    // console.info('delete', this.props);
    const { checkedKeys } = this.props.department;
    if (checkedKeys.length > 0) {
      // console.log(333);
      this.props.dispatch({
        type: 'department/deleteSelected',
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
      type: 'utils/initDepts',
    });
  }

  render() {
    const { wsHeight } = this.props.base;
    const treeCardHeight = wsHeight - 6;
    // const treeCardHeight = document.documentElement.clientHeight;
    const { department } = this.props;
    const { selectedNode, menu, checkedKeys, depts } = department;
    const selectedKeys = [];

    if (selectedNode && selectedNode.id) selectedKeys.push(selectedNode.id);
    const del = this.forDelete.bind(this);
    const menus = [];
    for (const key in depts) {
      if (key) {
        menus.push(depts[key]);
      }
    }
    const loop = data => data.map((item) => {
      if (item.key.includes('DICT')) {
        if (item.children.length) {
          return <TreeNode key={item.key} title={item.title} item={item} disableCheckbox >{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} title={item.title} item={item} disableCheckbox />;
      }
      return <TreeNode key={item.key} title={item.title} item={item} />;
    });

    return (
      <div>
        <Row>
          <Col span={8} style={{ backgroundColor: '#ffffff', padding: '3px' }} >
            <Card style={{ height: `${treeCardHeight}px` }} className="card-padding-10" >
              <Row>
                <Col span={8} style={{ paddingRight: '2px' }} >
                  <Button type="primary" icon="menu-unfold" style={{ width: '100%' }} onClick={() => this.forAdd(1)}>新增科室</Button>
                </Col>
                <Col span={8} style={{ paddingLeft: '3px', paddingRight: '2px' }} >
                  {
                    (checkedKeys.length > 0) ? (
                      <Popconfirm placement="left" cancelText="否" okText="是" onConfirm={del} title="您确定要删除选中的菜单么?" style={{ width: '100%' }} >
                        <Button type="danger" icon="close-circle-o" style={{ width: '100%' }} >删除</Button>
                      </Popconfirm>
                    ) : (<Button type="danger" icon="close-circle-o" onClick={del} style={{ width: '100%' }} >删除</Button>)
                  }
                </Col>
                <Col span={8} style={{ paddingLeft: '3px' }} >
                  <Button icon="reload" style={{ width: '100%' }} onClick={() => this.refresh()}>刷新</Button>
                </Col>
              </Row>
              <div style={{ height: `${treeCardHeight - 39 - 20}px`, overflow: 'auto', marginTop: '10px' }} >
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
            <Card style={{ height: `${treeCardHeight}px`, paddingRight: '20px' }} className="card-padding-15 card-overflow-auto" >
              <Editor menu={menu} menus={menus} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  ({ department, utils, base }) => ({ department, utils, base }),
)(DeptList);

