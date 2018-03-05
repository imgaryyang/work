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
  ListView,
  ActivityIndicator,
} from 'react-native';

import EasyIcon from 'rn-easy-icon';

import Global from '../../../Global';

const menu = [
  { icon: 'ios-menu-outline', text: '列表测试', component: 'SampleList' },
  { icon: 'ios-albums-outline', text: '组件测试', component: 'ComponentTest' },
  { icon: 'ios-barcode-outline', text: 'Easy Form - Default configuration', component: 'EasyFormTest1' },
  { icon: 'ios-barcode-outline', text: 'Easy Form - Line Inputs Form', component: 'LineInputsFormTest' },
  { icon: 'ios-barcode-outline', text: 'Easy Form - Line Inputs Form 1', component: 'LineInputsFormTest1' },
  // {text: '推送测试', component: PushTest},
];

class SampleMenu extends Component {
  static displayName = 'SampleMenu';
  static description = '样例列表';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.INDICATOR_CONTAINER]} >
        <ActivityIndicator />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  state = {
    doRenderScene: false,
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }).cloneWithRows(menu),
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '样例',
    });
  }

  renderRow(item) {
    return (
      <TouchableOpacity
        key={item}
        style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15 }]}
        onPress={() => this.props.navigation.navigate(item.component)}
      >
        <EasyIcon name={item.icon} size={26} width={50} height={30} color={Global.colors.IOS_DARK_GRAY} />
        <Text style={{ flex: 1 }}>{item.text}</Text>
        <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
      </TouchableOpacity>
    );
  }

  render() {
    if (!this.state.doRenderScene) {
      return SampleMenu.renderPlaceholderView();
    }

    return (
      <View style={Global.styles.CONTAINER} >
        <ScrollView style={styles.scrollView} >
          <ListView
            style={styles.list}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            renderSeparator={(sectionID, rowID) => {
              return (<View key={`Sep_${rowID}`} style={Global.styles.FULL_SEP_LINE} />);
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  list: {
    backgroundColor: '#ffffff',
  },
});

SampleMenu.navigationOptions = {
};

export default SampleMenu;

