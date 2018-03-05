import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Row, Col, Tree, Input, Icon } from 'antd';
import _ from 'lodash';
import DictSelect from './DictSelect';
import styles from './AsyncChargePkgTree.less';

const TreeNode = Tree.TreeNode;

class AsyncChargePkgTree extends Component {

  static propTypes = {

    /**
     * 业务类型：财务/医生，如果不传，则都显示
     */
    busiClass: PropTypes.string,

    /**
     * 选中后回调
     */
    onSelect: PropTypes.func,

    /**
     * 高度
     */
    height: PropTypes.number,

  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.clearSearchCode = this.clearSearchCode.bind(this);
    this.loadPkgs = this.loadPkgs.bind(this);
    this.onSelectDrugFlag = this.onSelectDrugFlag.bind(this);
  }

  state = {
    drugFlag: '',
    searchCode: '',
  };

  componentWillMount() {
    // 载入需要的数据字典
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['GROUP_TYPE'],
    });
    // 载入收费组套tree数据
    this.loadPkgs();
  }

  onSelect(key, e) {
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(e.node.props.originData);
    }
  }

  onSearch(e) {
    this.setState({ searchCode: e.target.value }, () => {
      this.loadPkgs();
    });
  }

  onSelectDrugFlag(value) {
    this.setState({ drugFlag: value }, () => {
      this.loadPkgs();
    });
  }

  clearSearchCode() {
    this.setState({ searchCode: '' }, () => {
      this.loadPkgs();
    });
  }

  loadPkgs() {
    // 动态加载病历模板
    this.props.dispatch({
      type: 'chargePkg/loadTreeData',
      payload: {
        busiClass: this.props.busiClass || '',
        drugFlag: this.state.drugFlag,
        searchCode: this.state.searchCode,
        pageSize: 40,
      },
    });
  }

  render() {
    const { chargePkg, height, busiClass } = this.props;
    const { pkgs } = chargePkg;
    const wrapperHeight = height || this.props.base.wsHeight - 48;

    // 组合模板tree
    const treeData = [];
    let expandedKeys = [];
    if (_.isEmpty(busiClass) || busiClass === '1') {
      treeData.push({ id: '1',
        comboName: '财务收费',
        level: 1,
        children: [
          { id: '1', parent: '1', comboName: '个人', level: 2, children: [] },
          { id: '2', parent: '1', comboName: '科室', level: 2, children: [] },
          { id: '3', parent: '1', comboName: '全院', level: 2, children: [] },
        ],
      });
      // 将后端返回的数据放入树的二级
      treeData[0].children[0].children = pkgs['1']['1'];
      treeData[0].children[1].children = pkgs['1']['2'];
      treeData[0].children[2].children = pkgs['1']['3'];
      expandedKeys = expandedKeys.concat(['1_0', '11_0', '12_1', '13_2']);
    }
    if (_.isEmpty(busiClass) || busiClass === '2') {
      treeData.push({ id: '2',
        comboName: '门诊医生',
        level: 1,
        children: [
          { id: '1', parent: _.isEmpty(busiClass) ? '2' : '1', comboName: '个人', level: 2, children: [] },
          { id: '2', parent: _.isEmpty(busiClass) ? '2' : '1', comboName: '科室', level: 2, children: [] },
          { id: '3', parent: _.isEmpty(busiClass) ? '2' : '1', comboName: '全院', level: 2, children: [] },
        ],
      });
      // 将后端返回的数据放入树的二级
      const idx = _.isEmpty(busiClass) ? 1 : 0;
      treeData[idx].children[0].children = pkgs['2']['1'];
      treeData[idx].children[1].children = pkgs['2']['2'];
      treeData[idx].children[2].children = pkgs['2']['3'];
      expandedKeys = expandedKeys.concat(_.isEmpty(busiClass) ? ['2_1', '21_0', '22_1', '23_2'] : ['1_0', '11_0', '12_1', '13_2']);
    }
    /* console.log(treeData);
    console.log(expandedKeys);*/

    // 组合TreeNode
    const loop = data => data.map((item, idx) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode
            key={`${item.parent ? item.parent : ''}${item.id}_${idx}`}
            title={item.comboName}
            originData={item}
            disabled={item.level === 1 || item.level === 2}
          >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={`${item.parent ? item.parent : ''}${item.id}_${idx}`}
          title={item.comboName}
          originData={item}
          disabled={item.level === 1 || item.level === 2}
        />
      );
    });

    return (
      <div className={styles.container} style={{ height: `${wrapperHeight}px` }} >
        <Row >
          <Col span={24} style={{ marginBottom: '5px' }} >
            <DictSelect
              style={{ width: '100%' }}
              tabIndex={0}
              columnName="GROUP_TYPE"
              allowClear
              onChange={this.onSelectDrugFlag}
            />
          </Col>
          <Col span={24}>
            <Input
              placeholder="搜索模板"
              maxLength={10}
              onChange={this.onSearch}
              value={this.state.searchCode}
              addonAfter={(<div onClick={this.clearSearchCode} ><Icon type="close" /></div>)}
            />
          </Col>
        </Row>
        <div style={{ height: `${wrapperHeight - (28 * 2)}px`, overflow: 'auto' }}>
          <Tree
            onSelect={this.onSelect}
            expandedKeys={expandedKeys}
          >
            {loop(treeData)}
          </Tree>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ base, chargePkg }) => ({ base, chargePkg }),
)(AsyncChargePkgTree);

