import React, { Component } from 'react';
import { Tabs } from 'antd';
import List from './StoreInfoQueryList';

const TabPane = Tabs.TabPane;

class StoreInfoQueryTab extends Component {
  onChange(key) {
    this.props.dispatch({
      type: 'storeInfoQuery/setState',
      payload: { activeKey: key },
    });
    this.props.resetPage();
    this.props.onSearch(this.props.searchObjs);
  }

  render() {
    const { tabArray, listProps } = this.props;
    const storeTab = tabArrayData => tabArrayData.map((item) => {
      return (
        <TabPane tab={item.tab} key={item.key}>
          <List {...listProps} />
        </TabPane>
      );
    });

    // SearchBar如果放到tabBarExtraContent中，会超长折到第二行
    return (
      <div>
        <Tabs onChange={this.onChange.bind(this)} className="compact-tab" >
          {storeTab(tabArray)}
        </Tabs>
      </div>
    );
  }
}

export default StoreInfoQueryTab;
