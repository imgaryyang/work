/**
 * 电子病历模板
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Input, Icon, Tree } from 'antd';
import _ from 'lodash';
import styles from './MedicalRecord.less';

const TreeNode = Tree.TreeNode;

class MedicalRecordTemplate extends Component {

  constructor(props) {
    super(props);
    this.searchTemplate = this.searchTemplate.bind(this);
    this.clearSearchCode = this.clearSearchCode.bind(this);
    this.chooseTemplate = this.chooseTemplate.bind(this);
    this.loadTemplates = this.loadTemplates.bind(this);
  }

  state = {
    searchCode: '',
  };

  componentWillMount() {
    this.loadTemplates();
  }

  chooseTemplate(key, e) {
    // console.log(key, e.node.props.originData);
    const tmplData = _.pick(e.node.props.originData, ['chiefComplaint', 'presentIllness', 'pastHistory', 'physicalExam', 'otherExam', 'moOrder']);
    this.props.dispatch({
      type: 'odwsMedicalRecord/setState',
      payload: {
        medicalRecord: {
          ...this.props.odwsMedicalRecord.medicalRecord,
          ...tmplData,
        },
      },
    });
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
      type: 'odwsMedicalRecord/loadTemplates',
      payload: {
        searchCode,
      },
    });
  }

  render() {
    const { odws, odwsMedicalRecord } = this.props;
    const { odwsWsHeight } = odws;
    const { templates } = odwsMedicalRecord;

    // console.log('templates:', templates);
    // 组合模板tree
    const treeData = [
      { id: '1', modelName: '个人', children: [] },
      { id: '2', modelName: '科室', children: [] },
      { id: '3', modelName: '全院', children: [] },
    ];
    // 将后端返回的数据放入树的二级
    if (templates['1']) treeData[0].children = templates['1'];
    if (templates['2']) treeData[1].children = templates['2'];
    if (templates['3']) treeData[2].children = templates['3'];
    // 组合TreeNode
    const loop = data => data.map((item, idx) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode key={`${item.id}_${idx}`} title={item.modelName} originData={item} >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (<TreeNode key={`${item.id}_${idx}`} title={item.modelName} originData={item} />);
    });

    return (
      <Card style={{ height: `${odwsWsHeight - 6}px` }} className={styles.tmpCard} >
        <div >
          <Input
            placeholder="搜索病历模板"
            maxLength={10}
            onChange={this.searchTemplate}
            value={this.state.searchCode}
            addonAfter={(<div onClick={this.clearSearchCode} ><Icon type="close" /></div>)}
          />
        </div>
        <div style={{ height: `${odwsWsHeight - 6 - 10 - 50}px`, overflow: 'auto' }}>
          {
            <Tree
              onSelect={this.chooseTemplate}
              expandedKeys={['1_0', '2_1', '3_2']}
            >
              {loop(treeData)}
            </Tree>
          }
        </div>
      </Card>
    );
  }
}

export default connect(
  ({ odws, odwsMedicalRecord, base }) => ({ odws, odwsMedicalRecord, base }),
)(MedicalRecordTemplate);

