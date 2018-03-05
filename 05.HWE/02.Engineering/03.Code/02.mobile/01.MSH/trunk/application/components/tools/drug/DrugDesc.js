import React, {
  Component,
} from 'react';

import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import Icon from 'rn-easy-icon';
import Card from 'rn-easy-card';
import Sep from 'rn-easy-separator';
import Global from '../../../Global';
import { filterHtmlForWiki } from '../../../utils/Filters';

class Item extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }
  state = {
    selected: false,
  };
  onPress = () => {
    this.setState({ selected: !this.state.selected });
  };
  render() {
    const item = this.props.data;
    return (
      <View style={styles.rowStyle}>
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={this.onPress}>
          <Text style={{ flex: 5, color: '#000000', fontSize: 14, fontWeight: '600' }}>{item.title}</Text>
          <Icon width={20} height={20} name={this.state.selected ? 'ios-arrow-up' : 'ios-arrow-down'} color={Global.colors.IOS_ARROW} />
        </TouchableOpacity>
        <View style={[{ display: `${this.state.selected ? 'none' : 'flex'}` }, styles.content]}>
          <Text style={{ fontSize: 13 }}>{filterHtmlForWiki(item.content)}</Text>
        </View>
      </View>
    );
  }
}

class DrugDesc extends Component {
  static displayName = 'DrugDesc';
  static description = '药品详情';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.INDICATOR_CONTAINER]} >
        <ActivityIndicator />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  state = {
    doRenderScene: false,
    data: [],
  };

  componentWillMount() {
    const value = this.props.navigation.state.params.item;
    const s = [
      { title: '适应症', content: value.indication || '暂无适应症信息介绍' },
      { title: '禁忌', content: value.taboo || '暂无禁忌信息介绍' },
      { title: '注意事项', content: value.notes || '暂无注意事项信息介绍' },
      { title: '不良反应', content: value.adverseReactions || '暂无不良反应信息介绍' }];
    this.setState({ data: s });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '药品信息', // this.props.navigation.state.params.item.drugName,
    });
  }

  renderItem({ item, index }) {
    return (
      <Item
        data={item}
        index={index}
      />
    );
  }

  render() {
    const { item } = this.props.navigation.state.params;
    if (!this.state.doRenderScene) {
      return DrugDesc.renderPlaceholderView();
    }

    return (
      <View style={Global.styles.CONTAINER_BG} >
        <ScrollView style={styles.scrollView} >
          <Card fullWidth style={{ borderTopWidth: 0 }} >
            <Text style={{ fontSize: 16, color: 'black', fontWeight: '600' }} >{filterHtmlForWiki(item.drugName)}</Text>
            <Text style={{ fontSize: 13, color: Global.colors.FONT_GRAY, marginTop: 5 }} >{item.drugType}</Text>
        </Card>
          <Sep height={15} />
          <Card fullWidth noPadding >
            <View style={styles.cardTitle}>
              <Text style={styles.cardTitleText} >成分</Text>
            </View>
            <Text style={styles.detail}>{filterHtmlForWiki(item.ingredients || '暂无成分信息介绍')}</Text>
          </Card>
          <Sep height={15} />
          <Card fullWidth noPadding >
            <View style={styles.cardTitle}>
              <Text style={styles.cardTitleText} >剂量</Text>
            </View>
            <Text style={styles.detail}>{filterHtmlForWiki(item.dosage || '暂无剂量信息介绍')}</Text>
          </Card>
          <Sep height={15} />
          <Card fullWidth noPadding >
            <FlatList
              ref={(c) => { this.listRef = c; }}
              data={this.state.data}
              style={styles.list}
              keyExtractor={(row, index) => `${row}_${index + 1}`}
              renderItem={this.renderItem}
              ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
            />
          </Card>
          <Sep height={40} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  cardTitle: {
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 40,
  },
  cardTitleText: {
    flex: 1,
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },

  list: {
    paddingLeft: 15,
    paddingRight: 15,
  },

  rowStyle: {
    paddingTop: 15,
    paddingBottom: 15,
  },

  detail: {
    fontSize: 13,
    lineHeight: 16,
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  content: {
    marginTop: 10,
  },
});

DrugDesc.navigationOptions = {
  title: '药品详情',
};

export default DrugDesc;

