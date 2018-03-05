/**
 * 公用API
 */

var ApiUtils = {
  setHeader: function(request) {
    console.log('in ApiUtils.setHeader()....');
  },

  checkStatus: function(response) {
    console.log('in ApiUtils.checkStatus()....');
    console.log(response);
    /*if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }*/
  },

};

export { ApiUtils as default };
