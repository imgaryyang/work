/*
瘦版表单样式
*/
'use strict';

var React = require('react-native');
var {
    Platform,
    Dimensions,
    PixelRatio,
} = React;

var LABEL_COLOR = '#000000';
var INPUT_COLOR = '#000000';
var ERROR_COLOR = '#FF3B30';
var HELP_COLOR = '#999999';
var BORDER_COLOR = '#cccccc';
var DISABLED_COLOR = '#777777';
var DISABLED_BACKGROUND_COLOR = '#eeeeee';
var FONT_SIZE = 13;
var FONT_SIZE_LABEL = 14;
var FONT_WEIGHT = '200'; //100~900 bold normal
var FONT_WEIGHT_LABEL = '300';

var stylesheet = Object.freeze({
    fieldset: {},

    formGroup: {
        normal: {
            marginBottom: 10
        },
        error: {
            marginBottom: 10
        }
    },
    controlLabel: {
        normal: {
            color: LABEL_COLOR,
            fontSize: FONT_SIZE_LABEL,
            marginBottom: 7,
            fontWeight: FONT_WEIGHT_LABEL
        },

        error: {
            color: ERROR_COLOR,
            fontSize: FONT_SIZE_LABEL,
            marginBottom: 7,
            fontWeight: FONT_WEIGHT_LABEL
        }
    },
    helpBlock: {
        normal: {
            color: HELP_COLOR,
            fontSize: FONT_SIZE,
            marginBottom: 2
        },
        error: {
            color: HELP_COLOR,
            fontSize: FONT_SIZE,
            marginBottom: 2
        }
    },
    errorBlock: {
        fontSize: FONT_SIZE,
        marginBottom: 2,
        color: ERROR_COLOR
    },
    textbox: {
        normal: {
            color: INPUT_COLOR,
            fontSize: FONT_SIZE,
            height: 36,
            padding: 7,
            borderRadius: 4,
            borderColor: BORDER_COLOR,
            borderWidth: 1 / PixelRatio.get(),
            marginBottom: 5
        },
        error: {
            color: INPUT_COLOR,
            fontSize: FONT_SIZE,
            height: 36,
            padding: 7,
            borderRadius: 4,
            borderColor: ERROR_COLOR,
            borderWidth: 1 / PixelRatio.get(),
            marginBottom: 5
        },
        notEditable: {
            fontSize: FONT_SIZE,
            height: 36,
            padding: 7,
            borderRadius: 4,
            borderColor: BORDER_COLOR,
            borderWidth: 1 / PixelRatio.get(),
            marginBottom: 5,
            color: DISABLED_COLOR,
            backgroundColor: DISABLED_BACKGROUND_COLOR
        }
    },
    checkbox: {
        normal: {
            color: INPUT_COLOR,
            marginBottom: 4
        },
        error: {
            color: INPUT_COLOR,
            marginBottom: 4
        }
    },
    select: {
        normal: {
            marginBottom: 4
        },
        error: {
            marginBottom: 4
        }
    },
    datepicker: {
        normal: {
            marginBottom: 4
        },
        error: {
            marginBottom: 4
        }
    }
});

module.exports = stylesheet;

