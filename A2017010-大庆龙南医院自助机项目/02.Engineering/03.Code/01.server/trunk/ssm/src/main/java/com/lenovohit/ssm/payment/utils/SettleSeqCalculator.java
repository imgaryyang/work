package com.lenovohit.ssm.payment.utils;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.lenovohit.ssm.base.utils.SequenceUtils;
public class SettleSeqCalculator {
	/**
	 * "prefix<2>" + "yyMMdd<6>" + "流水<8>" = 16
	 */
	synchronized public static String calculateCode(String prefix) {
		Date date = new Date();
		SimpleDateFormat format = new SimpleDateFormat("yyMMdd");
		String sdate = format.format(date);
		DecimalFormat df = new DecimalFormat();
		df.applyPattern("00000000");
		// 2 + 6 + 8 = 16
		String settleNo = prefix + sdate + df.format(SequenceUtils.getInstance().getNextValue(prefix));
		return settleNo;
	}
    
}