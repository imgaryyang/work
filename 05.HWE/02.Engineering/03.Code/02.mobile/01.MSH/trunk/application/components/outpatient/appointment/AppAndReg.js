/**
 * 预约挂号1
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import Item from './DeptItem';
import Global from '../../../Global';
import PlaceholderView from '../../../modules/PlaceholderView';
import { forDeptTree } from '../../../services/outpatient/AppointService';
import NoDataView from '../../../modules/NoDataView';

class AppAndReg extends Component {
  static displayName = 'AppAndReg';
  static description = '预约挂号';

  constructor(props) {
    super(props);

    this.showDepts = this.showDepts.bind(this);
    this.gotoSchedule = this.gotoSchedule.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.afterChooseHospital = this.afterChooseHospital.bind(this);

    this.state = {
      doRenderScene: false,
      reloading: false,
      data: [],
      selectedDeptTypeIndex: null,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => this.fetchData());
    this.props.navigation.setParams({
      title: '预约挂号',
      // showCurrHospitalAndPatient: true,
      // allowSwitchHospital: true,
      // allowSwitchPatient: true,
      // afterChoosePatient: null,
      // hideNavBarBottomLine: false,
      afterChooseHospital: this.afterChooseHospital,
    });
  }

  onRefresh() {
    this.setState(
      { reloading: true },
      () => this.fetchData(),
    );
  }

  afterChooseHospital() {
    this.setState(
      { doRenderScene: false },
      () => this.fetchData(),
    );
  }

  async fetchData() {
    try {
      const responseData = await forDeptTree({ hosId: this.props.currHospital.id });
      const { success, result, msg } = responseData;
      if (success) {
        this.setState({
          data: result || [],
          selectedDeptTypeIndex: result ? 0 : null,
          doRenderScene: true,
          reloading: false,
        });
      } else {
        this.setState({
          doRenderScene: true,
          reloading: false,
        });
        this.handleRequestException({ msg });
      }
    } catch (e) {
      this.setState({
        doRenderScene: true,
        reloading: false,
      });
      this.handleRequestException(e);
    }
  }

  showDepts(data, index) {
    this.setState({ selectedDeptTypeIndex: index });
  }

  gotoSchedule(data) {
    this.props.navigation.navigate('Schedule', {
      title: data.name,
      depNo: data.no,
      hosNo: data.hosNo,
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: true,
      afterChooseHospital: null,
      afterChoosePatient: null,
      hideNavBarBottomLine: false,
    });
  }

  render() {
    const { data, selectedDeptTypeIndex, doRenderScene, reloading } = this.state;

    if (!doRenderScene) {
      return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景
    }

    if (data.length === 0) {
      return <NoDataView msg="暂无可预约科室信息" onReload={this.onRefresh} reloading={reloading} />;
    }

    return (
      <View style={Global.styles.CONTAINER_ROW_BG}>
        <FlatList
          data={data}
          style={styles.list}
          extraData={selectedDeptTypeIndex}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          renderItem={({ item, index }) => (
            <Item
              data={item}
              index={index}
              onPress={this.showDepts}
              selected={selectedDeptTypeIndex === index}
            />
          )}
          // ItemSeparatorComponent={() => (<Sep height={Global.lineWidth} bgColor={Global.colors.LINE} />)}
        />
        <FlatList
          style={[styles.list, { backgroundColor: 'white' }]}
          // style={{ backgroundColor: 'white' }}
          data={data[selectedDeptTypeIndex].children}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          renderItem={({ item, index }) => (
            <Item
              data={item}
              index={index}
              onPress={this.gotoSchedule}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

// AppAndReg.navigationOptions = ({ navigation }) => ({
//   title: navigation.state.params.hospital.name || '选择科室',
// });

const mapStateToProps = state => ({
  currHospital: state.base.currHospital,
});

export default connect(mapStateToProps)(AppAndReg);
