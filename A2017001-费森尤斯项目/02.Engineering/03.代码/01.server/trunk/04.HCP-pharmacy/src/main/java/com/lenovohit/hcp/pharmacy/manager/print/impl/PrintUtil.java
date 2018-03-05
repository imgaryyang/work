package com.lenovohit.hcp.pharmacy.manager.print.impl;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.impl.AbstractPrintDataManagerImpl;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;

//打印工具类

public class PrintUtil {


	// 返回一个非空的字符串
	static public String getNotNull(String value) {
		if (value == null || "null".equals(value)) {
			return "";
		} else {
			return value;
		}
	}

	// 返回指定格式日期
	static public String getDate(Date value) {
		SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
		return formatDate.format(value);

	}

	// 返回指定格式日期
	static public String getAmount(BigDecimal value) {
		DecimalFormat  formatDate = new DecimalFormat ("0.00");
		return formatDate.format(value);
	}
}