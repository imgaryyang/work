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
} from 'react-native';

import * as Global  from '../../Global';
import EasyIcon     from 'rn-easy-icon';

class Checkbox extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        checked: this.props.checked ? true : false,
        imageSource: this.getImageSource(this.props.checked),
    };

    getImageSource(checked) {
        return checked ? require('../images/checkbox_checked.png') : require('../images/checkbox_unchecked.png');
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            checked: nextProps.checked,
            imageSource: this.getImageSource(nextProps.checked),
        });
    }

    onCheck() {
        let checked = !this.state.checked;
        this.setState({
            checked: checked,
            imageSource: this.getImageSource(checked),
        });
        this.props.onCheck && this.props.onCheck(checked);
    }

    render() {
        return (
            <TouchableOpacity
                style={[styles.container, this.props.style]}
                onPress={this.onCheck.bind(this)}
            >
                <Image style={styles.image}
                    source={this.state.imageSource}
                />
                {
                    !this.props.label ? null :
                        <Text style={styles.label}>{this.props.label}</Text>
                }
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 13,
        height: 13,
        resizeMode: 'contain',
    },
    label: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
        marginLeft: 10,
    },
});

export default Checkbox;



