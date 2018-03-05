import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import Sep from 'rn-easy-separator';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import Global from '../../Global';
import Item from '../../modules/PureListItem';

class TestItem extends Component {
  static displayName = 'TestItem';
  static description = '检查项目列表';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  constructor(props) {
    super(props);
    this.renderTestItem = this.renderTestItem.bind(this);
    this.showDetail = this.showDetail.bind(this);
  }


  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }

  showDetail(item, index) {
    this.props.navigate('ShowDetailItems', {
      barcode: item.barcode,
      data: item,
      checkId: item.id,
      checkName: item.itemName,
      index,
    });
  }
  /**
   * 渲染检查项目行数据
   */
  renderTestItem({ item, index }) {
    console.log('item....', item);
    const color = item.pkgName === '特检' ? 'red' : '#F68B24';
    return (
      <Item
        data={item}
        index={index}
        onPress={this.showDetail}
        chevron
      >
        <View style={styles.renderRow} >
          <View style={[styles.logo, { borderColor: `${color}` }]}>
            <Text style={[styles.logoName, { color: `${color}` }]}>{ item.pkgName } </Text>
          </View>
          <View>
            <Text style={styles.checkDate}>{ item.reportTime } </Text>
            <Text style={styles.itemName}>{ item.itemName } </Text>
          </View>
        </View>
      </Item>
    );
  }
  render() {
    return (
      <View style={Global.styles.CONTAINER}>
        <FlatList
          data={this.props.data}
          ref={(e) => { this.listRef = e; }}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
          renderItem={this.renderTestItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    marginLeft: 10,
    fontSize: 15,
    color: 'black',
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Global.getScreen().width,
    height: 40,

    backgroundColor: 'white',
    flexWrap: 'wrap',
  },
  renderRow: {
    width: Global.getScreen().width,
    height: 64,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 44,
    height: 44,
    marginLeft: 20,
    borderRadius: 22,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  logoName: {
    fontSize: 15,
  },
  checkDate: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 15,
  },
  itemName: {
    marginTop: 4,
    fontSize: 15,
    marginLeft: 15,
    color: 'black',
  },
});

const mapDispatchToProps = dispatch => ({
  navigate: (component, params) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(null, mapDispatchToProps)(TestItem);
