'use strict';

var arrangeTimePeriod = [
  {
    "periodId": "0001", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "am", 
    "startTime": "8:30", 
    "endTime": "8:36", 
    "index": "3"
  }, 
  {
    "periodId": "0002", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "am", 
    "startTime": "9:45", 
    "endTime": "10:00", 
    "index": "7"
  }, 
  {
    "periodId": "0003", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "am", 
    "startTime": "10:00", 
    "endTime": "10:15", 
    "index": "8"
  }, 
  {
    "periodId": "0004", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "am", 
    "startTime": "10:15", 
    "endTime": "10:30", 
    "index": "9"
  }, 
  {
    "periodId": "0005", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "am", 
    "startTime": "10:30", 
    "endTime": "10:45", 
    "index": "12"
  }, 
  {
    "periodId": "0006", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "am", 
    "startTime": "10:45", 
    "endTime": "11:00", 
    "index": "15"
  }, 
  {
    "periodId": "0007", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "am", 
    "startTime": "11:30", 
    "endTime": "11:45", 
    "index": "16"
  }, 
  {
    "periodId": "0008", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "pm", 
    "startTime": "13:15", 
    "endTime": "13:30", 
    "index": "25"
  }, 
  {
    "periodId": "0009", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "pm", 
    "startTime": "13:30", 
    "endTime": "13:45", 
    "index": "28"
  }, 
  {
    "periodId": "0010", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "pm", 
    "startTime": "14:45", 
    "endTime": "15:00", 
    "index": "29"
  }, 
  {
    "periodId": "0011", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "pm", 
    "startTime": "15:00", 
    "endTime": "15:15", 
    "index": "33"
  }, 
  {
    "periodId": "0012", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "pm", 
    "startTime": "17:00", 
    "endTime": "17:15", 
    "index": "34"
  }, 
  {
    "periodId": "0013", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "pm", 
    "startTime": "17:15", 
    "endTime": "17:30", 
    "index": "40"
  }, 
  {
    "periodId": "0014", 
    "arrangeDate": "2017-01-15", 
    "dayPeriod": "pm", 
    "startTime": "17:45", 
    "endTime": "18:00", 
    "index": "51"
  }
];

module.exports = {

  'GET /api/ssm/client/arrangeTimePeriod/list': function (req, res) {
  	//console.log(req.query['arrangeItem']);
    setTimeout(function () {
      res.json({
        success: true,
        result: arrangeTimePeriod,
      });
    }, 500);
  },
  
};
