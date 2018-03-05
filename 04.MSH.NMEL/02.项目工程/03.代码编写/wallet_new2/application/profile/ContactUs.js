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
} from 'react-native';

import NavBar       from '../store/common/TopNavBar';
import * as Global  from '../Global';

class ContactUs extends Component {

    static displayName = 'ContactUs';
    static description = '联系我们';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
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

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView} automaticallyAdjustContentInsets={false}>
                    <View style={styles.main}>
                        <Text style={[styles.itemTxt, styles.itemTxtFirst]}>内蒙古云科数据服务有限公司</Text>
                        <Text style={styles.itemTxt}>电话：0471-3246000</Text>
                        <Text style={styles.itemTxt}>电话：0471-3247851</Text>
                        <Text style={styles.itemTxt}>邮箱：mail@cloudtds.com.cn</Text>
                        <Text style={styles.itemTxt}>地址：内蒙古自治区呼和浩特市赛罕区东影南路8号博雅苑7号楼三层</Text>
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
            <NavBar title='联系我们'
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
        padding: 16,
        borderColor: '#dcdce1',
        borderWidth: 1 / Global._pixelRatio,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    itemTxt: {
        marginTop: 10,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    itemTxtFirst: {
        marginTop: 0,
    },
});

export default ContactUs;



