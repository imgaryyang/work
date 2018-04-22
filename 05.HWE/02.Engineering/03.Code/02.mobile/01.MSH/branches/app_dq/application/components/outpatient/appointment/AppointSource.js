/**
 * 预约挂号3
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';

import Card from 'rn-easy-card';
import Toast from 'react-native-root-toast';
import Global from '../../../Global';
import PlaceholderView from '../../../modules/PlaceholderView';
import NoDataView from '../../../modules/NoDataView';
import { chineseDate } from '../../../utils/Filters';

class AppointSource extends Component {
  static displayName = 'AppointSource';
  static description = '号源';
  static margin = 10;
  static radius = 5;

  constructor(props) {
    super(props);

    this.fetchData = this.fetchData.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.gotoAppoint = this.gotoAppoint.bind(this);

    this.state = {
      doRenderScene: false,
      data: [],
      reloading: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => { this.fetchData(); });
    this.props.navigation.setParams({
      title: this.props.navigation.state.params.data.docName || '选择号源',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: true,
      afterChooseHospital: null,
      afterChoosePatient: null,
      hideNavBarBottomLine: false,
    });
  }

  gotoAppoint(data) {
    this.props.navigation.navigate('Appoint', {
      data,
      backIndex: this.props.navigation.state.params.backIndex,
      title: '预约挂号',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: true,
      afterChoosePatient: null,
      hideNavBarBottomLine: false,
    });
  }

  async fetchData() {
    try {
      const { appointSources: data } = this.props.navigation.state.params.data;
      if (!Array.isArray(data)) throw new Error('号源数据格式错误');
      if (data.length > 0) {
        // const data = appointSources.map((item) => { return { ...item, clinicTime: item.clinicTime.slice(11, 16) }; });
        this.setState({ data, doRenderScene: true, reloading: false });
      } else {
        this.setState({ doRenderScene: true, reloading: false });
      }
    } catch (e) {
      this.setState({ doRenderScene: true, reloading: false });
      Toast.show(String(e));
    }
  }

  renderBody(doRenderScene, reloading, data) {
    if (doRenderScene) {
      if (data.length > 0) {
        return (
          <ScrollView contentContainerStyle={styles.body}>
            {
              data.map((item, index) => {
                return (
                  <TouchableOpacity key={`${item}${index + 1}`} style={styles.button} onPress={() => this.gotoAppoint(item)} >
                    <View style={styles.buttonLeft}>
                      <Text style={styles.buttonLeftText}>{item.num}</Text>
                    </View>
                    <View style={styles.buttonRight}>
                      <Text style={styles.buttonRightText}>{item.clinicTime.slice(11, 16)}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            }
          </ScrollView>
        );
      } else {
        return <NoDataView msg="未查到可用号源" reloading={reloading} />;
      }
    } else {
      return <PlaceholderView style={{ backgroundColor: Global.colors.IOS_GRAY_BG }} />;
    }
  }

  render() {
    const { doRenderScene, reloading, data } = this.state;
    const { depName, clinicTypeName, clinicDate, shiftName } = this.props.navigation.state.params.data;
    const title = `${depName} > ${clinicTypeName} > ${chineseDate(clinicDate)} > ${shiftName}`;

    return (
      <View style={styles.container}>
        <Card style={styles.header}>
          <Text style={styles.headerText} numberOfLines={1}>{title}</Text>
        </Card>
        {
          this.renderBody(doRenderScene, reloading, data)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Global.colors.IOS_GRAY_BG,
  },
  header: {
    margin: AppointSource.margin,
    borderRadius: AppointSource.radius,
    paddingLeft: 0,
    paddingRight: 0,
    // backgroundColor: Global.colors.IOS_GRAY_BG,
  },
  headerText: {
    textAlign: 'center',
    color: Global.colors.FONT_GRAY,
    fontSize: 13,
  },
  body: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    width: (Global.getScreen().width - (4 * AppointSource.margin)) / 3, // 一行3个按钮，按钮宽度=(屏幕宽度-4*间隙宽度)/3
    marginLeft: AppointSource.margin,
    borderWidth: Global.lineWidth,
    borderColor: Global.colors.LINE,
    backgroundColor: 'white',
    marginBottom: AppointSource.margin,
    height: 55,
    flexDirection: 'row',
    borderRadius: AppointSource.radius,
  },
  buttonLeft: {
    flex: 2,
    backgroundColor: Global.colors.IOS_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: AppointSource.radius,
    borderBottomLeftRadius: AppointSource.radius,
  },
  buttonLeftText: {
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
  },
  buttonRight: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: AppointSource.radius,
    borderBottomRightRadius: AppointSource.radius,
  },
  buttonRightText: {
    fontSize: 13,
    textAlign: 'center',
    color: Global.colors.FONT_GRAY,
  },
});

// AppointSource.navigationOptions = ({ navigation }) => ({
//   title: navigation.state.params.data.docName || '选择号源',
// });

export default AppointSource;
