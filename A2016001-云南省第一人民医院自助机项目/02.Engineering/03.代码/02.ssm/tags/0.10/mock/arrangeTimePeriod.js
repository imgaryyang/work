'use strict';

var arrangeTimePeriod = [
	{
		PeriodId: '0001',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'am',
		StartTime: '8:30',
		EndTime: '8:36',
		Index: '3',
	},
	{
		PeriodId: '0002',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'am',
		StartTime: '9:45',
		EndTime: '10:00',
		Index: '7',
	},
	{
		PeriodId: '0003',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'am',
		StartTime: '10:00',
		EndTime: '10:15',
		Index: '8',
	},
	{
		PeriodId: '0004',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'am',
		StartTime: '10:15',
		EndTime: '10:30',
		Index: '9',
	},
	{
		PeriodId: '0005',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'am',
		StartTime: '10:30',
		EndTime: '10:45',
		Index: '12',
	},
	{
		PeriodId: '0006',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'am',
		StartTime: '10:45',
		EndTime: '11:00',
		Index: '15',
	},
	{
		PeriodId: '0007',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'am',
		StartTime: '11:30',
		EndTime: '11:45',
		Index: '16',
	},
	{
		PeriodId: '0008',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'pm',
		StartTime: '13:15',
		EndTime: '13:30',
		Index: '25',
	},
	{
		PeriodId: '0009',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'pm',
		StartTime: '13:30',
		EndTime: '13:45',
		Index: '28',
	},
	{
		PeriodId: '0010',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'pm',
		StartTime: '14:45',
		EndTime: '15:00',
		Index: '29',
	},
	{
		PeriodId: '0011',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'pm',
		StartTime: '15:00',
		EndTime: '15:15',
		Index: '33',
	},
	{
		PeriodId: '0012',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'pm',
		StartTime: '17:00',
		EndTime: '17:15',
		Index: '34',
	},
	{
		PeriodId: '0013',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'pm',
		StartTime: '17:15',
		EndTime: '17:30',
		Index: '40',
	},
	{
		PeriodId: '0014',
		ArrangeDate: '2017-01-15',
		DayPeriod: 'pm',
		StartTime: '17:45',
		EndTime: '18:00',
		Index: '51',
	},
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
