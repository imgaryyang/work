
'use strict';

import React, {
    Component,

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
    DatePickerAndroid,
    TimePickerAndroid,
  InteractionManager,
} from 'react-native';

import PropTypes from 'prop-types';
import * as Global  from '../../Global';
import * as Filters from '../../utils/Filters';

import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';
import Portrait     from 'rn-easy-portrait';

import Icon         from 'react-native-vector-icons/Ionicons';
import FAIcon           from 'react-native-vector-icons/FontAwesome';

const MEDALARM_NEW_URL = 'elh/treat/drugRemind/create';
const MEDALARM_CHANGE_URL = 'elh/treat/drugRemind/change';

class MedAlarmItemEdit extends Component {

    static displayName = 'MedAlarmItemEdit';
    static description = '编辑用药提醒';
    datas = [];

    static propTypes = {
        item:PropTypes.string,
    };

    static defaultProps = {
    };

    state = {
        doRenderScene: false,
        textState:'0',
        beginDate: new Date(),
        endDate: new Date(),
        alarmTime: new Date(),
        medUsage: null,
        userInfo: this.props.userInfo,
        presetDate: new Date(),
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
    };

    constructor (props) {
        super(props);
        this.dateChange     = this.dateChange.bind(this);
        this.save     = this.save.bind(this);
        this.doSave     = this.doSave.bind(this);
        this.datePicker = this.datePicker.bind(this);
        this.timePicker = this.timePicker.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.addMed     = this.addMed.bind(this);
        this.changeFeedBack     = this.changeFeedBack.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);

    }

    componentDidMount () {

        InteractionManager.runAfterInteractions(() => {
            this.dateChange();
            this.setState({doRenderScene: true});
        });
    }
    componentWillUnmount () {
    }
    
    dateChange(){
        if(this.props.item){
            var alarmTime = new Date("January 1,2016 "+this.props.item.alarmTime.substr(0,8));
            this.datas.push(alarmTime);
            this.setState({
                beginDate :new Date(this.props.item.beginDate.substr(0,4),this.props.item.beginDate.substr(5,2)-1,this.props.item.beginDate.substr(8,2)),
                endDate : new Date(this.props.item.endDate.substr(0,4),this.props.item.endDate.substr(5,2)-1,this.props.item.endDate.substr(8,2)),
                medUsage :this.props.item.medUsage, 
                dataSource: this.state.dataSource.cloneWithRows(this.datas),

            });
        }
    }
    save(){
        if(this.props.item){
            this.doChange();

        }else{
            this.doSave();
        }
        this.props.navigator.pop();
    }
    //存储定时
    async doSave(){
        if(this.datas.length<1){
                Alert.alert(
                    '提示',
                    '请增加提醒时间!',
                    [
                        {
                            text: '确定'
                        }
                    ]
                );
        }else{
            try {
                var beginDate = Filters.filterDateFmtToDay(this.state.beginDate);
                var endDate = Filters.filterDateFmtToDay(this.state.endDate);
                var alarmTimes ='';
                for(var ii = 0;ii<this.datas.length;ii++){
                    var alarmTime = this.datas[ii];
                    var alarmTimeDate = Filters.filterDateFmt(alarmTime);
                    alarmTimes = alarmTimes + alarmTimeDate.substr(11,5)+':00,';
                }
                let responseData = await this.request(Global._host + MEDALARM_NEW_URL, {
                    // method: 'GET'
                    body: JSON.stringify({
                            beginDate:beginDate,
                            endDate:endDate,
                            alarmTime:alarmTimes,
                            medUsage: this.state.medUsage,            
                        })
                });
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.datas),
                    });
                    this.toast("保存成功！");

            } catch(e) {
                this.hideLoading();
                this.handleRequestException(e);
                //this.requestCatch(e);
            }
        }
    }
    async doChange(){
            try {
                var beginDate = Filters.filterDateFmtToDay(this.state.beginDate);
                var endDate = Filters.filterDateFmtToDay(this.state.endDate);
                var alarmTimes ='';
                for(var ii = 0;ii<this.datas.length;ii++){
                    var alarmTime = this.datas[ii];
                    var alarmTimeDate = Filters.filterDateFmt(alarmTime);
                    alarmTimes = alarmTimes + alarmTimeDate.substr(11,5)+':00,';
                }
                let responseData = await this.request(Global._host + MEDALARM_CHANGE_URL, {
                    method: 'PUT',
                    body: JSON.stringify({
                            id:this.props.item.id,
                            beginDate:beginDate,
                            endDate:endDate,
                            alarmTime:alarmTimes,
                            medUsage: this.state.medUsage,            
                        })
                });
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.datas),
                    });
                    this.toast("修改成功！");

            } catch(e) {
                this.hideLoading();
                this.handleRequestException(e);
                //this.requestCatch(e);
            }
    }
    addMed(){
        this.setState({
            textState:'1',
        });
    }
    changeFeedBack(value){
        this.setState({
            medUsage:value,
        });
    }
    async datePicker(stateKey, options) {
        if(stateKey==='begin'){
            try {
                const begin = await DatePickerAndroid.open(options);
                if (begin.action === DatePickerAndroid.dismissedAction) {
                    return ;
                } else {
                    var date = new Date(begin.year, begin.month, begin.day);
                    this.setState({
                        beginDate: date,
                        });
                }
            } catch (e) {
                console.log(e);
            }
        }else{
            try {
                const end = await DatePickerAndroid.open(options);
                if (end.action === DatePickerAndroid.dismissedAction) {
                    return ;
                } else {
                    var date = new Date(end.year, end.month, end.day);
                    this.setState({
                        endDate: date,
                        });
                }
            } catch (e) {
                console.log(e);
            }
        }
        
    }
    async timePicker(stateKey, options,index) {
        try {
            const time = await TimePickerAndroid.open(options);
            if (time.action === TimePickerAndroid.timeSetAction) {
                if(this.datas[index]){
                    var timeShow1 = "January 1,2016 "+time.hour+':'+time.minute+':00';
                    var dateTime1 = new Date(timeShow1);
                    this.datas.splice(index,1,dateTime1);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.datas),
                    });
                    //替换
                }else{
                    var timeShow = "January 1,2016 "+time.hour+':'+time.minute+':00';
                    var dateTime = new Date(timeShow);
                    var dateTime1 = dateTime.toLocaleTimeString().toString();
                    this.datas.push(dateTime);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.datas),
                    });
                }
                
              } else if (time.action === TimePickerAndroid.dismissedAction) {                
                return ;
              }
            } catch (e) {
                console.log(e);
            }
    }
    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();
        var medUsage = this.state.textState === '1'||this.props.item?(<TextInput  style={styles.mulLineTextInput}
                    multiline={true} 
                    onChangeText={(value) => {this.changeFeedBack(value);}} 
                    maxLength={500}
                    value = {this.state.medUsage} 
                    placeholder='您好请填入药品名称和用量' />):null;
        var addAlarm = this.props.item?null:(<TouchableOpacity style={styles.container1} onPress={()=>{this.timePicker( "时间",{time:this.state.presetDate.getTime()});}}>
                                                <Text style={styles.leftText2}>增加闹钟时间</Text>
                                                <Icon name = "md-add" color = '#BBBBBB' size = {20} width = {40} height = {40} />
                                            </TouchableOpacity>);
        var addMed = this.props.item?null:(<TouchableOpacity style={styles.container1} onPress={()=>{this.addMed()}}>
                                                <Text style={styles.leftText2}>增加药品</Text>
                                                <Icon name = "md-add" color = '#BBBBBB' size = {20} width = {40} height = {40} />
                                            </TouchableOpacity>);                

        return (
            <View style = {Global._styles.CONTAINER} >
            <ScrollView keyboardShouldPersistTaps = {true}>
                {this._getNavBar()}
                <Separator height = {10} />
                <View style={styles.container1}> 
                    <Text style={styles.leftText}>起始日期</Text>
                    <TouchableOpacity style={styles.container1}onPress={()=>{this.datePicker('begin', {date: this.state.beginDate});}}>
                        <Text>{Filters.filterDateFmtToDay(this.state.beginDate)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.container1}> 
                    <Text style={styles.leftText}>截止日期</Text>
                    <TouchableOpacity style={styles.container1}onPress={()=>{this.datePicker('end', {date: this.state.endDate});}}>
                        <Text>{Filters.filterDateFmtToDay(this.state.endDate)}</Text>
                    </TouchableOpacity>
                </View>
                {addAlarm}
                <ListView
                    key = {this.datas}
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderItem}
                    enableEmptySections = {true}
                    renderSeparator = {this.renderSeparator}
                    />
                {addMed}
                {medUsage}
                <Separator height = {20} />
                <View style = {{flexDirection: 'row', marginTop: 10,marginLeft: 10,marginRight: 10}} >
                    <Button text = "取消" onPress = {()=>{this.props.navigator.pop();}} />
                    <Separator width = {10} />
                    <Button text = "确定" onPress = {this.save} disabled = {this.state.buttonState}/>
                </View>

            </ScrollView>
            </View>
        );
    }
    renderItem (item,sectionID,rowID){
        return(
            <TouchableOpacity style={styles.container1} onPress={()=>{this.timePicker( "时间",{hour:item.getHours(),minute:item.getMinutes(),is24Hour: true},rowID);}}>
                <FAIcon  name='bell-o' size={20} color={Global._colors.IOS_ARROW} style={[Global._styles.ICON, {width: 40}]} />
                <Text>{item.toLocaleTimeString().toString()}</Text>
            </TouchableOpacity>
        );

    }
    renderSeparator (sectionID, rowID) {
        return (
            <View key={rowID} style={Global._styles.FULL_SEP_LINE} />
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
            <NavBar title = '药单列表' 
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
        paddingLeft: 10,
        paddingRight: 10,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center', 
        backgroundColor:'white',
        // justifyContent: 'center',
    },
    container2: {
        marginLeft: 10,
        height: 60,
    },
    leftText:{
        width: 80,
    },
    leftText2:{
        width: 120,
    },
    picker: {
        marginLeft: 10,
        width: Global.getScreen().width - 60,
    },
    mulLineTextInput:{
        height:120,
        backgroundColor:'white',
    },
});

export default MedAlarmItemEdit;



