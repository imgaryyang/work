'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    ListView,
    Text,
    Image,
    AppRegistry,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    TextInput,
  InteractionManager,
} from 'react-native';

import * as Global  from '../../Global';
import Icon         from 'react-native-vector-icons/Ionicons';
import NavBar       from 'rn-easy-navbar';
import Calendar     from 'react-native-calendar';

import NavBar           from 'rn-easy-navbar';
import Button           from 'rn-easy-button';
import Separator        from 'rn-easy-separator';

import UserAction       from '../../flux/UserAction';
import UserStore        from '../../flux/UserStore';
import FAIcon           from 'react-native-vector-icons/FontAwesome';
import MedAlarmList       from '../../elh/medAlarm/MedAlarmList';      /*用药*/

const MEDALARMLIST_URL = 'elh/hospital/mng/list/0/10';

class MedAlarmListDetail extends Component {

    static displayName = 'MedAlarmListDetail';
    static description = '用药列表';
    datas = [];
    //用药流程 1，

    static propTypes = {
        
    };

    static defaultProps = {
    };

    state = {
        doRenderScene: false,
        userInfo: null,
        dateArray: [], //有提醒的日期
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }), // 某天的提醒，按照时间生序排列。
        
    };

    constructor (props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.feachData = this.feachData.bind(this);
        this.push = this.push.bind(this);

    }

    componentDidMount () {
        console.log("HSHAHHFHADHFA");
        
        this.unUserStoreChange = UserStore.listen(this.onUserStoreChange);

        InteractionManager.runAfterInteractions(() => {
            this.getUser();
            this.feachData();
            this.setState({doRenderScene: true});
        });
    }
    onUserStoreChange (_user) {
        // console.log('========================profile UserStore   Changed!!! =======================');
        this.setState({
            userInfo: _user.user,
        });
        // console.log(this.state.userInfo.portrait);
        // console.log('========================hUserStore.getUser()aha UserStore   Changed!!! =======================');
    }
    componentWillUnmount () {
        this.unUserStoreChange();
    }
    async getUser () {
        this.setState({
            userInfo: UserStore.getUser(),
        });
    }
    //获取用户用药列表信息
    async feachData () {
        console.log("HSHAHHFHADHFA");
        try {
            
            this.datas = [{beginDate:'2016-07-01',endDate:'2016-07-03',alarmTime:'10:10',description:'藿香正气丸，两颗；阿莫西林，3颗'},
                         {beginDate:'2016-07-03',endDate:'2016-07-04',alarmTime:'18:10',description:'藿香正气丸，两颗；阿莫西林，3颗'},
                        ];
            // if (responseData.success == true) {}
                this.setState({
                    dateArray:['2016-07-01','2016-07-02','2016-07-03','2016-07-04','2016-07-05'],
                    dataSource: this.state.dataSource.cloneWithRows(this.datas),
                });
                this.toast("验证成功！");

            
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
            //this.requestCatch(e);
        }
        
    }
    push(title,component,passProps){
            this.props.navigator.push({
                title: title,
                component: component,
                hideNavBar: true,
                passProps: passProps,
            });
    }

      onDateSelect (date) {
        var date1 = date.substring(0,10);
        // console.log("onDateSelect-----------");
        console.log(date);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.datas),

        });
    }


    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style = {Global._styles.CONTAINER} >
            <ScrollView keyboardShouldPersistTaps = {true}>
                {this._getNavBar()}
                <TouchableOpacity onPress={()=>{this.push("用药列表",MedAlarmList,{userInfo:this.state.userInfo});}}>
                    <EasyIcon name = "md-add" color = '#BBBBBB' size = {20} width = {40} height = {40} />
                </TouchableOpacity>
                <Calendar
                        style={{backgroundColor:'white'}}
                        scrollEnabled dd={false}              // False disables swiping. Default: True   禁用滑动(false),默认(true)
                        showControls={true}               // False hides prev/next buttons. Default: False 隐藏上一页/下一页(false),默认(false)
                        titleFormat={'YYYY-MM'}         // Format for displaying current month. Default: 'MMMM YYYY'  格式显示当前月份
                        dayHeadings={[' 日 ',' 一 ',' 二 ',' 三 ',' 四 ',' 五 ',' 六 ']}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                        monthNames={['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']} // Defaults to english names of months  月默认为英文名字
                        prevButtonText={'上月'}           // Text for previous button. Default: 'Prev' 之前的按钮的文本默认为‘Prev’
                        nextButtonText={'下月'}           // Text for next button. Default: 'Next'
                        onDateSelect={(date) => this.onDateSelect(date)} // Callback after date selection  回调后日期选择
                        onTouchPrev={this.onTouchPrev}    // Callback for prev touch event
                        onTouchNext={this.onTouchNext}    // Callback for next touch event
                        onSwipePrev={this.onSwipePrev}    // Callback for back swipe event
                        onSwipeNext={this.onSwipeNext}    // Callback for forward swipe event
                        eventDates={this.state.dateArray}       // Optional array of moment() parseable dates that will show an event indicator             // Defaults to today
                        startDate={'2016-06-09'}          // The first month that will display. Default: current month当前月
                        //selectedDate={'2016-06-09'}       // Day to be selected
                        customStyle={{day: {fontSize: 15, textAlign: 'center'}, 
                            calendarControls:{ flex: 0,}, 
                            eventIndicator:{backgroundColor:Global._colors.IOS_GREEN,width:20}, 
                            calendarContainer:{flexDirection: 'column',backgroundColor:'white'},
                            //weekendHeading:{backgroundColor:Global._colors.IOS_BLUE},
                            //dayHeading:{backgroundColor:Global._colors.IOS_YELLOW},
                        }} 
                        weekStart={0} />
                <Separator height = {10} />
                <ListView
                    key = {this.data}
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderItem}
                    enableEmptySections = {true}
                    renderSeparator = {this.renderSeparator}
                    />
            </ScrollView>
            </View>
        );
    }
    renderItem (item){
        console.log(item);
        return(
            <View style={{backgroundColor:'white',flex:1,}}>
                <View style={styles.container1}>
                    <FAIcon  name='bell-o' size={20} color={Global._colors.IOS_ARROW} style={[Global._styles.ICON, {width: 40}]} />
                    <Text>{item.alarmTime}</Text>
                </View>
                <View style={styles.container2}>
                    <Text>{item.description}</Text>
                </View>
            </View>
        );

    }
    renderSeparator (sectionID, rowID, adjacentRowHighlighted) {
        return (
            <Separator key = {rowID} height = {10} />
        )
    }
    _renderPlaceholderView () {
        return (
            <View style = {Global._styles.CONTAINER}>
                {this._getNavBar()}
            </View>
        );
    }
    _getNavBar () {
        return (
            <NavBar title = '用药' 
                navigator = {this.props.navigator} 
                route = {this.props.route}
                hideBackButton = {false} 
                hideBottomLine = {false} />
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container1: {
        marginLeft: 10,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center', 
        // justifyContent: 'center',
    },
    container2: {
        marginLeft: 10,
        height: 60,
    },
    picker: {
        marginLeft: 10,
        width: Global.getScreen().width - 60,
    },
});

export default MedAlarmListDetail;



