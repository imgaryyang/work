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
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-root-toast';
import Icon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';
import Picker from 'rn-easy-picker';
import moment from 'moment';
import _ from 'lodash';
import Global from '../../../Global';
import PlaceholderView from '../../../modules/PlaceholderView';
import ScheduleItem from './ScheduleItem';
import listState, { initPage } from '../../../modules/ListState';
import { forList } from '../../../services/outpatient/ScheduleService';

const initDateData = [{ value: 0, label: '所有日期' }];
const initJobTitleData = [
  { value: 0, label: '全部职称' },
  { value: 1, label: '主任医师' },
  { value: 2, label: '副主任医师' },
  { value: 3, label: '主治医师' },
  { value: 4, label: '住院医师' },
  { value: 5, label: '其他' },
];
const initShiftData = [
  { value: 0, label: '全天' },
  { value: 1, label: '上午' },
  { value: 2, label: '下午' },
];
const initAreaData = [
  { value: 0, label: '全院' },
];
const CaretIcon = <Icon name="caret-down" iconLib="fa" size={13} width={13} height={13} color={Global.colors.IOS_ARROW} />;

class Schedule extends Component {
  static displayName = 'Schedule';
  static description = '排班';

  constructor(props) {
    super(props);

    this.listRef = null;
    this.datePickerRef = null;
    this.jobTitlePickerRef = null;
    this.shiftPickerRef = null;
    this.areaPickerRef = null;
    this.fetchData = this.fetchData.bind(this);
    this.filterData = this.filterData.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    this.onChange = this.onChange.bind(this);
    this.gotoAppointSource = this.gotoAppointSource.bind(this);

    this.state = {
      doRenderScene: false,
      ctrlState: listState,
      page: initPage,
      query: {
        hosNo: props.navigation.state.params.hosNo,
        depNo: props.navigation.state.params.depNo,
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(7, 'days').format('YYYY-MM-DD'),
      }, // 后台查询条件
      allData: [], // 根据query查出的后台全部数据
      filterData: [], // allData基础上，根据过滤条件过滤出的数据
      renderData: [], // filterData基础上，根据翻页条件page过滤出的数据，是真正在界面渲染展示的数据
      dateData: initDateData,
      selectedDate: initDateData[0],
      jobTitleData: initJobTitleData,
      selectedJobTitle: initJobTitleData[0],
      shiftData: initShiftData,
      selectedShift: initShiftData[0],
      areaData: initAreaData,
      selectedArea: initAreaData[0],
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
    this.props.navigation.setParams({ title: this.props.navigation.state.params.title || '选择排班' });
  }

  onRefresh() {
    // 滚动到列表顶端
    this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
    const { query, ctrlState } = this.state;

    // 重新发起按条件查询
    this.setState({
      query: {
        ...query,
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(7, 'days').format('YYYY-MM-DD'),
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

  onChange(key, value) {
    const { allData, ctrlState } = this.state;
    // 滚动到列表顶端
    this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });

    const { start, limit } = initPage;
    const newFilterData = this.filterData(allData, { [key]: value });
    const newTotal = newFilterData.length;
    this.setState({
      [key]: value,
      filterData: newFilterData,
      page: { ...initPage, total: newTotal },
      renderData: newFilterData.slice(start, start + limit),
      ctrlState: { ...ctrlState, refreshing: false, infiniteLoading: false, noMoreData: (start + limit >= newTotal) },
    });
  }

  gotoAppointSource(data) {
    if (data.enableNum > 0) {
      const { navigation } = this.props;
      navigation.navigate('AppointSource', {
        // 为测试方便，无值时写死5
        data: { ...data, schNo: data.no || 5 },
        backIndex: navigation.state.params.backIndex,
        showCurrHospitalAndPatient: true,
        allowSwitchHospital: false,
        allowSwitchPatient: true,
        afterChooseHospital: null,
        afterChoosePatient: null,
        hideNavBarBottomLine: false,
      });
    } else {
      Toast.show('该排班已约满！');
    }
  }

  filterData(data, cond) {
    const { selectedDate, selectedJobTitle, selectedShift, selectedArea } = this.state;

    const newSelectedDate = (cond && cond.selectedDate) || selectedDate;
    const newSelectedJobTitle = (cond && cond.selectedJobTitle) || selectedJobTitle;
    const newSelectedShift = (cond && cond.selectedShift) || selectedShift;
    const newSelectedArea = (cond && cond.selectedArea) || selectedArea;

    return data.filter(item =>
      (newSelectedDate === initDateData[0] || newSelectedDate.label === item.clinicDate) &&
      (newSelectedJobTitle === initJobTitleData[0] || newSelectedJobTitle.label === item.docJobTitle) &&
      (newSelectedShift === initShiftData[0] || newSelectedShift.label === item.shiftName) &&
      (newSelectedArea === initAreaData[0] || newSelectedArea.label === item.area));
  }

  async fetchData() {
    const { ctrlState, page, query, renderData, filterData, selectedDate } = this.state;

    try {
      if (ctrlState.refreshing) {
        const { result, success, msg } = await forList(query);
        const { start, limit } = initPage;

        if (success) {
          const newFilterData = this.filterData(result);
          const total = newFilterData.length;
          const newDateData = initDateData.concat(_.uniqBy(result, 'clinicDate').map((item, index) => { return { value: index + 1, label: item.clinicDate }; }));
          const newSelectedDate = newDateData.find(item => item.label === selectedDate.label) || initDateData[0];
          this.setState({
            dateData: newDateData,
            selectedDate: newSelectedDate,
            allData: result,
            filterData: newFilterData,
            renderData: newFilterData.slice(start, start + limit),
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
          Toast.show(`错误：${msg}`);
        }
      } else {
        const { start, limit, total } = page;
        this.setState({
          renderData: renderData.concat(filterData.slice(start, start + limit)),
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
    const {
      doRenderScene,
      renderData,
      ctrlState,
      dateData,
      selectedDate,
      jobTitleData,
      selectedJobTitle,
      shiftData,
      selectedShift,
      areaData,
      selectedArea,
    } = this.state;

    if (!doRenderScene) {
      return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景
    }

    return (
      <View style={Global.styles.CONTAINER}>
        <View style={styles.topBar}>
          <TouchableOpacity style={[styles.topBarItem, styles.flex5]} onPress={() => this.datePickerRef.toggle()}>
            <Text style={styles.blueText} numberOfLines={1}>{selectedDate.label}</Text>
            {CaretIcon}
          </TouchableOpacity>
          <Picker
            ref={(ref) => { this.datePickerRef = ref; }}
            dataSource={dateData}
            selected={selectedDate.value}
            onChange={item => this.onChange('selectedDate', item)}
            center
          />
          <Sep width={Global.lineWidth} bgColor={Global.colors.LINE} />
          <TouchableOpacity style={[styles.topBarItem, styles.flex5]} onPress={() => this.jobTitlePickerRef.toggle()}>
            <Text style={styles.blueText} numberOfLines={1}>{selectedJobTitle.label}</Text>
            {CaretIcon}
          </TouchableOpacity>
          <Picker
            ref={(ref) => { this.jobTitlePickerRef = ref; }}
            dataSource={jobTitleData}
            selected={selectedJobTitle.value}
            onChange={item => this.onChange('selectedJobTitle', item)}
            center
          />
          <Sep width={Global.lineWidth} bgColor={Global.colors.LINE} />
          <TouchableOpacity style={[styles.topBarItem, styles.flex4]} onPress={() => this.shiftPickerRef.toggle()}>
            <Text style={styles.blueText} numberOfLines={1}>{selectedShift.label}</Text>
            {CaretIcon}
          </TouchableOpacity>
          <Picker
            ref={(ref) => { this.shiftPickerRef = ref; }}
            dataSource={shiftData}
            selected={selectedShift.value}
            onChange={item => this.onChange('selectedShift', item)}
            center
          />
          <Sep width={Global.lineWidth} bgColor={Global.colors.LINE} />
          <TouchableOpacity style={[styles.topBarItem, styles.flex4]} onPress={() => this.areaPickerRef.toggle()}>
            <Text style={styles.blueText} numberOfLines={1}>{selectedArea.label}</Text>
            {CaretIcon}
          </TouchableOpacity>
          <Picker
            ref={(ref) => { this.areaPickerRef = ref; }}
            dataSource={areaData}
            selected={selectedArea.value}
            onChange={item => this.onChange('selectedArea', item)}
            center
          />
        </View>
        <FlatList
          ref={(ref) => { this.listRef = ref; }}
          data={renderData}
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
          ListFooterComponent={() => { return this.renderFooter({ data: renderData, ctrlState, callback: this.onInfiniteLoad }); }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topBar: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: Global.lineWidth,
    borderBottomColor: Global.colors.LINE,
  },
  topBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  flex4: {
    flex: 4,
  },
  flex5: {
    flex: 5,
  },
  blueText: {
    color: Global.colors.IOS_BLUE,
    fontSize: 13,
  },
});

export default Schedule;
