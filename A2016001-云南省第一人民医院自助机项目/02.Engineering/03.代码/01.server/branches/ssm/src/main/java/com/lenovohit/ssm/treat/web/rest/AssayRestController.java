package com.lenovohit.ssm.treat.web.rest;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.ArrayList;
import java.util.List;

import org.apache.cxf.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.treat.hisModel.XXJDOrderInfor;
import com.lenovohit.ssm.treat.hisModel.XXJDOrderResult;
import com.lenovohit.ssm.treat.manager.HisAssayManager;
import com.lenovohit.ssm.treat.manager.HisPatientManager;
import com.lenovohit.ssm.treat.manager.impl.TmsManangerImpl;
import com.lenovohit.ssm.treat.model.AssayRecord;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

/**
 * 化验单
 */
@RestController
@RequestMapping("/ssm/treat/assay")
public class AssayRestController extends BaseRestController {
	
	@Autowired
	private HisAssayManager hisAssayManager;
	@Autowired
	private HisPatientManager hisPatientManager;
	@Autowired
	private TmsManangerImpl<XXJDOrderInfor,String> xxjdOrderInforManager;
	@Autowired
	private TmsManangerImpl<XXJDOrderResult,String> xxjdOrderResultManager;
	
	
	/**
	 * 化验单列表
	 * @param start
	 * @param limit
	 * @return
	 */
	@RequestMapping(value="/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@RequestParam(value = "data", defaultValue = "") String data){
		//获取当前患者
		AssayRecord param = JSONUtils.deserialize(data, AssayRecord.class);
		if(null == param || null == param.getPatientId()){
			return ResultUtils.renderFailureResult();
		}
		//非自费患者设置关联卡病人编号
		if (!"0000".equals(param.getUnitCode())) {
			Patient args = new Patient();
			args.setMiCardNo(param.getPatientCardNo());// 只有查询条件
			HisListResponse<Patient> miRelaPatientResponse = hisPatientManager.getRelaCardByMiCardNo(args);// PATIENT0026
			List<Patient> miRelaPatient = miRelaPatientResponse.getList();
			if (null != miRelaPatient && miRelaPatient.size() == 1) {
				Patient patient = miRelaPatient.get(0);
				param.setPatientId(patient.getNo());//设置关联的自费卡号
			} else if (null == miRelaPatient || miRelaPatient.size() <= 0) {
				return ResultUtils.renderFailureResult("不存在关联的医保档案");
			} else {
				return ResultUtils.renderFailureResult("存在额外的医保档案信息");
			}
		}
		//param.setPatientId("MZ17090601");
		List<AssayRecord> records = hisAssayManager.getAssayRecords(param);
		return ResultUtils.renderSuccessResult(records);
	}
	/**
	 * 化验单详情
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/image/{barcode}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("barcode") String barcode){
		AssayRecord record =  new AssayRecord();
		record.setBarcode(barcode);
		String filePath = hisAssayManager.getAssayImage(record);
		record.setFilePath(filePath);;
		if(StringUtils.isEmpty(filePath)){
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult(record);
	}
	/**
	 * 打印结果回传
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/printed",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forPrint(@RequestBody String data){
		AssayRecord record = JSONUtils.deserialize(data, AssayRecord.class);
		AssayRecord assayRecord = hisAssayManager.print(record);
		return ResultUtils.renderSuccessResult(assayRecord);
	}
	
	/**
	 * 打印结果回传
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/msg/{barcode}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMsg(@PathVariable("barcode") String barcode){
		AssayRecord record =  new AssayRecord();
		record.setBarcode(barcode);
		AssayRecord msgRecord = hisAssayManager.getTipsMsg(record);
		
		return ResultUtils.renderSuccessResult(msgRecord);
	}
	
	/***********************以下为血液科**************************/
	
	/**
	 * 输血化验单列表
	 * @param start
	 * @param limit
	 * @return
	 */
	@RequestMapping(value = "/tms/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTmsPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		XXJDOrderInfor query =  JSONUtils.deserialize(data, XXJDOrderInfor.class);
		StringBuilder jql = new StringBuilder( " from XXJDOrderInfor where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		//非自费患者设置关联卡病人编号
		if (!"0000".equals(query.getUnitCode())) {//查找关联的医保患者自费卡
			Patient args = new Patient();
			args.setMiCardNo(query.getPatientCardNo());// 只有查询条件
			HisListResponse<Patient> miRelaPatientResponse = hisPatientManager.getRelaCardByMiCardNo(args);// PATIENT0026
			List<Patient> miRelaPatient = miRelaPatientResponse.getList();
			if (null != miRelaPatient && miRelaPatient.size() == 1) {
				Patient patient = miRelaPatient.get(0);
				System.out.println("关联卡病人编号 "+patient.getNo());
				if(!StringUtils.isEmpty(patient.getNo())){
					jql.append(" and patinetNo like ? ");
					values.add("%"+patient.getNo()+"%");
				}
				
			} else if (null == miRelaPatient || miRelaPatient.size() <= 0) {
				return ResultUtils.renderFailureResult("不存在关联的医保档案");
			} else {
				return ResultUtils.renderFailureResult("存在额外的医保档案信息");
			}
		}else{
			if(!StringUtils.isEmpty(query.getPatientNo())){
				jql.append(" and patinetNo like ? ");
				values.add("%"+query.getPatientNo()+"%");
			}
		}
		if(!StringUtils.isEmpty(query.getStartDate())){
			jql.append(" and orderdate > ? ");
			values.add("%"+query.getStartDate()+"%");
		}
		if(!StringUtils.isEmpty(query.getEndDate())){
			jql.append(" and orderdate < ? ");
			values.add("%"+query.getEndDate()+"%");
		}
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		xxjdOrderInforManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
	/**
	 * 输血化验单列表
	 * @param start
	 * @param limit
	 * @return
	 */
	@RequestMapping(value = "/tms/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTmsList(@RequestParam(value = "data", defaultValue = "") String data) {
		
		XXJDOrderInfor query =  JSONUtils.deserialize(data, XXJDOrderInfor.class);
		StringBuilder jql = new StringBuilder( " from XXJDOrderInfor where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		//非自费患者设置关联卡病人编号
		if (!"0000".equals(query.getUnitCode())) {//查找关联的医保患者自费卡
			Patient args = new Patient();
			args.setMiCardNo(query.getPatientCardNo());// 只有查询条件
//			args.setMiCardNo("530121A31489278");//手动设置医保患者卡内数据
			HisListResponse<Patient> miRelaPatientResponse = hisPatientManager.getRelaCardByMiCardNo(args);// PATIENT0026
			List<Patient> miRelaPatient = miRelaPatientResponse.getList();
			if (null != miRelaPatient && miRelaPatient.size() == 1) {
				Patient patient = miRelaPatient.get(0);
				if(!StringUtils.isEmpty(patient.getNo())){
					jql.append(" and patientNo = ? ");
					values.add(patient.getNo());
				}
			} else if (null == miRelaPatient || miRelaPatient.size() <= 0) {
				return ResultUtils.renderFailureResult("不存在关联的医保档案");
			} else {
				return ResultUtils.renderFailureResult("存在额外的医保档案信息");
			}
		}else{
			if(!StringUtils.isEmpty(query.getPatientNo())){
				jql.append(" and patientNo = ? ");
				values.add(query.getPatientNo());
			}
		}
		if(!StringUtils.isEmpty(query.getStartDate())){
			jql.append(" and orderdate > ? ");
			values.add(query.getStartDate());
		}
		if(!StringUtils.isEmpty(query.getEndDate())){
			jql.append(" and orderdate < ? ");
			values.add(query.getEndDate());
		}
		
		List<XXJDOrderInfor> records = xxjdOrderInforManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(records);
	}
	/**
	 * 输血化验单详情
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/tms/details/{orderno}/{itemCode}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTmsInfo(@PathVariable("orderno") String orderno,@PathVariable("itemCode") String itemCode){
//		orderno = "1005061305";
//		itemCode = "F00000059280";
		List<XXJDOrderResult> details =xxjdOrderResultManager.find(" from XXJDOrderResult where id.orderno = ? and id.itemCode = ?", orderno, itemCode);
		return ResultUtils.renderSuccessResult(details);
	}
	/**
	 * 输血化验单打印结果回传
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/tms/print/{orderno}/{itemCode}",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forTmsPrint(@PathVariable("orderno") String orderno,@PathVariable("itemCode") String itemCode){
		final String DRIVER_CLASS = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
		final String DATABASE_URL = "jdbc:sqlserver://10.10.210.185:1433;instanceName=SQL08R2;DatabaseName=HH_BM_KHYY";
		final String DATABASE_USRE = "jk_his";
		final String DATABASE_PASSWORD = "his";
		String retvalue = "";
		try {
		    Class.forName(DRIVER_CLASS);
		    Connection connection = DriverManager.getConnection(DATABASE_URL,DATABASE_USRE,DATABASE_PASSWORD);
		    CallableStatement callableStatement = connection.prepareCall("{call Proc_HIS_PrintRecord(?,?)}");
		    callableStatement.setString(1, orderno);
		    callableStatement.registerOutParameter(2, java.sql.Types.VARCHAR);//第二个为输出值
		    callableStatement.execute();
		    retvalue = callableStatement.getString(2);//获取经过存储过程计算过后的输出值
		} catch (Exception e) {
		    e.printStackTrace();
		}
		//TODO 执行存储过程
		/*Connection   con   =   session.connect();     
		CallableStatement   proc   =   null;     
		con   =   connectionPool.getConnection();     
		proc   =   con.prepareCall("{ call Proc_HIS_PrintRecord(?) }");     
		proc.setString(1,   record.getOrderno());     
		proc.execute();     
		session.close();*/ 
		return ResultUtils.renderSuccessResult(retvalue);
	}
}
