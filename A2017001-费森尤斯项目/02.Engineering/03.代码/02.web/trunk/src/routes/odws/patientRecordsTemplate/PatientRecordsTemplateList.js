import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Popconfirm, notification, Tree, Card } from 'antd';

import Editor from './PatientRecordsTemplateEditor';
import styles from './PatientRecordsTemplate.css';

const TreeNode = Tree.TreeNode;

class PatientRecordsTemplateList extends Component {

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.forAdd = this.forAdd.bind(this);
    this.reloadList = this.reloadList.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'patientRecordsTemplate/load',
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'patientRecordsTemplate/delete',
      id: record.id,
    });
  }

  onSelect(keys, e) {
    // console.log('keys in onSelect() of PatientRecordsTemplateList:', keys);
    if (keys[0] === '3' || keys[0] === '1' || keys[0] === '2') return;
    this.props.dispatch({
      type: 'patientRecordsTemplate/setState',
      state: {
        selectedNode: e.node.props.item,
        prt: e.node.props.item,
      },
    });
  }

  onCheck(keys) {
    // console.log(keys);
    this.props.dispatch({
      type: 'patientRecordsTemplate/setState',
      state: {
        checkedKeys: keys,
      },
    });
  }

  forAdd(type) {
    let parent = {};
    if (type === 1) { // 新增同级模板
      parent = this.props.patientRecordsTemplate.selectedNode.parent ? this.props.patientRecordsTemplate.selectedNode.parent : {};
    } else {  // 新增子模板
      parent = this.props.patientRecordsTemplate.selectedNode;
    }

    this.props.dispatch({
      type: 'patientRecordsTemplate/setState',
      state: {
        prt: {
          parent,
        },
      },
    });
  }

  forDelete() {
    const { checkedKeys } = this.props.patientRecordsTemplate;
    if (checkedKeys.length > 0) {
      this.props.dispatch({
        type: 'patientRecordsTemplate/deleteSelected',
      });
    } else {
      notification.warning({
        message: '警告!',
        description: '请先选择要删除的模板！',
      });
    }
  }

  reloadList() {
    this.props.dispatch({
      type: 'patientRecordsTemplate/load',
    });
  }

  render() {
    // const treeCardHeight = document.documentElement.clientHeight;
    const { patientRecordsTemplate, base } = this.props;
    const { prts, selectedNode, prt, checkedKeys } = patientRecordsTemplate;
    const selectedKeys = [];
    if (selectedNode.id) { selectedKeys.push(selectedNode.id); }
    const del = this.forDelete.bind(this);
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return (<TreeNode key={item.shareLevel} title={(item.shareLevel === item.modelName ? '' : `${item.modelName}`)} item={item} >
          {loop(item.children)}
        </TreeNode>);
      }
      return <TreeNode key={item.id ? item.id : item.shareLevel} title={(item.shareLevel === item.modelName ? '' : `${item.modelName}`)} item={item} />;
    });

    const { wsHeight } = base;

    return (
      <div >
        <Row>
          <Col span={6} style={{ padding: '3px', paddingRight: '5px' }} >
            <Card style={{ height: `${wsHeight - 6}px` }} className="card-padding-10" >
              <Row style={{ marginBottom: '11px' }} >
                <Col span={8} style={{ paddingRight: '4px' }} >
                  <Button type="primary" icon="code-o" style={{ width: '100%', paddingLeft: '5px', paddingRight: '5px' }} onClick={() => this.forAdd(2)}>新增</Button>
                </Col>
                <Col span={8} style={{ paddingRight: '4px' }} >
                  {
                    (checkedKeys.length > 0) ? (
                      <Popconfirm placement="left" cancelText="否" okText="是" onConfirm={del} title="您确定要删除选中的模板么?" style={{ width: '100%' }} >
                        <Button type="danger" icon="delete" style={{ width: '100%' }} >删除</Button>
                      </Popconfirm>
                    ) : (<Button type="danger" icon="delete" onClick={del} style={{ width: '100%' }} >删除</Button>)
                  }
                </Col>
                <Col span={8} >
                  <Button icon="reload" onClick={this.reloadList} style={{ width: '100%' }} >刷新</Button>
                </Col>
              </Row>
              <div style={{ height: `${wsHeight - 6 - 20 - 40}px`, overflow: 'auto' }} >
                {
                prts.length > 0 ? (
                  <Tree
                    checkable
                    onSelect={this.onSelect}
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                    selectedKeys={selectedKeys}
                  >
                    {loop(prts)}
                  </Tree>
                ) : '暂无模板...'
              }
              </div>
            </Card>
          </Col>
          <Col span={18} style={{ padding: '3px', paddingLeft: '5px' }} >
            <Card style={{ height: `${wsHeight - 6}px` }} className="card-padding-0" >
              <Editor prt={prt} pts={prts} />
            </Card>
          </Col>
        </Row>

      </div>
    );
  }

}
export default connect(
  ({ patientRecordsTemplate, utils, base }) => ({ patientRecordsTemplate, utils, base }),
)(PatientRecordsTemplateList);
