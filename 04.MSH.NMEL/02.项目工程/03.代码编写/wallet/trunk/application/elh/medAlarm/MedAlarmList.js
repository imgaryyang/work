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
import Button           from 'rn-easy-button';
import Separator        from 'rn-easy-separator';

import UserAction       from '../../flux/UserAction';
import UserStore        from '../../flux/UserStore';
import FAIcon           from 'react-native-vector-icons/FontAwesome';
import MedBillList           from './MedBillList';
import MedAlarmItemEdit           from './MedAlarmItemEdit';
import Switcher         from 'rn-easy-switcher';

const MEDALARMLIST_URL = 'elh/hospital/mng/list/0/10';

class MedAlarmList extends Component {

    static displayName = 'MedBillList';
    static description = '药单列表';
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

    }

    componentDidMount () {
        this.unUserStoreChange = UserStore.listen(this.onUserStoreChange);

        InteractionManager.runAfterInteractions(() => {
            this.feachData();
            this.getUser();
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
            // let responseData = await this.request(Global._host + MEDALARMLIST_URL+"/"+this.state.userInfo.id, {
            //     method: 'GET'
            // });
            this.datas = [{beginDate:'2016-07-01',endDate:'2016-07-03',alarmTime:'10:10',description:'藿香正气丸，两颗；阿莫西林，3颗'},
                         {beginDate:'2016-07-03',endDate:'2016-07-04',alarmTime:'18:10',description:'藿香正气丸，两颗；阿莫西林，3颗'},
                        ];
            // if (responseData.success == true) {}
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.datas),
                });
                this.toast("验证成功！");
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
            //this.requestCatch(e);
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
                 <TouchableOpacity style={Global._styles.CENTER}onPress={()=>{this.push("药单列表",MedAlarmItemEdit,{userInfo:this.state.userInfo});}}>
                    <EasyIcon name = "md-add" color = '#BBBBBB' size = {20} width = {40} height = {40} />
                </TouchableOpacity>    
            </ScrollView>
            </View>
        );
    }
    renderItem (item){
        // console.log(item);
        return(
            <TouchableOpacity onPress = { ()=>{this.push("用药详情",MedAlarmListEdit)}}style={{backgroundColor:'white',flex:1,}}>
                <View style={styles.container1}>
                    <FAIcon  name='bell-o' size={20} color={Global._colors.IOS_ARROW} style={[Global._styles.ICON, {width: 40}]} />
                    <Text style={{flex:1,}}>{item.beginDate}----{item.endDate}  {item.alarmTime} </Text>
                    <Switcher 
	            	value = {this.state.messageSwitch} 
	            	width = {40}
	            	height = {20} 
	            	onSwitch = {
	            		() => this.setState({messageSwitch: !this.state.messageSwitch})
	            	} 
	            	style = {{marginRight: 10,width:40}} /> 
                </View>
                <View style={styles.container2}>
                    <Text style={{fontSize: 13,}}>{item.description}</Text>
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



