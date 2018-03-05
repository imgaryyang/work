'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import * as Global  from '../../Global';

class Radio extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        checked: this.props.checked ? true : false,
        imageSource: this.getImageSource(this.props.checked),
    };

    getImageSource(checked) {
        return checked ? require('../images/radio_select.png') : require('../images/radio_unselect.png');
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

    onSelect() {
        let checked = !this.state.checked;
        this.setState({
            checked: checked,
            imageSource: this.getImageSource(checked),
        });
        if(checked){
            this.props.onSelect && this.props.onSelect(this.props.value);
        }
    }

    render() {
        return (
            <TouchableOpacity
                style={[styles.container, this.props.style]}
                onPress={this.onSelect.bind(this)}
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
        marginLeft: 50,
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

export default Radio;