/**
 * 新闻列表
 */

import React, { Component } from 'react';
import {
} from 'react-native';

import NewsListComponent from './NewsListComponent';


class NewsList extends Component {
  componentDidMount() {
    this.props.navigation.setParams({
      title: this.props.navigation.state.params.title,
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
// NewsList.navigationOptions = {
//   title: '健康资讯',
// };
NewsList.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation.state.params ? navigation.state.params.title : '信息列表',
});
export default NewsList;
