package com.lenovohit.ssm.treat.manager.impl;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.ssm.base.utils.PdfUtil;
import com.lenovohit.ssm.treat.dao.LisWebserviceDao;
import com.lenovohit.ssm.treat.manager.HisAssayManager;
import com.lenovohit.ssm.treat.model.AssayRecord;
/**
 *
 */

/*1.OpenCon -------查看数据库链接状态
openCon.html
2.JK(string ffmc,string data)----报告单查询
ffmc：ZZDYCX
data：<DATA><BKH>0000565656</BKH><SJJG>30</SJJG></DATA>，XML格式
3.PrintForm_ByBarcode根据条码获取详情图片
PrintForm_ByBarcode.html
barcode：1004042290
4.EditPrinted-------打印回传
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
	public List<AssayRecord> getAssayRecords(AssayRecord AssayRecord){
		try {
			String ffmc = "ZZDYCX";
			String patientCardNo = AssayRecord.getPatientCardNo();
			String patientId = AssayRecord.getPatientId();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			String dtReg = AssayRecord.getDtReg();
			String dtEnd = AssayRecord.getDtEnd();
			Date date1 = format.parse(dtReg);
			Date date2 = format.parse(dtEnd);
			long days = (date2.getTime()-date1.getTime())/(1000*60*60*24);
			
			String data = "<DATA><BKH>"+patientId+"</BKH><SJJG>"+(days+1)+"</SJJG></DATA>";
			
			AssayRecord.setFfmc(ffmc);
			AssayRecord.setData(data);
			AssayRecord.setBkh(patientId);
			AssayRecord.setSjjg(days+1);
			
			
			List<AssayRecord>  records = new ArrayList<AssayRecord>();
			
			List<String> result= lisWebserviceDao.postForList("JK", AssayRecord);
			for(String key : result){
				records.add(this.parseAssayRecord(key,AssayRecord));
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
	public AssayRecord getAssayImage(AssayRecord AssayRecord){
		String url = AssayRecord.getPdfUrl();
		String time = url.substring(url.lastIndexOf("/")-8,url.lastIndexOf("/"));
		String fileName = time + url.substring(url.lastIndexOf("/")+1, url.length());
		String filePath = imagePath;//AssayRecord.getFilePath();
		AssayRecord.setFilePath(filePath);
		String pdfPath = filePath+fileName;
		PdfUtil.downloadPdf(url, pdfPath);
		File file = new File(pdfPath);
		if(file.exists()){//文件存在
			AssayRecord.setFileName(fileName);
			PdfUtil.pdf2multiImage(pdfPath, filePath + fileName.substring(0, fileName.lastIndexOf(".")) + ".jpeg");
			//之后删除生成的PDF文件
			file.delete();
		}
		else{
			AssayRecord.setFileName("");
		}
		return AssayRecord;
	}
	
	@Override
	public String getAssayImagePath() {
		return imagePath;
	}
	
	/**
	 * 化验单打印回传	assay/printed	post
	 * @param record
	 * @return
	 */
	public AssayRecord print(AssayRecord record){
		try {
			String ffmc = "ZZDYDY";
			String bgdbm = record.getBgdbm();
			String data = "<DATA><BGDBM>"+bgdbm+"</BGDBM></DATA>";
			record.setFfmc(ffmc);
			record.setData(data);
			
			String url = record.getPdfUrl();
			String time = url.substring(url.lastIndexOf("/")-8,url.lastIndexOf("/"));
			String fileName = time + url.substring(url.lastIndexOf("/")+1, url.length());
			String imageName = fileName.substring(0, fileName.lastIndexOf(".")) + ".jpeg";
			String filePath = record.getFilePath();
			String imagePath = filePath + imageName;
			File file = new File(imagePath);
			if(file.exists()){//删除成功
				boolean flag = file.delete();
				System.out.println("flag="+flag);
				record.setPrintFlag("0");
			}
			
			String printCallback = lisWebserviceDao.postForEntity("JK", record);
			
			return record;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	private AssayRecord parseAssayRecord(String content,AssayRecord def){
		AssayRecord assayRecord = new AssayRecord();
		BeanUtils.copyProperties(def, assayRecord);
		SAXReader reader = new SAXReader();
		try {
			Document doc = reader.read(new ByteArrayInputStream(content.getBytes("UTF-8")));
			Element root = doc.getRootElement();
			//System.out.println("BGDBM:[" + root.elementText("BGDBM") + "]");
			assayRecord.setBgdbm(root.elementText("BGDBM"));
			assayRecord.setTmh(root.elementText("TMH"));
			assayRecord.setYbh(root.elementText("YBH"));
			assayRecord.setHyrq(root.elementText("HYRQ"));
			assayRecord.setHyxmmc(root.elementText("HYXM"));
			assayRecord.setSqsj(root.elementText("SQSJ"));
			assayRecord.setSqysmc(root.elementText("SQYS"));
			assayRecord.setShbz(root.elementText("SHBZ"));
			assayRecord.setFsbz(root.elementText("FSBZ"));
			assayRecord.setDybz(root.elementText("DYBZ"));
			assayRecord.setPdfUrl(root.elementText("URL"));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (DocumentException e) {
			e.printStackTrace();
		}
		
		return assayRecord;
	}
}
