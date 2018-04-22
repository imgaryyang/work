package com.lenovohit.ssm.treat.manager.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.ssm.treat.dao.LisWebserviceDao;
import com.lenovohit.ssm.treat.manager.HisAssayManager;
import com.lenovohit.ssm.treat.model.AssayRecord;
/**
 *
 */

/*1.OpenCon -------查看数据库链接状态
openCon.html
2.GetTestForm----获取病人化验记录
GetTestForm.html
patientId：0003463433
patientType：门诊
dtReg：2017-04-01
etEnd：2017-04-15
3.PrintForm_ByBarcode根据条码获取详情图片
PrintForm_ByBarcode.html
barcode：1004042290
4.EditPrinted-------打印回传
5.GetReportLockDoubt-------待查原因的查询
Barcode:1004042290
*/
public class HisAssayManagerImpl implements HisAssayManager{
	@Autowired
	private LisWebserviceDao lisWebserviceDao;
	
	private String imagePath;
	
	public String getImagePath() {
		return imagePath;
	}
	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}
	/**
	 * 查询化验单列表	assay/page	get
	 * @param patient
	 * @return
	 */
	public List<AssayRecord> getAssayRecords(AssayRecord assayRecord){
		try {
			List<AssayRecord> records = new ArrayList<AssayRecord>();
			
			List<String> resultList = lisWebserviceDao.postForList("GetTestForm", assayRecord);
			AssayRecord _assayRecord = null;
			for(String result : resultList){
				_assayRecord = this.parseAssayRecord(result, assayRecord);
				if(_assayRecord != null) records.add(_assayRecord);
			}
			return records;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 查询化验单明细（化验结果）	assay/{id}	get
	 * @param record
	 * @return
	 */
	public String getAssayImage(AssayRecord AssayRecord){
		try {
			String fileName = lisWebserviceDao.postForEntity("PrintForm_ByBarcode", AssayRecord);
			if(StringUtils.isEmpty(fileName))return null;
			return imagePath+"/"+fileName;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 化验单打印回传	assay/printed	post
	 * @param record
	 * @return
	 */
	public AssayRecord print(AssayRecord record){
		try {
			lisWebserviceDao.postForEntity("EditPrinted", record);
			return record;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return record;
	}
	@Override
	public AssayRecord getTipsMsg(AssayRecord record) {
		try {
			String result = lisWebserviceDao.postForEntity("GetReportLockDoubt", record);
			AssayRecord assayRecord = this.parseTipsMsg(result, record);
			return assayRecord;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	private AssayRecord parseAssayRecord(String content, AssayRecord def){
		if(StringUtils.isBlank(content)) return null;
		String[] array = content.split(",");
		if(array == null || array.length != 14) return null;
		
		AssayRecord assayRecord = new AssayRecord();
		BeanUtils.copyProperties(def, assayRecord);
		//0-审核标识,1-日期_barcode,2-仪器编码,3-样本号,4-报告日期,5-审核人Id,6-核收人Id,7-患者性别,8-患者年龄,9-样本类型,10-(项目编码),11-(项目名称),12-'',13-''
		//例子: 5,150131_6019280563,I16200_D,400215,20150130,083863,041542,男,27岁,血清,476+475+477,血糖(急诊)+钾钠氯(急诊)+血淀粉酶(急诊),,205001010100
		//0	5, 					// 第一个审核标识，5:审核,2:核收,0:接收,9:待查
		String status = array[0];
		assayRecord.setStatus(status);
		//1	170411_1004042293,  // 第二个检验日期+条码号，
		String testdate_barcode = array[1];
		String[] strs = testdate_barcode.split("_");
		String testdate = strs[0];
		String barcode = strs[1];
		assayRecord.setBarcode(barcode);
		assayRecord.setTestdate(testdate);
		//2	JZ_StagoCompact, 	//	第三个仪器ID，
		assayRecord.setMachineId(array[2]);
		//3	3101,				//	第四个样本号 //
		assayRecord.setSampleId(array[3]);
		//4	20170410,			//	第五个是检验日期，申请日期
		assayRecord.setApplydate(array[4]);
		//5	300950,				//	第六个是患者门诊号，
		//6	300492,
		//7	女,					//	第七个性别，
		assayRecord.setPatientGender(array[7]);
		//8	29岁,				//	9 第八个年龄
		assayRecord.setPatientAge(array[8]);
		//9	血浆,					//	第九个样本类型，
		assayRecord.setSampleType(array[9]);
		//10 F00000051012,		//	第十个检验项目编码，
		assayRecord.setSubjectCode(array[10]);
		//11 急诊凝血-1,			// 第十一个检验项目名称
		assayRecord.setSubjectName(array[11]);
		//12 ,
		//13 205100000000， 第3位与审核标识描述一致，第4位: 0:未打印, 1:已打印
		assayRecord.setPrintStatus(array[13].substring(3, 4));
		
		return assayRecord;
	}
	
	private AssayRecord parseTipsMsg(String content, AssayRecord def){
		if(StringUtils.isBlank(content)) return null;
		String[] array = content.split("\\^");
		if(array == null || array.length!= 3 ) return null;
		
		AssayRecord assayRecord = new AssayRecord();
		BeanUtils.copyProperties(def, assayRecord);
		//0-是否打印提示^1-是否弹窗提示^2-提示内容
		//例子: 1^0^请到2号门诊楼12楼生化免疫室取报告
		//0	1, 					// 第一个是否打印提示 0：不打印，1：打印
		assayRecord.setPrintFlag(array[0]);
		//1	0,  				// 第二个是否弹窗提示 0：不弹窗，1：弹窗
		assayRecord.setWindowFlag(array[1]);
		//2	请到2号门诊楼12楼生化免疫室取报告, 	//	提示内容，
		assayRecord.setMsg(array[2]);
		
		return assayRecord;
	}
}
