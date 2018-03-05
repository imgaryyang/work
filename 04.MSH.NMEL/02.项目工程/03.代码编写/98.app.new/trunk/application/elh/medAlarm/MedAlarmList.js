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
  InteractionManager,
} from 'react-native';

import * as Global  from '../../Global';
import Icon         from 'react-native-vector-icons/Ionicons';
import NavBar       from 'rn-easy-navbar';
import Calendar     from 'react-native-calendar';
import Button           from 'rn-easy-button';
import Separator        from 'rn-easy-separator';

import UserAction       from '../../flux/UserAction';
import UserStore        from '../../flux/UserStore';
import FAIcon           from 'react-native-vector-icons/FontAwesome';
import MedBillList           from './MedBillList';
import MedAlarmItemEdit           from './MedAlarmItemEdit';
import Switcher         from 'rn-easy-switcher';

const MEDALARMLIST_URL = 'elh/treat/drugRemind/list';
const MEDALARM_DELETE_URL = 'elh/treat/drugRemind';

class MedAlarmList extends Component {

    static displayName = 'MedAlarmList';
    static description = '用药列表';
    datas = [];

    static propTypes = {
        
    };

    static defaultProps = {
    };

    state = {
        doRenderScene: false,
        userInfo: null,
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }), // 某天的提醒，按照时间生序排列。
        messageSwitch: true,
        
    };

    constructor (props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.feachData = this.feachData.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onUserStoreChange = this.onUserStoreChange.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.getUser = this.getUser.bind(this);
        this.push = this.push.bind(this);
        this.setSwitch = this.setSwitch.bind(this);

    }

    componentDidMount () {
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
        // console.log(this.state.userInfo);
        // console.log('========================hUserStore.getUser()aha UserStore   Changed!!! =======================');
    }
    componentWillReceiveProps(){
        this.feachData();
    }
    componentWillUnmount () {
        this.unUserStoreChange();
    }
    async getUser () {
        this.setState({
            userInfo: UserStore.getUser(),
        });
    }
    push(title,component,passProps){
            this.props.navigator.push({
                title: title,
                component: component,
                hideNavBar: true,
                passProps: passProps,
            });
    }
    //获取用户用药列表信息
    async feachData () {
        try {
            let responseData = await this.request(Global._host + MEDALARMLIST_URL, {
                method: 'GET'
            });
            this.datas = responseData.result;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.datas),
                });
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
            //this.requestCatch(e);
        }
        
    }

    async setSwitch(item,index){
        try {
            let responseData1 = await this.request(Global._host + MEDALARM_DELETE_URL+'/'+item.id, {
                method: 'DELETE',
            });

            this.datas[index].state = !this.datas[index].state;
            if(this.datas[index].state=='0'){
                this.datas[index].state == '1';
            }else{
                this.datas[index].state == '0';
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.datas),
            });
            this.toast("修改成功！");
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
        
    }
    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style = {Global._styles.CONTAINER} >
            <ScrollView keyboardShouldPersistTaps = {true}>
                {this._getNavBar()}
                <Separator height = {10} />
                <ListView
                    key = {this.data}
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderItem}
                    enableEmptySections = {true}
                    renderSeparator = {this.renderSeparator}
                    />
                 <TouchableOpacity style={Global._styles.CENTER} onPress={()=>{this.push("用药详情",MedAlarmItemEdit,{userInfo:this.state.userInfo});}}>
                    <Icon name = "md-add" color = '#BBBBBB' size = {20} width = {40} height = {40} />
                </TouchableOpacity>    
            </ScrollView>
            </View>
        );
    }
    renderItem (item,sessionID,rowID){
        // 
        return(
            <TouchableOpacity onPress = { ()=>{this.push("用药详情",MedAlarmItemEdit,{userInfo:this.state.userInfo,item:item});}} style={{backgroundColor:'white',flex:1,}}>
                <View style={styles.container1}>
                    <FAIcon  name='bell-o' size={20} color={Global._colors.IOS_ARROW} style={[Global._styles.ICON, {width: 40}]} />
                    <Text style={{flex:1,}}>{item.beginDate}----{item.endDate}  {item.alarmTime} </Text>
                    <Switcher 
	            	value = {item.state==0?true:false} 
	            	width = {40}
	            	height = {20} 
	            	onSwitch = {
	            		() => this.setSwitch(item,rowID)
	            	} 
	            	style = {{marginRight: 10,width:40}} /> 
                </View>
                <View style={styles.container2}>
                    <Text style={{fontSize: 13,}}>{item.medUsage}</Text>
                </View>
            </TouchableOpacity>
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
            <NavBar title = '用药列表' 
                navigator = {this.props.navigator} 
                route = {this.props.route}
                hideBackButton = {false} 
                hideBottomLine = {false} />
        );
    }
}
                <Separator height = {10} />

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container1: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center', 
        // justifyContent: 'center',
    },
    container2: {
        marginLeft: 10,
        height: 40,
    },
    picker: {
        marginLeft: 10,
        width: Global.getScreen().width - 60,
    },
});

export default MedAlarmList;



