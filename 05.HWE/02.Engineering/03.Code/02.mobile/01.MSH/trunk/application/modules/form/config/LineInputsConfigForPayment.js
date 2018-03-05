/**
 * 默认配置文件
 */
import {
  PixelRatio,
} from 'react-native';

import * as Validation from '../Validation.js';

const config = Object.freeze({
  // style for form view
  style: {
  },
  fields: {
    // style for field container
    style: {
      marginTop: 0,
      marginBottom: 0,
      // backgroundColor: 'yellow',
    },
    label: {
      // true | false
      showLabel: false,
      // top | left
      position: 'left',
      // is invalid when label pos 'top'
      width: 80,
      // style for label
      // 'height' property is invalid when label pos 'left'
      style: {
        // work on label container
        marginLeft: 10,
        height: 28,
        // backgroundColor: 'rgba(248,248,248,1)', //'#F8F8F8'
        // work on label text
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(93,93,93,1)', // #5D5D5D

      },
    },
    textInput: {
      // style for text input field
      // [ fontSize | color | lineHeight | fontWeight | textAlign ] work on TextInput
      // others work on input container
      style: {
        // required
        height: 50,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: 'rgba(200,199,204,1)', // #c8c7cc
        // backgroundColor: '#eeeeee',
        marginTop: 0,
        fontWeight: '600',
        fontSize: 20,
        color: '#000000',
      },
      icon: {
        // left | right
        position: 'left',
        color: 'gray', // 'rgba(146,146,146,1)', //'#929292'
        size: 20,
        width: 30,
        showClearIcon: true,
        // bgColor: 'rgba(248,248,248,1)', //'#F8F8F8'
        style: {
        },
      },
      // button after Input
      button: {
        fontSize: 12,
        color: 'rgba(0,122,255,1)', // '#007AFF',
        width: 90,
        // bgColor: 'rgba(248,248,248,1)', //'#F8F8F8'
        style: {
        },
      },
      // adjust buttons [ + / - ] button
      // work on Number field
      adjustButton: {
        color: 'rgba(93,93,93,1)', // #5D5D5D
        bgColor: 'transparent',
        style: {
        },
      },
      dataType: {
        string: {
          props: {
            keyboardType: 'default',
          },
          validate: null,
        },
        number: {
          props: {
            keyboardType: 'numeric',
          },
          validate: Validation.testNumber,
        },
        int: {
          props: {
            keyboardType: 'numeric',
          },
          validate: Validation.testInt,
        },
        mobile: {
          props: {
            keyboardType: 'numeric',
            maxLength: 11,
          },
          validate: Validation.testMobile,
        },
        email: {
          props: {
            keyboardType: 'email-address',
            maxLength: 50,
          },
          validate: Validation.testEmail,
        },
        bankAcct: {
          props: {
            keyboardType: 'numeric',
            maxLength: 19,
          },
          validate: Validation.testBankAcct,
        },
        amt: {
          props: {
            keyboardType: 'decimal-pad',
            maxLength: 19,
          },
          validate: Validation.testAmt,
        },
        cnIdNo: {
          props: {
            keyboardType: 'default',
            maxLength: 18,
          },
          validate: Validation.testCnIdNo,
        },
      },
    },
    picker: {
      style: {
        // required
        height: 50,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: 'rgba(200,199,204,1)', // #c8c7cc
        // backgroundColor: '#eeeeee',
        marginTop: 0,

        fontSize: 13,
        color: '#000000',
      },
    },
    checkbox: {
      style: {
        // required
        // height: 50,
        // borderBottomColor: 'rgba(200,199,204,1)', // #c8c7cc
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
        // backgroundColor: '#eeeeee',
        marginTop: 0,
        fontSize: 13,
        color: '#000000',
        borderRadius: 8,
      },
    },
    switch: {
      style: {
        // required
        // height: 50,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: 'rgba(200,199,204,1)', // #c8c7cc
        // backgroundColor: '#eeeeee',
        marginTop: 0,

        fontSize: 13,
        color: '#000000',
      },
    },
    date: {
      style: {
        // required
        height: 50,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: 'rgba(200,199,204,1)', // #c8c7cc
        // backgroundColor: '#eeeeee',
        marginTop: 0,

        fontSize: 13,
        color: '#000000',
      },
    },
    imageSelect: {},
  },
  help: {
    style: {
      marginTop: 5,
      marginBottom: 5,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: 'rgba(200,199,204,1)', // #c8c7cc
    },
  },
  error: {
    style: {
      marginTop: 5,
    },
  },
});

module.exports = config;

