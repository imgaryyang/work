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
    TouchableOpacity,
    StyleSheet,
    InteractionManager,
    TextInput,
} from 'react-native';

import NavBar       from '../common/TopNavBar';
import * as Global  from '../../Global';

class AreaList extends Component {

    static displayName = 'AreaList';
    static description = '地区选择';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
        list: null,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true}, () => {
                this.getData();
            });
        });
    }

    async getData() {
        this.showLoading();
        let areaId = this.props.areaId || 0;
        let url = `${Global.ServerUrl}?act=app&op=area&area_id=${areaId}`;
        let options = {
            method: "GET"
        };
        try {
            let responseData = await this.request(url, options);
            if (!responseData)
                return false;
            if (!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            if (!responseData.root)
                return false;
            this.setState({
                doRenderScene: true,
                list: responseData.root,
            });
            this.hideLoading();
        } catch (e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
    }

    onPress(v) {
        let areaSelectedArr = this.props.areaSelectedArr;
        if (!areaSelectedArr)
            areaSelectedArr = [];
        areaSelectedArr.push(v);

        if (v.area_deep == '3') {
            let currentRoutes = this.props.navigator.getCurrentRoutes();
            let currentRoute = null;
            for (let i = currentRoutes.length - 1; i >= 0; i--) {
                if (currentRoutes[i].component.displayName == this.props.displayName) {
                    this.props.navigator.popToRoute(currentRoutes[i]);
                    break;
                }
            }
            this.props.refreshFn && this.props.refreshFn(areaSelectedArr);
        } else {
            this.props.navigator.push({
                component: AreaList,
                hideNavBar: true,
                passProps: {
                    areaId: v.area_id,
                    areaSelectedArr: areaSelectedArr,
                    refreshFn: this.props.refreshFn,
                    displayName: this.props.displayName,
                },
            });
        }
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView}>
                    <View style={styles.main}>
                        {
                            !this.state.list ? null :
                                this.state.list.map((v, i) => {
                                    return this.renderRow(v, i);
                                })
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
            </View>
        );
    }

    _getNavBar() {
        return (
            <NavBar title='地区选择'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={false}
                hideBottomLine={false}
            />
        );
    }

    renderRow(v, i) {
        let itemStyle = [styles.item];
        if (i == this.state.list.length - 1) {
            itemStyle.push(styles.itemEnd);
        }
        return (
            <TouchableOpacity style={itemStyle}
                onPress={() => this.onPress(v)}
            >
                <Text>{v.area_name}</Text>
                {
                    v.area_deep == '3' ? null :
                        <Image style={styles.rightImg}
                            source={require('../images/shop_center_right.png')}
                        />
                }
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    main: {
        backgroundColor: '#fff',
        borderBottomColor: '#dcdce1',
        borderBottomWidth: 1,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
        height: 48,
        borderBottomColor: Global.Color.LIGHTER_GRAY,
        borderBottomWidth: 1,
    },
    itemEnd: {
        borderBottomWidth: 0,
    },
    rightImg: {
        width: 10,
        height: 18,
        resizeMode: 'contain',
    },
});

export default AreaList;



