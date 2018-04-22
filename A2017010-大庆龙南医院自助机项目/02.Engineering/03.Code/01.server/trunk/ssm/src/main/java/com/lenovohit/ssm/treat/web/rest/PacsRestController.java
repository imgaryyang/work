package com.lenovohit.ssm.treat.web.rest;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;
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
import com.lenovohit.ssm.treat.hisModel.PACSSSMReport;
import com.lenovohit.ssm.treat.manager.HisPacsManager;
import com.lenovohit.ssm.treat.manager.HisPatientManager;
import com.lenovohit.ssm.treat.manager.impl.PacsManangerImpl;
import com.lenovohit.ssm.treat.model.PacsRecord;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

/**
 * pacs报告
 */
@RestController
@RequestMapping("/ssm/treat/pacs")
public class PacsRestController extends BaseRestController {
	
	@Autowired
	private HisPacsManager hisPacsManager;
	@Autowired
	private HisPatientManager hisPatientManager;
	@Autowired
	private PacsManangerImpl<PACSSSMReport,String> pacsPrintStatuManager;
	
	/**
	 * 根据病人编号查询该病人的pacs报告是否可以打印
	 */
	
	
	/**
	 * pacs列表
	 * @param start
	 * @param limit
	 * @return
	 */
	@RequestMapping(value="/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@RequestParam(value = "data", defaultValue = "") String data){
		//获取当前患者
		PacsRecord param = JSONUtils.deserialize(data, PacsRecord.class);
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
		HisListResponse<PacsRecord> response = hisPacsManager.getPacsRecords(param);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	
	/**
	 * 获取pacs图片
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/pdfToimage",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forTransPdfToImage(@RequestBody String data){
		PacsRecord record = JSONUtils.deserialize(data, PacsRecord.class);
		//this.getResponse().getOutputStream();
		/*String realPath = "F:/LISPDF/";
		record.setFilePath(realPath);*/
		//根据病人编号查询该病人的pacs报告是否可以打印
		/*List<PACSSSMReport> details = pacsPrintStatuManager.find(" from PACSSSMReport where id.applyNo = ? ", record.getExamApplyId());
		Map<String,String> result = new HashMap<String,String>();
		if(details.size() == 1){
			if(details.get(0).getPrintStatus().equals("0")){//0-未打印1-已打印
				record = hisPacsManager.getPacsImage(record);
				String fileName = record.getFileName();
				String[] names = fileName.split("\\.");
				if(null == names || names.length !=2)throw new BaseException("错误的文件名格式");
				result.put("imageName", names[0]);
				result.put("filePath", record.getFilePath());
				record.setFileName(fileName);
			}
			else{
				result.put("print_status", details.get(0).getPrintStatus());
			}
		}*/
		record = hisPacsManager.getPacsImage(record);
		String fileName = record.getFileName();
		String[] names = fileName.split("\\.");
		if(null == names || names.length !=2)throw new BaseException("错误的文件名格式");
		Map<String,String> result = new HashMap<String,String>();
		result.put("imageName", names[0]);
		result.put("filePath", record.getFilePath());
		record.setFileName(fileName);
		
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
		String realPath = hisPacsManager.getPacsImagePath();
		PacsRecord pacsRecord = new PacsRecord();
		pacsRecord.setFileName(fileName);
		//再从服务器下载到终端机
		File file = new File(realPath+fileName + ".jpeg");
		
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
		String realPath = hisPacsManager.getPacsImagePath();//"F:/LISPDF/";
		Date date = new Date();
		DateFormat format = new SimpleDateFormat("yyyyMMdd");
		String time = format.format(date);
		PacsRecord record = JSONUtils.deserialize(data, PacsRecord.class);
		String fileName = time + record.getExamApplyId() + ".jepg";
		
		record.setFilePath(realPath);
		record.setFileName(fileName);
		/*record.setFilePath(realPath);
		String applyNo = record.getExamApplyId();
		String fileName = record.getFileName();
		String imagePath = realPath + fileName.substring(0, fileName.lastIndexOf(".")) + ".jpeg";
		final String DRIVER_CLASS = "oracle.jdbc.driver.OracleDriver";
		final String DATABASE_URL = "jdbc:oracle:thin:@192.168.90.93:1521:lnora";
		final String DATABASE_USRE = "hisuser";
		final String DATABASE_PASSWORD = "hisuser";
		int retvalue = -1;
		try {
			Class.forName(DRIVER_CLASS);
			Connection connection = DriverManager.getConnection(DATABASE_URL,DATABASE_USRE,DATABASE_PASSWORD);
			CallableStatement callableStatement = connection.prepareCall("{call UPDATEZZJREPORTPRINTSTATUS(?,?,?)}");
			callableStatement.setString(1, applyNo);
			callableStatement.setInt(2, 0);
			callableStatement.setInt(3, 3);
			callableStatement.registerOutParameter(4, java.sql.Types.NUMERIC);//输出值
			callableStatement.execute();
			retvalue = callableStatement.getInt(4);
			//之后需要把打印的图片删除
			File file = new File(imagePath);
			if(file.exists()){//删除成功
				boolean flag = file.delete();
				record.setPrintFlag("0");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}*/
		PacsRecord pacsRecord = hisPacsManager.print(record);
		return ResultUtils.renderSuccessResult(pacsRecord);
	}

}
