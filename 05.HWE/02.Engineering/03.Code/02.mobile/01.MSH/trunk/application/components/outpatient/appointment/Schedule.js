/**
 * 预约挂号2
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  FlatList,
  Text,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Modal from 'react-native-modal';
import Sep from 'rn-easy-separator';
import Card from 'rn-easy-card';
import Form from '../../../modules/form/EasyForm';
import FormConfig from '../../../modules/form/config/DefaultConfig';
import Global from '../../../Global';
import PlaceholderView from '../../../modules/PlaceholderView';
import DateBarItem from './DateBarItem';
import ScheduleItem from './ScheduleItem';
import listState, { initPage } from '../../../modules/ListState';
import { forList } from '../../../services/outpatient/ScheduleService';

const shifts = [
  { label: '上午', value: '上午' },
  { label: '下午', value: '下午' },
  { label: '全天', value: '全天' },
];

class Schedule extends Component {
  static displayName = 'Schedule';
  static description = '排班';

  constructor(props) {
    super(props);

    const dateBarData = DateBarItem.fetchDateBarData();
    const dateSelected = dateBarData[1];
    this.listRef = null;
    this.fetchData = this.fetchData.bind(this);
    this.filterData = this.filterData.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.gotoAppointSource = this.gotoAppointSource.bind(this);
    this.toggleModalVisible = this.toggleModalVisible.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.onConfirmModal = this.onConfirmModal.bind(this);
    this.onModalClose = this.onModalClose.bind(this);

    this.state = {
      doRenderScene: false,
      ctrlState: listState,
      page: initPage,
      dateBarData,
      dateSelected,
      formValue: { shift: '全天' },
      shiftSelected: '全天',
      query: {
        hosNo: props.navigation.state.params.hosNo,
        depNo: props.navigation.state.params.depNo,
        startDate: dateBarData[1].format10,
        endDate: dateBarData[dateBarData.length - 1].format10,
      }, // 后台查询条件
      allData: [], // 根据query查出的后台全部数据
      filterData: [], // allData基础上，根据过滤条件过滤出的数据
      shownData: [], // filterData基础上，根据翻页条件page过滤出的数据，是真正在界面展示的数据
      isModalVisible: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState(
        {
          doRenderScene: true,
          ctrlState: { ...this.state.ctrlState, refreshing: true },
        },
        () => { this.fetchData(); },
      );
    });
    this.props.navigation.setParams({
      title: this.props.navigation.state.params.title || '选择排班',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: true,
      afterChooseHospital: null,
      afterChoosePatient: null,
      hideNavBarBottomLine: false,
    });
  }

  onRefresh() {
    // 滚动到列表顶端
    this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
    const { query, ctrlState } = this.state;
    const dateBarData = DateBarItem.fetchDateBarData();
    // 重新发起按条件查询
    this.setState({
      dateBarData,
      // dateSelected: dateBarData[1],
      shiftSelected: '全天',
      formValue: { shift: '全天' },
      query: {
        ...query,
        startDate: dateBarData[1].format10,
        endDate: dateBarData[dateBarData.length - 1].format10,
      },
      ctrlState: {
        ...ctrlState,
        refreshing: true,
        infiniteLoading: false,
        noMoreData: false,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchData());
  }

  // 列表滑动到底部自动触发
  onEndReached() {
    if (this.state.ctrlState.refreshing ||
      this.state.ctrlState.infiniteLoading ||
      this.state.ctrlState.noMoreData ||
      this.state.ctrlState.requestErr) {
      return;
    }
    this.onInfiniteLoad();
  }

  // 无限加载请求
  onInfiniteLoad() {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: false,
        infiniteLoading: true,
        noMoreData: false,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchData());
  }

  onSelectDate(data) {
    const { allData, ctrlState } = this.state;
    // 滚动到列表顶端
    this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });

    const { start, limit } = initPage;
    const newFilterData = this.filterData(allData, { dateSelected: data });
    const newTotal = newFilterData.length;
    this.setState({
      dateSelected: data,
      filterData: newFilterData,
      page: { ...initPage, total: newTotal },
      shownData: newFilterData.slice(start, start + limit),
      ctrlState: { ...ctrlState, refreshing: false, infiniteLoading: false, noMoreData: (start + limit >= newTotal) },
    });
  }

  onFormChange(fieldName, fieldValue, formValue) {
    this.setState({ formValue });
  }

  onConfirmModal() {
    this.toggleModalVisible();
    const { allData, ctrlState, formValue } = this.state;
    // 滚动到列表顶端
    this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });

    const { start, limit } = initPage;
    const newFilterData = this.filterData(allData, { shiftSelected: formValue.shift });
    const newTotal = newFilterData.length;
    this.setState({
      shiftSelected: formValue.shift,
      filterData: newFilterData,
      page: { ...initPage, total: newTotal },
      shownData: newFilterData.slice(start, start + limit),
      ctrlState: { ...ctrlState, refreshing: false, infiniteLoading: false, noMoreData: (start + limit >= newTotal) },
    });
  }

  onModalClose() {
    this.toggleModalVisible();
    this.setState({
      formValue: { shift: this.state.shiftSelected },
    });
  }

  gotoAppointSource(data) {
    if (data.enableNum > 0) {
      // this.props.navigation.navigate('AppointSource', { data });
      // 为测试方便，写死no: 5
      // this.props.navigation.navigate('AppointSource', { data: { ...data, no: 5 }, backIndex: this.props.nav.index });
      const { navigation } = this.props;
      navigation.navigate('AppointSource', { data: { ...data, no: 5 }, backIndex: navigation.state.params.backIndex });
    } else {
      Toast.show('该排班已约满！');
    }
  }

  filterData(data, cond) {
    const dateSelected = cond && cond.dateSelected ? cond.dateSelected.format10 : this.state.dateSelected.format10;
    const shiftSelected = cond && cond.shiftSelected ? cond.shiftSelected : this.state.shiftSelected;
    // return data.filter(item => dateSelected.format10 === '日期' || dateSelected.format10 === item.clinicDate);
    return data.filter(item =>
      (dateSelected === '日期' || dateSelected === item.clinicDate) &&
      (shiftSelected === '全天' || shiftSelected === item.shiftName));
  }

  toggleModalVisible() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  async fetchData() {
    const { ctrlState, page, query, shownData, filterData } = this.state;

    try {
      if (ctrlState.refreshing) {
        const { result, success, msg } = await forList(query);
        const { start, limit } = initPage;
        if (success) {
          const newFilterData = this.filterData(result);
          const total = newFilterData.length;
          this.setState({
            allData: result,
            filterData: newFilterData,
            shownData: newFilterData.slice(start, start + limit),
            ctrlState: {
              ...ctrlState,
              refreshing: false,
              infiniteLoading: false,
              noMoreData: (start + limit >= total),
            },
            page: { ...page, total, start: start + limit },
          });
        } else {
          this.setState({
            ctrlState: {
              ...ctrlState,
              refreshing: false,
              infiniteLoading: false,
              noMoreData: true,
              requestErr: true,
              requestErrMsg: { msg },
            },
          });
          this.handleRequestException({ msg });
        }
      } else {
        const { start, limit, total } = page;
        this.setState({
          shownData: shownData.concat(filterData.slice(start, start + limit)),
          ctrlState: {
            ...ctrlState,
            refreshing: false,
            infiniteLoading: false,
            noMoreData: (start + limit >= total),
          },
          page: { ...page, start: start + limit },
        });
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          ...ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }
  }

  render() {
    const { doRenderScene, shownData, dateBarData, dateSelected, ctrlState, isModalVisible, formValue } = this.state;

    if (!doRenderScene) {
      return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景
    }

    return (
      <View style={Global.styles.CONTAINER}>
        <FlatList
          horizontal
          style={styles.dateBar}
          data={dateBarData}
          extraData={dateSelected}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          renderItem={({ item }) => (
            <DateBarItem
              data={item}
              onPress={this.onSelectDate}
              selected={dateSelected.format10 === item.format10}
            />
          )}
          initialNumToRender={10}
          ItemSeparatorComponent={() => (<Sep width={Global.lineWidth} bgColor={Global.colors.LINE} />)}
        />
        <FlatList
          ref={(ref) => { this.listRef = ref; }}
          data={shownData}
          initialNumToRender={10}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          renderItem={({ item }) => <ScheduleItem data={item} onPress={this.gotoAppointSource} />}
          ItemSeparatorComponent={() => (<Sep height={Global.lineWidth} bgColor={Global.colors.LINE} />)}
          // 控制下拉刷新
          refreshing={ctrlState.refreshing}
          onRefresh={this.onRefresh}
          // 控制无限加载
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.05}
          无数据占位符
          ListEmptyComponent={() => {
            return this.renderEmptyView({
              ctrlState,
              msg: '暂无排班信息',
              reloadMsg: '点击刷新按钮重新查询',
              reloadCallback: this.onRefresh,
            });
          }}
          // 列表底部
          ListFooterComponent={() => { return this.renderFooter({ data: shownData, ctrlState, callback: this.onInfiniteLoad }); }}
        />
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          text="筛选"
          size="small"
          onPress={this.toggleModalVisible}
        />
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={this.onModalClose}
          animationIn="fadeIn"
        >
          <Card radius={5} noPadding style={{ maxHeight: (Global.getScreen().height - 40), paddingBottom: 15 }} >
            <View style={styles.cardTitleContainer} >
              <Button clear stretch={false} style={styles.closeButton} onPress={this.onModalClose} >
                <Icon iconLib="mi" name="close" color={Global.colors.FONT_GRAY} size={18} width={18} height={18} />
              </Button>
              <Text style={styles.cardTitle} >筛选</Text>
              <Button clear stretch={false} style={styles.refreshButton} onPress={this.onConfirmModal} >
                <Icon iconLib="mi" name="refresh" color={Global.colors.FONT_GRAY} size={18} width={18} height={18} />
                <Text>确定</Text>
              </Button>
            </View>
            <Form
              // ref={(c) => { this.form = c; }}
              onChange={this.onFormChange}
              config={FormConfig}
              labelWidth={80}
              value={formValue}
              showLabel
              // labelPosition={this.state.labelPosition}
            >
              <Form.Checkbox
                style={null}
                name="shift"
                label="午别"
                required
                dataSource={shifts}
                notNull
              />
            </Form>
            {/* <FlatList*/}
            {/* ref={(c) => { this.listAreasRef = c; }}*/}
            {/* data={inpatientAreas}*/}
            {/* style={styles.list}*/}
            {/* keyExtractor={(item, index) => `${item}${index + 1}`}*/}
            {/* // 渲染行*/}
            {/* renderItem={this.renderAreasItem}*/}
            {/* // 渲染行间隔*/}
            {/* ItemSeparatorComponent={() => (<Sep height={1} bgColor={Global.colors.LINE} />)}*/}
            {/* // 控制下拉刷新*/}
            {/* refreshing={this.state.areasRefreshing}*/}
            {/* onRefresh={this.refreshAreas}*/}
            {/* />*/}
          </Card>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateBar: {
    flexGrow: 0, // 避免主List无数据时，dateBar伸长
    borderBottomWidth: Global.lineWidth,
    borderBottomColor: Global.colors.LINE,
  },
  button: {
    position: 'absolute',
    right: 10,
    bottom: 65,
    paddingVertical: 0,
    paddingHorizontal: 15,
    borderRadius: 25,
    // shadowColor: 'black',
    // shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: 0.6,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 12,
    color: Global.colors.IOS_BLUE,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: Global.colors.LINE,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    color: Global.colors.FONT_GRAY,
    fontWeight: '600',
    textAlign: 'center',
    paddingLeft: 30,
  },
  refreshButton: {
    width: 70,
    flexDirection: 'row',
  },
  closeButton: {
    width: 40,
    flexDirection: 'row',
  },
  areaItemText: {
    fontSize: 16,
    color: Global.colors.FONT_GRAY,
  },
});

// Schedule.navigationOptions = ({ navigation }) => ({
//   title: navigation.state.params.title || '选择排班',
// });
export default Schedule;
