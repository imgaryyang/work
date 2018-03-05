'use strict';

import TimerMixin   from 'react-timer-mixin';

var ToastMixin = {

    mixins: [TimerMixin],

	/**
	 * toast message
	 */
	_toast: function(msg) {
        var msgs = this.state.toastMsgs ? this.state.toastMsgs : [];
		msgs.push(msg);
		this.setState({toastMsgs: msgs});
		this._clearToast();
	},

    _clearToast: function() {
        this.setTimeout(
            () => {
            	var msgs = this.state.toastMsgs;
            	msgs.splice(0, 1);
                this.setState({toastMsgs: msgs});
            },
            2000
        );
    },
};

module.exports = ToastMixin;


