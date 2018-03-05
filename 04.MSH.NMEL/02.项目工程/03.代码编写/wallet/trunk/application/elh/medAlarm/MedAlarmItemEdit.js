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
import Calendar     from 'react-native-calendar';

import NavBar           from 'rn-easy-navbar';
import Button           from 'rn-easy-button';
import Separator        from 'rn-easy-separator';

import UserAction       from '../../flux/UserAction';
import UserStore        from '../../flux/UserStore';
import FAIcon           from 'react-native-vector-icons/FontAwesome';

const MEDALARM_NEW_URL = 'elh/treat/my/drugorder';
const MEDALARM_CHANGE_URL = 'elh/treat/my/drugorder';

class MedAlarmItemEdit extends Component {

    static displayName = 'MedAlarmItemEdit';
    static description = '编辑药单';
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
        
    };

    constructor (props) {
        super(props);
        this.doSave = this.doSave.bind(this);
        this.push = this.push.bind(this);

    }

    componentDidMount () {

        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
        });
    }
    componentWillUnmount () {
    }
    
    push(title,component,passProps){
            this.props.navigator.push({
                title: title,
                component: component,
                hideNavBar: true,
                passProps: {
                    userInfo:this.state.userInfo,
                    refresh: this.refresh,  
                },
            });
    }
    refresh(){
    }
    //获取用户用药列表信息
    async doSave () {
        try {
            console.log("responseData-------------------");
            console.log(this.state.userInfo.id);
            console.log(Global._host + MEDALARMLIST_URL+"/"+this.state.userInfo.id);

            let responseData = await this.request(Global._host + MEDALARMLIST_URL+"/"+this.state.userInfo.id, {
                method: 'GET'
            });
            console.log(responseData);
            
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
                <View style={styles.container1}> 
                    <Text>起始时间</Text>
                </View>
                <View style={styles.container1}> 
                    <Text>截止时间</Text>
                </View>
                <Separator height = {10} />
                <TouchableOpacity onPress={()=>{this.push("药单列表",MedBillList,{userInfo:this.state.userInfo});}}>
                    <Icon name = "md-add" color = '#BBBBBB' size = {40} width = {40} height = {40} />
                    <Text>da f s d fa d fa s d</Text>
                </TouchableOpacity>
            </ScrollView>
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

export default MedAlarmItemEdit;



