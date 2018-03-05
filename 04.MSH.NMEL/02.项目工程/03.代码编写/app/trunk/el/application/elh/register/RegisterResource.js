'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    AppRegistry,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
  InteractionManager,
} from 'react-native';

import * as Global  from '../../Global';
import Calendar     from 'react-native-calendar';
import NavBar		from 'rn-easy-navbar';
import EasyIcon    	from 'rn-easy-icon';
import EasyPicker   from 'rn-easy-picker';
import Card         from 'rn-easy-card';
import Button       from 'rn-easy-button';

import Appointment  from './Appointment';

const FIND_HOSP_URL = 'elh/hospital/app/list/0/100';
const FIND_DEPT_URL = 'elh/department/app/listByHos/';
const FIND_REG_URL 	= 'elh/treat/reg/sources/appiont';

const DEVICE_WIDTH = Dimensions.get('window').width;

class RegResource extends Component {

    static displayName = 'RegResource';
    static description = '挂号';

    static propTypes = {
    };

    static defaultProps = {
    };

    state = {
        doRenderScene: false,
        regDate: [],
        hospDataSource: [],
        deptDataSource: [],
        regDataSource: [],
        dateArray1: [],
        epDefault: '',
        epDeptDefault: '',
        epDefaultId: this.props.hospitalId,
        epDeptDefaultId: this.props.departmentId,
    };

    constructor (props) {
        super(props);
        this.onDateSelect    = this.onDateSelect.bind(this);
        this.fetchData       = this.fetchData.bind(this);
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => {
				this.fetchData();
			});
        });
    }

    async fetchData () {
        this.setState({loaded: false,});
        try {
            this.showLoading();
            if (this.props.hospitalId === undefined) {
                let responseData = await this.request(Global._host + FIND_HOSP_URL, {
                    method: 'GET'
                });
                this.setState({
                    hospDataSource: responseData.result,
                    epDefault: responseData.result[0].name,
                    epDefaultId: responseData.result[0].id,
                    loaded: true,
                });
            }
            if (this.props.departmentId === undefined) {
                var data1 = "{}";
                data1 = encodeURI(data1);
                let responseData1 = await this.request(Global._host + FIND_DEPT_URL + this.state.epDefaultId , {
                    method: 'GET'
                });
                this.setState({
                    deptDataSource: responseData1.result,
                    epDeptDefault: responseData1.result[0].name,
                    epDeptDefaultId: responseData1.result[0].id,
                    loaded: true,
                });
            }
            
            this.queryRegRec(this.state.epDefaultId, this.state.epDeptDefaultId);
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
    }

    async queryRegRec (hospId, deptId) {
        try{
            let data =  encodeURI(JSON.stringify({
                hospital: hospId,
                department: deptId,
                regType: '0',  //1:实时挂号
            }));
            //var regData = "{hospital:'8a8c7db154ebe90c0154ebf8b3130009',department:'8a8c7db154ebe90c0154ebf8b3130000',regType:'1'}";
            let responseRegData = await this.request(Global._host + FIND_REG_URL+"?"+"data="+data, {
                method: 'GET'
            });
            var dateArray = new Array();
            for (var i = 0; i < responseRegData.result.length; i++) {
                if (responseRegData.result[i].last > 0) {
                    if (i == 0){
                        dateArray.push(responseRegData.result[i].date);
                    }else{
                        if (responseRegData.result[i-1].date != responseRegData.result[i].date){
                            dateArray.push(responseRegData.result[i].date);
                        }
                    }
                }
            }
            this.setState({
              regDataSource: responseRegData.result,
              dateArray1: dateArray,
              loaded: true,
            });
            this.hideLoading();
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
    }

    //日历组件点击某一日期时间
    onDateSelect (date) {
        var date1 = date.substring(0,10);
        var flag = 'false';
        
        for (var i = 0; i <= this.state.dateArray1.length; i++) {
            if (date1 == this.state.dateArray1[i]) {
                flag = 'true';
                this.props.navigator.push({
                    title: "挂号",
                    component: Appointment,
                    passProps: {
                        date: date,
                        hospId: this.state.epDefaultId,
                        deptId: this.state.epDeptDefaultId,
                        refresh: this.refresh,
                        backRoute: this.props.route,
                    },
                    hideNavBar: true,
                });
            }
        };
        if (flag == 'false') {
            flag = 'false';
            Alert.alert(
            '提示','请选择有号源日期，他们脚下有绿线哦!',
            [{text: '确定',}]);  
        }
    }

    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        var itemArray = [];
        var hospName = '';
        var hospId = '';
        var deptItemArray = [];
        var deptName = '';
        var deptId = '';
        if (this.props.hospitalId === undefined) {
            for (var i = 0; i < this.state.hospDataSource.length; i++) {
                hospName = this.state.hospDataSource[i].name;
                hospId = this.state.hospDataSource[i].id;
                    itemArray.push({label: hospName, value: hospId});
            }
        }
        if (this.props.departmentId === undefined) {
            for (var i = 0; i < this.state.deptDataSource.length; i++) {
                deptName = this.state.deptDataSource[i].name;
                deptId = this.state.deptDataSource[i].id;
                    deptItemArray.push({label: deptName, value: deptId});
            }
        }
        
        
        var hospId1 = this.state.epDefaultId;
        var deptId1 = this.state.epDeptDefaultId;
        var hospId2 = '';
        var deptId2 = '';
        
        var hospView = this.props.hospitalId === undefined ? (
            <View style = {styles.inputHolder} >
                <EasyPicker 
                    ref = {(c) => this.easyPicker = c}
                    dataSource = {itemArray}
                    selected = {this.state.epSelected}
                    onChange = {(selected) => {
                        this.setState({
                            epSelected: selected ? selected.value : null,
                            epSelectedLal: selected ? selected.label : null,
                            epDefaultId: selected ? selected.value : hospId1,
                        });
                        hospId2 = selected ? selected.value : hospId1;
                        this.queryRegRec(hospId2, deptId1);
                    }
                }/>
                <Text style={{marginLeft: 10, fontSize: 15, }} >医院：</Text>
                <TextInput style={[Global._styles.FORM.NO_BORDER_TEXT_INPUT, {flex: 1, height: 40}]} defaultValue={this.state.epDefault} value={this.state.epSelectedLal} 
                    onChangeText={(value)=>{this.setState({epSelected: value})}} onFocus={() => console.log(this.easyPicker.toggle())}  />                   
            </View>) : null;

        var deptView = this.props.departmentId === undefined ? (
            <View style = {styles.inputHolder} >
                <EasyPicker 
                    ref = {(c) => this.easyPicker1 = c}
                    dataSource = {deptItemArray}
                    selected = {this.state.epDeptSelected}
                    onChange = {(selected) => {
                        this.setState({
                          epDeptSelected: selected ? selected.value : null ,
                          epDeptSelectedLal: selected ? selected.label : null,
                          epDeptDefaultId: selected ? selected.value : deptId1,
                        });
                        deptId2 = selected ? selected.value : deptId1;
                        this.queryRegRec(hospId1, deptId2);
                    }
                }/>
                <Text style={{marginLeft: 10, fontSize: 15, }} >科室：</Text>
                <TextInput style={[Global._styles.FORM.NO_BORDER_TEXT_INPUT, {flex: 1, height: 40}]} defaultValue={this.state.epDeptDefault} value={this.state.epDeptSelectedLal} 
                      onChangeText={(value1)=>{this.setState({epDeptSelected: value1})}} onFocus={() => console.log(this.easyPicker1.toggle())}  />
            </View>) : null;

        return (
            <View style = {Global._styles.CONTAINER} >
                {this._getNavBar()}
                <Card radius = {6} style = {{margin: 8, marginTop: 16}} >
                    {hospView}
                    <View style = {{height: 1 / Global._pixelRatio, backgroundColor: Global._colors.IOS_SEP_LINE}} />
                    {deptView}
                </Card>
                <View style = {{height: 7}} />
                <View style = {{flexDirection: 'row', alignItems: 'center', paddingLeft: 10}} >
                	<View style = {{width: 20, height: 4, backgroundColor: Global._colors.IOS_GREEN, borderRadius: 2}} />
                	<Text style = {{fontSize: 13, color: Global._colors.FONT_GRAY, marginLeft: 10}} >表示当天可以挂号</Text>
                </View>
                {/*<View style = {Global._styles.FULL_SEP_LINE} />*/}
                <Card radius = {6} style = {{margin: 8, marginTop: 16, paddingLeft: 0, paddingRight: 0, paddingBottom: 0}} >
                    <Calendar
                        scrollEnabled = {false}	// False disables swiping. Default: True   禁用滑动(false),默认(true)
                        showControls = {true}		// False hides prev/next buttons. Default: False 隐藏上一页/下一页(false),默认(false)
                        titleFormat = {'YYYY-MM'}	// Format for displaying current month. Default: 'MMMM YYYY'  格式显示当前月份
                        dayHeadings = {[' 日 ',' 一 ',' 二 ',' 三 ',' 四 ',' 五 ',' 六 ']}	// Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                        monthNames = {['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']} // Defaults to english names of months  月默认为英文名字
                        prevButtonText = {'上月'}	// Text for previous button. Default: 'Prev' 之前的按钮的文本默认为‘Prev’
                        nextButtonText = {'下月'}	// Text for next button. Default: 'Next'
                        onDateSelect = {(date) => this.onDateSelect(date)} // Callback after date selection  回调后日期选择
                        onTouchPrev = {this.onTouchPrev}	// Callback for prev touch event
                        onTouchNext = {this.onTouchNext}	// Callback for next touch event
                        onSwipePrev = {this.onSwipePrev}	// Callback for back swipe event
                        onSwipeNext = {this.onSwipeNext}	// Callback for forward swipe event
                        eventDates = {this.state.dateArray1}	// Optional array of moment() parseable dates that will show an event indicator
                        customStyle = {{
                            calendarContainer: 	{flexDirection: 'column', backgroundColor: 'transparent'}, 
                            monthContainer: 	{width: (DEVICE_WIDTH - 16)},
                            calendarControls: 	{flex: 0}, 
                            dayButton:			{width: (DEVICE_WIDTH - 16) / 7}, 
                        	day: 				{fontSize: 15, textAlign: 'center', color: Global._colors.YELLOW}, 
                            eventIndicator: 	{backgroundColor: Global._colors.IOS_GREEN, width: 20}, 
                        }} 
                        weekStart={1}
                    />
                </Card>
                {/*<View style = {Global._styles.FULL_SEP_LINE} />*/}
            </View>
        );
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
            <NavBar title = '预约挂号' 
                navigator = {this.props.navigator} 
                route = {this.props.route}
                hideBackButton = {false} 
                hideBottomLine = {false}
                rightButtons = {(
                    <View style = {[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]} >
                        <Button onPress = {this.fetchData} stretch = {false} clear = {true} style = {Global._styles.NAV_BAR.BUTTON} >
                            <EasyIcon name = "ios-refresh-outline" color = 'white' size = {25} />
                        </Button>
                    </View>
                )}
            />
        );
    }
}

const styles = StyleSheet.create({
    picker: {
        marginLeft: 10,
        width: Global.getScreen().width - 60,
    },
    inputHolder: {
        flexDirection: 'row',
        /*borderBottomWidth: 1 / Global._pixelRatio,
        borderBottomColor: Global._colors.IOS_SEP_LINE,*/
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default RegResource;



