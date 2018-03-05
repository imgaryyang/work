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
    Dimensions,
    TextInput,
} from 'react-native';

import NavBar       from '../store/common/TopNavBar';
import * as Global  from '../Global';

class Help extends Component {

    static displayName = 'Help';
    static description = '帮助与反馈';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
        value: null,
        saveBtnDisabled: false,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true}, () => {

            });
        });
    }

    async save() {
        if (this.state.value == null || this.state.value.trim() == '') {
            this.toast('请输入问题描述');
            return false;
        }

        let url = ``;
        let options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: Global.toQueryString({
                value: this.state.value,
            })
        };
        this.setState({saveBtnDisabled: true});
        try {
            let responseData = await this.request(url, options);
            this.setState({saveBtnDisabled: false});
            if (!responseData)
                return false;
            if (!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            this.toast('提交成功');
        } catch (e) {
            this.setState({saveBtnDisabled: false});
            this.handleRequestException(e);
        }
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView} automaticallyAdjustContentInsets={false}>
                    <View style={styles.main}>
                        <View style={[styles.item, styles.itemFirst]}>
                            <Text style={styles.itemTxt}>问题描述</Text>
                        </View>
                        <View style={styles.item}>
                            <TextInput
                                style={styles.input}
                                multiline={true}
                                underlineColorAndroid="transparent"
                                placeholder="请填写问题描述，非常感谢您的支持"
                                placeholderTextColor={Global.Color.GRAY}
                                value={this.state.value}
                                onChangeText={(value) => {
                                    this.setState({
                                        value: value,
                                    });
                                }}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.btn}
                        disabled={this.state.saveBtnDisabled}
                        onPress={this.save.bind(this)}
                    >
                        <Text style={styles.btnTxt}>提交</Text>
                    </TouchableOpacity>
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
            <NavBar title='帮助与反馈'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={false}
                hideBottomLine={false}
            />
        );
    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    main: {
        marginHorizontal: 8,
        marginVertical: 10,
        borderColor: '#dcdce1',
        borderWidth: 1 / Global._pixelRatio,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    item: {
        padding: 16,
        borderTopColor: Global.Color.LIGHT_GRAY,
        borderTopWidth: 1 / Global._pixelRatio,
    },
    itemFirst: {
        borderTopWidth: 0,
    },
    itemTxt: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    input: {
        padding: 0,
        height: 30,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    btn: {
        marginTop: 40,
        marginLeft: 10,
        marginRight: 10,
        height: 44,
        backgroundColor: Global.Color.RED,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    btnTxt: {
        color: '#fff',
        fontSize: Global.FontSize.BASE,
    },
});

export default Help;



