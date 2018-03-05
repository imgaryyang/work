'use strict';

import React, {
  Component,

} from 'react';

import {
  Animated,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  InteractionManager,
  ListView,
  Alert,
  AsyncStorage,
} from 'react-native';

import * as Global from '../../Global';
import UserStore from '../../flux/UserStore';
import AuthAction from '../../flux/AuthAction';

import NavBar from 'rn-easy-navbar';
import EasyIcon from 'rn-easy-icon';
import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
import EasyCard from 'rn-easy-card';

import BindCard1 from './BindCard1';
import CardDetail from './CardDetail';
import Card from './Card';

class CardList extends Component {

  static displayName = 'CardList';
  static description = '卡管理中心';

  static propTypes = {};

  static defaultProps = {};

  state = {
    doRenderScene: false,
    user: UserStore.getUser(),
    bankCards: UserStore.getBankCards(),
  };

  constructor(props) {
    super(props);

    this.renderCards = this.renderCards.bind(this);
    this.renderCardTypeTitle = this.renderCardTypeTitle.bind(this);
    this.renderCard = this.renderCard.bind(this);

    this.bindCard = this.bindCard.bind(this);
    this.cardDetail = this.cardDetail.bind(this);
    this.goLogin = this.goLogin.bind(this);

    this.onUserStoreChange = this.onUserStoreChange.bind(this);
  }

  componentDidMount() {
    this.unUserStoreChange = UserStore.listen(this.onUserStoreChange);
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  componentWillUnmount() {
    this.unUserStoreChange();
  }

  onUserStoreChange() {
    this.setState({
      user: UserStore.getUser(),
      bankCards: UserStore.getBankCards(),
    });
  }

  /**
   * 打开绑定卡第一步页面
   */
  bindCard() {
    this.props.navigator.push({
      component: BindCard1,
      hideNavBar: true,
    });
  }

  /**
   * 打开卡详情页面
   */
  cardDetail(item) {
    //if(item.cardType.type != "1" && item.cardType.type != "2" && item.cardType.type != "3") return;
    this.props.navigator.push({
      component: CardDetail,
      hideNavBar: true,
      passProps: {
        item: item,
      },
    });
  }

  /**
   * 渲染卡类别
   */
  renderCardTypeTitle(item) {
    return (
      <Text key={'cardType_' + item.cardNo} style={{
        fontSize: 15,
        color: Global._colors.FONT_GRAY,
        margin: 10,
      }}>{item.cardType.name}</Text>
    );
  }

  /**
   * 渲染卡
   */
  renderCard(item) {
    return (
      <Card key={'item_' + item.cardNo}
            showType={1}
            card={item}
            onPress={() => {
              this.cardDetail(item);
            }}
      />
    );
  }

  /**
   * 渲染所有卡
   */
  renderCards() {

    let cardType, siCardTitle, siCards = [], hlthCardTitle, hlthCards = [], bankCardTitle, bankCards = [];

    if (this.state.bankCards) {
      this.state.bankCards.forEach((item) => {
        cardType = item.cardType.type;//1 - 银行卡 2 - 社保卡 3 - 健康卡
        switch (cardType) {
          case '1':
            bankCardTitle = bankCardTitle ? bankCardTitle : this.renderCardTypeTitle(item);
            bankCards.push(this.renderCard(item));
            break;
          case '2':
            siCardTitle = siCardTitle ? siCardTitle : this.renderCardTypeTitle(item);
            siCards.push(this.renderCard(item));
            break;
          case '3':
            hlthCardTitle = hlthCardTitle ? hlthCardTitle : this.renderCardTypeTitle(item);
            hlthCards.push(this.renderCard(item));
            break;
          default:
            break;
        }
      });
    }

    return (
      <View style={{marginLeft: 8, marginRight: 8}}>
        {siCardTitle}
        {siCards.map((card) => {
          return card;
        })}
        {hlthCardTitle}
        {hlthCards.map((card) => {
          return card;
        })}
        {bankCardTitle}
        {bankCards.map((card) => {
          return card;
        })}
      </View>
    );
  }

  goLogin() {
    //TODO:需要登录时调用登录
    AuthAction.clearContinuePush();
    AuthAction.needLogin();
  }

  render() {

    if (!this.state.doRenderScene) {
      return this._renderPlaceholderView();
    }

    let loginView = !this.state.user || this.state.user.id == '' ? (
      <EasyCard radius={6} style={{paddingBottom: 20, margin: 8, marginTop: 16}}>
        <Text style={[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 20}]}>{'您还未登录' + '\n' + '登录后方能查看您绑定的卡'}</Text>
        <Button text="登录" onPress={this.goLogin}/>
      </EasyCard>
    ) : null;

    let emptyView = this.state.user && this.state.user.id != '' && (!this.state.bankCards || this.state.bankCards.length == 0) ? (
      <EasyCard radius={6} style={{margin: 8, marginTop: 16}}>
        <Text style={[Global._styles.MSG_TEXT, {margin: 30}]}>{'您还未绑定卡' + '\n' + '绑卡后方能使用更多功能'}</Text>
      </EasyCard>
    ) : null;

    return (
      <View style={Global._styles.CONTAINER}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={[styles.scrollView, {
            marginBottom: Global._os == 'ios' && this.props.runInTab ? 48 : 0
          }]}>

          {loginView}
          {emptyView}

          {this.renderCards()}

          <View style={[Global._styles.CENTER, {marginTop: 39}]}>
            <Button onPress={this.bindCard} stretch={false} clear={true} style={{width: 80, height: 45}}>
              <EasyIcon name="md-add" color='#BBBBBB' size={40} width={40} height={40}/>
            </Button>
          </View>

          <Separator height={40}/>

        </ScrollView>
      </View>
    );
  }

  _renderPlaceholderView() {
    return (
      <View style={Global._styles.CONTAINER}>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    // marginBottom: Global._os == 'ios' ? 48 : 0,
  },
  icon: {
    width: 40,
    height: 40,
  },

  addText: {
    flex: 1,
    color: Global.FONT_LIGHT_GRAY1,
    textAlign: 'center',
  },
  addCardView: {
    flex: 1,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    height: 25,
    marginTop: 15,
    flexDirection: 'row',
  },
  hidden: {
    width: 1,
    height: 1,
    overflow: 'hidden',
  },

  footer: {
    height: 50,
    //flexDirection: 'row',
  },
  footerText: {
    color: Global._colors.FONT_LIGHT_GRAY1,
    fontSize: 13,
    marginTop: 10,
    //width: 100,
  },
});

export default CardList;

