package com.lenovohit.ssm.treat.web.rest;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.treat.manager.HisAssayManager;
import com.lenovohit.ssm.treat.manager.HisPatientManager;
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
//		if (!"0000".equals(param.getUnitCode())) {
//			Patient args = new Patient();
//			args.setMiCardNo(param.getPatientCardNo());// 只有查询条件
//			HisListResponse<Patient> miRelaPatientResponse = hisPatientManager.getRelaCardByMiCardNo(args);// PATIENT0026
//			List<Patient> miRelaPatient = miRelaPatientResponse.getList();
//			if (null != miRelaPatient && miRelaPatient.size() == 1) {
//				Patient patient = miRelaPatient.get(0);
//				param.setPatientId(patient.getNo());//设置关联的自费卡号
//			} else if (null == miRelaPatient || miRelaPatient.size() <= 0) {
//				return ResultUtils.renderFailureResult("不存在关联的医保档案");
//			} else {
//				return ResultUtils.renderFailureResult("存在额外的医保档案信息");
//			}
//		}
		List<AssayRecord> records = hisAssayManager.getAssayRecords(param);
		return ResultUtils.renderSuccessResult(records);
	}
	
	/**
	 * 化验单详情
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/pdfToimage",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forTransPdfToImage(@RequestBody String data){
		AssayRecord record = JSONUtils.deserialize(data, AssayRecord.class);
		//this.getResponse().getOutputStream();
		/*String realPath = "C:/LISPDF/";
		record.setFilePath(realPath);*/
		record = hisAssayManager.getAssayImage(record);
		String fileName = record.getFileName();
		String[] names = fileName.split("\\.");
		if(null == names || names.length !=2)throw new BaseException("错误的文件名格式");
		Map<String,String> result = new HashMap<String,String>();
		result.put("imageName", names[0]);
		result.put("filePath", record.getFilePath());
		
		return ResultUtils.renderSuccessResult(result);
	}
	
	/**
	 * 化验单详情
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/image/{fileName}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void forInfo(@PathVariable("fileName") String fileName){
		//this.getResponse().getOutputStream();
		String realPath = hisAssayManager.getAssayImagePath();
		//再从服务器下载到终端机
		File file = new File(realPath+fileName + ".jpeg");
		System.out.println("file.exists="+file.exists());
		if(file.exists()){
			byte[] buffer = new byte[1024];  
            FileInputStream fis = null;  
            BufferedInputStream bis = null;
            try {
            	fis = new FileInputStream(file);  
                bis = new BufferedInputStream(fis);  
                OutputStream os = this.getResponse().getOutputStream();  
                int i = bis.read(buffer);  
                while (i != -1) {  
                    os.write(buffer, 0, i);  
                    i = bis.read(buffer);  
                } 
    			
                fis.close();  
                os.flush();  
                os.close();
                
    		} catch (FileNotFoundException e) {
    			e.printStackTrace();
    		} catch (IOException e) {
				e.printStackTrace();
			}
		}else{
			
		}
	}
	/**
	 * 打印结果回传
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/printed",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forPrint(@RequestBody String data){
		String realPath = hisAssayManager.getAssayImagePath();//"C:/LISPDF/";
		AssayRecord record = JSONUtils.deserialize(data, AssayRecord.class);
		record.setFilePath(realPath);
		AssayRecord assayRecord = hisAssayManager.print(record);
		return ResultUtils.renderSuccessResult(assayRecord);
	}
	
	/***********************以下为血液科**************************/
	
	/**
	 * 化验单列表
	 * @param start
	 * @param limit
	 * @return
	 */
	@RequestMapping(value = "/tms/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTmsPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		return null;
	}
	/**
	 * 化验单列表
	 * @param start
	 * @param limit
	 * @return
	 */
	@RequestMapping(value = "/tms/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTmsList(@RequestParam(value = "data", defaultValue = "") String data) {
		
		return null;
	}
	/**
	 * 化验单详情
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/tms/details/{orderno}/{itemCode}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTmsInfo(@PathVariable("orderno") String orderno,@PathVariable("itemCode") String itemCode){
		return null;
	}
	/**
	 * 打印结果回传
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
