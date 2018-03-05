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
import MedAlarmItemEdit           from './MedAlarmItemEdit';

const MEDALARMLIST_URL = 'elh/treat/my/drugorder';

class MedBillList extends Component {

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
        
    };

    constructor (props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.feachData = this.feachData.bind(this);
        this.push = this.push.bind(this);

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
                passProps: {
                    userInfo:this.state.userInfo,
                    refresh: this.refresh,  
                },
            });
    }
    refresh(){
        this.feachData();
    }
    //获取用户用药列表信息
    async feachData () {
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
    appendSectionData (data) {
        if(!data || data.length==0) {
            return;
        }
        let sectionId, rowId, idx;
        data.forEach((item) => {
            sectionId = item['createTime'].substring(0, 7);
            idx = this.sectionIds.indexOf(sectionId);
            if(idx == -1) {
                idx = this.sectionIds.length;
                this.sectionIds.push(sectionId);
                this.rowIds.push([]);
            }
            rowId = 's' + idx + 'r' + item.id;
            if(this.rowIds[idx].indexOf(rowId) == -1){
                this.rowIds[idx].push(rowId);
            }
            this.sectionData[sectionId] = sectionId.replace('-', '年') + '月';
            this.sectionData[rowId] = item;
        });
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
                <Separator height = {10} />
                <TouchableOpacity onPress={()=>{this.push("药单列表",MedAlarmItemEdit,{userInfo:this.state.userInfo});}}>
                    <Icon name = "md-add" color = '#BBBBBB' size = {40} width = {40} height = {40} />
                    <Text>da f s d fa d fa s d</Text>
                </TouchableOpacity>
            </ScrollView>
            </View>
        );
    }
    renderItem (item, sectionId, rowId, highlightRow){
        console.log(item);
        console.log(sectionId);
        console.log(rowId);
        return(
            <View style={{backgroundColor:'white',flex:1,}}>
                <View style={styles.container1}>
                    <FAIcon  name='bell-o' size={20} color={Global._colors.IOS_ARROW} style={[Global._styles.ICON, {width: 40}]} />
                    <Text>{item.beginDate}--{item.endDate}</Text>
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

export default MedBillList;



