package com.lenovohit.hcp;

import java.util.HashMap;
import java.util.Map;

import com.lenovohit.hcp.base.configuration.RedisSequenceConfig;

public class HCPConstants {
	public static String HCP_SESSION_USER_KEY = "ssm_machine";

	public final static Map<String, RedisSequenceConfig> SEQUENCE_RULE = new HashMap<String, RedisSequenceConfig>() {
		private static final long serialVersionUID = 1L;
		{
			put("B_HOSINFO_HOS_ID", 				new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "H", 4, 1001, 1)); 	//医院id：		H 0001
			put("B_DEPTINFO_DEPT_ID", 				new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "", 6)); 			//科室id：		000001
			put("HCP_USER_USER_ID", 				new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "", 6)); 			//人员id：		000001
			put("B_COMPANY_COMPANY_ID", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "V", 13, 1001, 1));  //厂商id：		C 0000000000001
			
			put("ITEM_INFO_ITEM_CODE", 				new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "I", 13)); 			//项目编码：		I 0000000000001
			put("ITEM_INFO_GROUP_CODE", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "", -1)); 			//中心项目编码：
			put("ITEM_INFO_PRICE_CODE", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "", -1)); 			//物价编码：
			
			put("ITEM_GROUP_INFO_COMBO_ID", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "", 10)); 			//组套id：		0000000001
			put("ITEM_GROUP_DETAIL_COMBO_NO", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_NUMBER)); 							//组合号：		1
			
			put("B_PATIENTINFO_PATIENT_ID", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "P", 13)); 			//患者id：		P 0000000000001
			put("REG_INFO_REG_ID", 					new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "Rg", 4)); 			//就诊流水号：		R YYYYMMDD 00001
			put("PHA_PATSTORE_EXEC_NO", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "E", 5)); 			//保管执行单单号：		E YYYYMMDD 00001
			put("OC_PAYWAY_PAY_ID", 				new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "P", 5)); 			//支付id：		P YYYYMMDD 00001
			put("HIS_ORDER_ORDER_ID", 				new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "O", 5)); 			//订单号：		O YYYYMMDD 00001
			put("OC_OPER_BALANCE_BALANCE_ID", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "D", 13)); 			//结账单号：		D 0000000000001
			put("OC_CHARGEDETAIL_RECIPE_ID", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "C", 5)); 			//处方id：		R YYYYMMDD 00001
			put("FM_INVOICE_MANAGE_INVOICE_S", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "I", 13)); 			//发票起始号：		I 0000000000001
			put("OW_DIAGNOSE_DISEASE_NO", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "D", 13)); 			//诊断序号：		D 0000000000001
			put("OW_ORDER_ORDER_ID", 				new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "Or", 4)); 			//医嘱id：		O YYYYMMDD 00001
			put("OW_ORDER_RECIPE_ID", 				new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "Re", 4)); 			//医嘱id：		R YYYYMMDD 00001
			put("OW_ORDER_COMBO_NO", 				new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_NUMBER)); 							//组合号：		1
			put("OW_INQUIRY_RECORD_RECORD_ID", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "R", 13)); 			//病历id：		R 0000000000001
			put("OW_INQUIRY_RECORD_MODEL_MODEL_ID", new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "R", 13)); 			//模板id：		R 0000000000001
			put("PHA_DRUGINFO_DRUG_CODE", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "D", 13)); 			//药品编码：		D 0000000000001
			put("MATERIAL_INFO_MATERIAL_CODE", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "M", 13)); 			//物资编码：		D 0000000000001
			put("PHA_COMPANYINFO_COMPANY_ID", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "DC", 12)); 			//厂商id：		C 0000000000001
			put("MATERIAL_COMPANYINFO_COMPANY_ID", 	new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "MC", 12)); 			//厂商id：		C 0000000000001
			put("PHA_BUYBILL_BUY_BILL", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "B", 5)); 			//采购单号：		B YYYYMMDD 00001
			put("PHA_INPUTINFO_IN_BILL", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "I", 5)); 			//入库单号：		I YYYYMMDD 00001
			put("PHA_APPLYIN_APP_BILL", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "A", 5)); 			//申请单号：		A YYYYMMDD 00001
			put("PHA_OUTPUTINFO_OUT_ID", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "T", 13)); 			//出库id：		T 0000000000001
			put("PHA_OUTPUTINFO_OUT_BILL", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "U", 5)); 			//出库单号：		U YYYYMMDD 00001
			put("PHA_RECIPE_APPLY_NO", 				new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "A", 5)); 			//发药申请单：		A YYYYMMDD 00001
			put("PHA_STOREINFO_STORE_ID", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "P", 13)); 			//库存id：		P 0000000000001
			put("MATERIAL_STOREINFO_STORE_ID", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "WP", 12)); 			//库存id：		P 0000000000001
			put("INSTRM_STOREINFO_STORE_ID", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "IP", 12)); 			//库存id：		P 0000000000001
			put("PHA_STORESUMINFO_STORE_SUM_ID", 	new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "S", 13)); 			//库存汇总id：		S 0000000000001
			put("INSTRM_STOREINFO_STORE_SUM_ID", 	new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "IS", 12)); 			//库存汇总id：		S 0000000000001
			put("MATERIAL_STORESUMINFO_STORE_SUM_ID", 	new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "MS", 12)); 			//库存汇总id：		S 0000000000001
			put("PHA_CHECKINFO_CHECK_ID", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "C", 13)); 			//盘点单号：		C 0000000000001
			put("PHA_CHECKINFO_CHECK_BILL", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "P", 5)); 			//盘点单号：		C 0000000000001
			put("MATERIAL_CHECKINFO_CHECK_BILL", 	new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "WP", 4)); 			//盘点单号：		C 0000000000001
			put("PHA_ADJUST_ADJUST_ID", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "A", 13)); 			//调价id：		A 0000000000001
			put("PHA_ADJUST_ADJUST_BILL", 			new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "B", 13)); 			//调价单号：		B 0000000000001
			put("B_EMPLOYEE_EMP_ID", 				new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "E", 9)); 			//员工id：		E 0000000000001
			put("PHA_PATIENTSTORE_EXEC_EXEC_NO", 	new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "E", 5)); 			//执行单号：		E YYYYMMDD 00001
			put("MATERIAL_CERTIFICATE_REG_ID", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "C", 6)); 			//证书ID：		C 00001
			put("MATERIAL_CHECKINFO_CHECK_ID", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "WP", 4)); 			//物资盘点ID：		WP YYYYMMDD 0001
			put("MATERIAL_APPLYIN_APP_BILL", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "A", 5)); 		    //物资请领单号：	A YYYYMMDD 0001
			put("MATERIAL_INPUTINFO_IN_BILL", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "I", 5)); 			//入库单号：		I YYYYMMDD 00001
			put("MATERIAL_OUTPUTINFO_OUT_BILL", 	new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "WO", 4)); 			//入库单号：		I YYYYMMDD 00001
			put("INSTRM_CHECKINFO_CHECK_ID", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "GP", 5)); 			//固定资产ID：		GP 00001
			put("INSTRM_CHECKINFO_CHECK_BILL", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "GP", 4)); 			//固定资产盘点单号：GP YYYYMMDD 0001
			put("INSTRM_INPUTINFO_IN_BILL", 		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "IS", 4)); 			//固定资产盘点单号：GP YYYYMMDD 0001
		    put("INSTRM_INFO_INSTRM_CODE",      	new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "A", 13));       	//物资编码：   	A 0000000000001
		    put("INSTRM_INFO_IN_BILL",      		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_FIXED_STRING, "B", 13));       	//物资编码：   	A 0000000000001
		    put("PHA_PATLIS_EXAMBARCODE",      		new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "E", 5));       	//物资编码：   	A 0000000000001
		    
		}
	};
}
