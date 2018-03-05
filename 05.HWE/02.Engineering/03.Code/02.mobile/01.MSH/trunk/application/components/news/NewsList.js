/**
 * 新闻列表
 */

import React, { Component } from 'react';
import {
} from 'react-native';

import NewsListComponent from './NewsListComponent';


class NewsList extends Component {
  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.props.navigation.setParams({
      title: params ? params.title || '新闻列表' : '新闻列表',
      hideNavBarBottomLine: true,
    });
  }
  render() {
    return (
      <NewsListComponent
        fkType={this.props.navigation.state.params.fkType}
        fkId={this.props.navigation.state.params.fkId}
        navigation={this.props.navigation}
      />
    );
  }
}

NewsList.navigationOptions = () => ({
});

export default NewsList;
