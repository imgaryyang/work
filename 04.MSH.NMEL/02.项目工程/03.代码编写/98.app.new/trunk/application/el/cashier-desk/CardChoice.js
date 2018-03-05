'use strict';

import React, {
  Component,

} from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  PixelRatio,
  TouchableOpacity,
  Dimensions,
  InteractionManager,
  ListView,
  TextInput,
} from 'react-native';

import * as Global 	from '../../Global';

import NavBar 		from 'rn-easy-navbar';
// import EasyIcon     from 'rn-easy-icon';

var ACCOUNTINFO = {};

class CardChoice extends Component {

  cardList = [
    {cardName: '北京银行信用卡', cardNo: '1111', balance:100.00, type:1, bank_no:'102'},
    {cardName: '招商银行储蓄卡', cardNo: '2222', balance:200.00, type:1, bank_no:'103'},
    {cardName: '招商银行储蓄卡', cardNo: '3333', balance:200.00, type:0, bank_no:'104'},
  ];

  constructor (props) {
    super(props);

    this.state = {
      dataSource:new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }).cloneWithRows(this.cardList),
      doRenderScene:false
    };
  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      this.setState({doRenderScene: true});
    });
  }

  changePayWay(item) {
    this.props.getCard( item );
    this.props.navigator.pop();
  }

  render() {
    var listView = null;
    if(!this.state.doRenderScene)
      return this._renderPlaceholderView();
    return (
      <View>
        <ScrollView style={[styles.sv]}>
          <View style={styles.paddingPlace} />
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections = {true}
            renderRow={this.renderItem.bind(this)}
            style={[styles.list]} />

          <View style={Global._styles.PLACEHOLDER20} />

        </ScrollView>
      </View>
    )
  }

  renderItem(item, sectionID, rowID) {

    var logo = item.type != '0' ? Global._bankLogos[item.bank_no] : <View style={{width: 30}} />;

    var topLine = rowID === '0' ? <View style={Global._styles.FULL_SEP_LINE} /> : null;
    var bottomLine = (<View style={Global._styles.FULL_SEP_LINE} />);

    var rowText = '';
    if (item.type == '1') {
      rowText = item.cardName + '(' + item.cardNo + ')';
    } else {
      rowText = '电子账户(可用额度' + item.balance + ')元';
    }

    var checkIcon = null;
    if ( item.cardNo == this.props.cardNo ) {
      checkIcon = <EasyIcon iconLib='fa' name='check' size={16} color = {Global._colors.IOS_BLUE}/>
    }

    return (
      <View style={styles.bankList}>
        {topLine}
        <TouchableOpacity style={[styles.rend_row, Global._styles.CENTER, {padding: 15}]} onPress={()=>{this.changePayWay(item)}}>
          {logo}
          <View style={{paddingLeft: 10, flex: 1}}>
            <Text style={[styles.text, {fontSize: 15}]}>
              {rowText}
            </Text>
          </View>
          {checkIcon}
        </TouchableOpacity>
        {bottomLine}
      </View>
    )
  }

  _renderPlaceholderView() {
    return (
      <View>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  paddingPlace: {
    flex: 1,
  },
  sv: {
  },

  bankList:{
    backgroundColor: '#FFFFFF',
  },
  rend_row: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  thumb: {
    width: 40,
    height: 40,
  },
  text: {
    flex: 1,
  },
  bankOption:{
    flexDirection:'row',
  },
  textFont:{
    color:Global._colors.IOS_BLUE,
    paddingRight:20
  }
});

module.exports = CardChoice;


