import React from 'react';
import { Tree, Input, Icon } from 'antd';
import Styles from './RegVisit.less';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class regVisitTree extends React.Component {

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  state = {
    searchValue: '',
  }

  componentWillReceiveProps(props) {
    if (this.props.selectedType.key !== props.selectedType.key) {
      const selectedType = props.selectedType;
      const values = { deptId: selectedType.key || '' };
      this.onSearch(values);
    }
  }

  onSelect = (key, e) => {
    const selectedType = e.node.props.item;
    this.props.dispatch({
      type: 'regVisit/setState',
      payload: {
        selectedType,
      },
    });
  }

  onChange = (e) => {
    const value = e.target.value;
    this.setState({
      searchValue: value,
    });
  }

  onSearch(values) {
    this.props.setSearchObjs(values);
    this.props.dispatch({
      type: 'regVisit/load',
      payload: {
        query: this.props.searchObjs,
      },
    });
  }

  render() {
    const { searchValue } = this.state;
    const { treeData } = this.props;
    const loop = data => data.map((item) => {
      const index = item.val.search(searchValue);
      const beforeStr = item.val.substr(0, index);
      const afterStr = item.val.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          <Icon type="home" className={Styles.itemMatchIcon} />
          {beforeStr}
          <span className={Styles.matchColor}>{searchValue}</span>
          {afterStr}
        </span>
      ) : (
        <span>
          <Icon type="home" className={Styles.itemIcon} />
          {item.val}
        </span>
      );
      return <TreeNode key={item.key} title={title} item={item} />;
    });

    return (
      <div className={Styles.searchTree}>
        <Search placeholder="搜索" onChange={this.onChange} />
        <Tree onSelect={this.onSelect} >
          {loop(treeData)}
        </Tree>
      </div>
    );
  }
}

export default regVisitTree;
