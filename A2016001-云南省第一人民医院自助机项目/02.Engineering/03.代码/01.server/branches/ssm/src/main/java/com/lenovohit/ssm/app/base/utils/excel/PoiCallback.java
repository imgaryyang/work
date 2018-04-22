package com.lenovohit.ssm.app.base.utils.excel;

import org.apache.poi.ss.usermodel.Row;


public interface PoiCallback {
	boolean HandleDataRow(Row row, Object obj) throws Exception;
}
