import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Popconfirm, notification, Tree, Card } from 'antd';
import Editor from './AreaEditor';

import styles from './Area.css';

const TreeNode = Tree.TreeNode;

class AreaList extends Component {

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.forAdd = this.forAdd.bind(this);
    this.forDelete = this.forDelete.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'areaManage/load',
    });
  }

  onSelect(keys, e) {
    this.props.dispatch({
      type: 'areaManage/setState',
      state: {
        selectedNode: e.node.props.item,
        area: e.node.props.item,
      },
    });
  }

  onCheck(keys) {
    this.props.dispatch({
      type: 'areaManage/setState',
      state: {
        checkedKeys: keys,
      },
    });
  }

  forAdd(type) {
    let parent = {};
    if (type === 1) { // 新增同级菜单
      parent = this.props.areaManage.selectedNode.parent ? this.props.areaManage.selectedNode.parent : {};
    } else {  // 新增子菜单
      parent = this.props.areaManage.selectedNode;
    }
    console.log('parent',parent);
    this.props.dispatch({
      type: 'areaManage/setState',
      state: {
    	  area: {
          parent,
        },
      },
    });
  }

  forDelete() {
    console.info('delete', this.props);
    const { checkedKeys } = this.props.areaManage;
    console.log('checkedKeys',checkedKeys);
    if (checkedKeys.length > 0) {
      this.props.dispatch({
        type: 'areaManage/deleteSelected',
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

    const { dispatch, areaManage } = this.props;
    const { areas, selectedNode, area, checkedKeys } = areaManage;
    const selectedKeys = [];
    if (selectedNode.id) { selectedKeys.push(selectedNode.id); }
    const del = this.forDelete.bind(this);
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.id} title={item.name} item={item} >{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.id} title={item.name} item={item} />;
    });

    return (
      <div >
        <Row>
          <Col span={8} style={{ backgroundColor: '#ffffff', padding: '5px', paddingLeft: '3px', height: '100%' }} >
            <Card style={{ height: `${treeCardHeight - 145 - 60}px` }} >
              <div style={{ marginBottom: '11px', whiteSpace: 'nowrap' }} >
                <Button type="primary" icon="menu-unfold" style={{ marginRight: '4px' }} onClick={() => this.forAdd(1)}>新增院区</Button>
                <Button type="primary" icon="code-o" style={{ marginRight: '4px' }} onClick={() => this.forAdd(2)}>新增楼区</Button>
                {
                  (checkedKeys.length > 0) ? (
                    <Popconfirm placement="left" cancelText="否" okText="是" onConfirm={del} title="您确定要删除选中的选项么?" >
                      <Button type="danger" icon="close-circle-o" >删除</Button>
                    </Popconfirm>
                  ) : (<Button type="danger" icon="close-circle-o" onClick={del} >删除</Button>)
                }
              </div>
              <div style={{ height: `${treeCardHeight - 145 - 60 - 48 - 28}px`, overflow: 'auto' }} >
                {
                areas.length > 0 ? (
                  <Tree
                    checkable
                    onSelect={this.onSelect}
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                    selectedKeys={selectedKeys}
                  >
                    {loop(areas)}
                  </Tree>
                ) : '正在载入...'
              }
              </div>
            </Card>
          </Col>
          <Col span={16} style={{ backgroundColor: '#ffffff', padding: '5px', paddingRight: '0' }} >
            <Card className={styles.editorCard} >
              <Editor area={area} areas={areas} />
            </Card>
          </Col>
        </Row>

      </div>
    );
  }

}
export default connect(({ areaManage }) => ({ areaManage }))(AreaList);

