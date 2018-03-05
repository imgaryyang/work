package com.lenovohit.hcp.base.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.lenovohit.core.utils.DateUtils;

public class HcpDateUtils {
	/**
	 * 得到当天开始的时刻 比如 2017-03-21 00:00:00
	 * 
	 * @return
	 */
	public static Date getBeginOfDay() {
		String beginTime = "00:00:00";
		String date = DateUtils.getCurrentDateStr(DateUtils.DATE_PATTERN_DASH_YYYYMMDD);
		return getTimeOfDay(beginTime, date);
	}

	private static Date getTimeOfDay(String time, String date) {
		return DateUtils.string2Date(date + " " + time, DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS);
	}

	/**
	 * 得到当天结束的时刻 比如 2017-03-21 23:59:59
	 * 
	 * @return
	 */
	public static Date getEndOfDay() {
		String endTime = "23:59:59";
		String date = DateUtils.getCurrentDateStr(DateUtils.DATE_PATTERN_DASH_YYYYMMDD);
		return getTimeOfDay(endTime, date);
	}
	/**
	 * Date类型转换为String
	 * 
	 * @return
	 */
	public static String getString(Date date) {
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");  
		String strdate=sdf.format(date);  
		return strdate;
	}
}
