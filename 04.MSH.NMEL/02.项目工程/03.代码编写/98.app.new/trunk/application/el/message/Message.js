'use strict';

import React, {
    Component,

} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    InteractionManager,
    ListView,
} from 'react-native';

import * as Global  from '../../Global';

import NavBar       from 'rn-easy-navbar';
// import EasyIcon     from 'rn-easy-icon';

import SalaryList   from '../../els/SalaryList';

class Message extends Component {

    menu = [
        {text: '您有一条新的工资明细!', component: SalaryList},
        {text: '你有一条医院报告单!', component: SalaryList},
    ];

    static displayName = 'Message';
    static description = '消息';

    static propTypes = {
    };

    static defaultProps = {
    };

    state = {
        doRenderScene: false,
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }).cloneWithRows(this.menu),
    };

    constructor (props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
        });
    }

    renderRow (item, sectionID, rowID, highlightRow) {
        return (
            <TouchableOpacity key = {item} 
                style = {[Global._styles.CENTER, {flexDirection: 'row', padding: 20}]}
                onPress = {() => this.props.navigator.push({
                    component: item.component,
                    hideNavBar: true,
                })} >
                <Text style = {{flex: 1}} >{item.text}</Text>
                <EasyIcon name = "ios-arrow-forward-outline" size = {20} color = {Global._colors.FONT_LIGHT_GRAY1} />
            </TouchableOpacity>
        );
    }

    /**
     * 渲染行分割线
     */
    renderSeparator (sectionId, rowId) {
        return <View key={'sep_' + rowId} style={Global._styles.FULL_SEP_LINE} />;
    }

    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style = {[Global._styles.CONTAINER, {backgroundColor: '#ffffff'}]} >
                {this._getNavBar()}
                <ListView 
                    style = {styles.list} 
                    dataSource = {this.state.dataSource} 
                    renderRow = {this.renderRow} 
                    renderSeparator = {this.renderSeparator} 
                />
            </View>
        );
    }

    _renderPlaceholderView () {
        return (
            <View style = {[Global._styles.CONTAINER, {backgroundColor: '#ffffff'}]}>
                {this._getNavBar()}
            </View>
        );
    }

    _getNavBar () {
        return (
            <NavBar title = '消息' 
                navigator = {this.props.navigator} 
                route = {this.props.route}
                hideBackButton = {false} 
                hideBottomLine = {false} />
        );
    }

}

const styles = StyleSheet.create({
    list: {
        backgroundColor: '#ffffff',
    },
});

export default Message;



