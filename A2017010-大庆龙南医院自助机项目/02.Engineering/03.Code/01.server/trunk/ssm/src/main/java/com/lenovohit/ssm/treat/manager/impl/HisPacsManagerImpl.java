package com.lenovohit.ssm.treat.manager.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Base64Utils;

import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.parser.PdfReaderContentParser;
import com.itextpdf.text.pdf.parser.SimpleTextExtractionStrategy;
import com.itextpdf.text.pdf.parser.TextExtractionStrategy;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.ssm.base.utils.PdfUtil;
import com.lenovohit.ssm.treat.dao.HisRestDao;
import com.lenovohit.ssm.treat.dao.PacsWebserviceDao;
import com.lenovohit.ssm.treat.manager.HisPacsManager;
import com.lenovohit.ssm.treat.model.PacsRecord;
import com.lenovohit.ssm.treat.transfer.dao.RestListResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestRequest;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

public class HisPacsManagerImpl implements HisPacsManager {

	@Autowired
	private HisRestDao hisRestDao;
	@Autowired
	private PacsWebserviceDao pacsWebserviceDao;

	private String location;
	private String imagePath;

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	/**
	 * 根据病人编号查询PACS列表 PACS0001
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public HisListResponse<PacsRecord> getPacsRecords(PacsRecord param) {
		try {
			Map<String, Object> reqMap = new HashMap<String, Object>();
			// 入参字段映射
			reqMap.put("PATIENT_ID", param.getPatientId());
			reqMap.put("DATE_BEGIN", param.getDtReg());//起始时间
			reqMap.put("DATE_END", param.getDtEnd());//截止时间

			RestListResponse response = hisRestDao.postForList("PACS0001", RestRequest.SEND_TYPE_LOCATION, reqMap);
			HisListResponse<PacsRecord> result = new HisListResponse<PacsRecord>(response);

			List<Map<String, Object>> resMaplist = response.getList();
			List<PacsRecord> resList = new ArrayList<PacsRecord>();
			PacsRecord pacsRecord = null;
			if (response.isSuccess() && null != resMaplist) {
				for (Map<String, Object> resMap : resMaplist) {
					pacsRecord = new PacsRecord();

					pacsRecord.setExamApplyId(object2String(resMap.get("EXAM_APPLY_ID")));
					pacsRecord.setExamItemName(object2String(resMap.get("EXAM_ITEM_NAME")));
					pacsRecord.setExpectExamDate(object2String(resMap.get("EXPECT_EXAM_DATE")));
					pacsRecord.setPid(object2String(resMap.get("PID")));
					pacsRecord.setPatientName(object2String(resMap.get("PATIENT_NAME")));
					pacsRecord.setSex(object2String(resMap.get("PATIENT_SEX")));

					resList.add(pacsRecord);
				}

				result.setList(resList);
			}
			return result;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public PacsRecord getPacsImage(PacsRecord PacsRecord) {
		String applyno = PacsRecord.getExamApplyId();// 申请单号
		// String url = location+"op=DownLoadPdf";
		// 调用DownLoadPdf的webservice接口
		/*
		 * Map<String, Object> reqMap = new HashMap<String, Object>(); //入参字段映射
		 * putNullToMap(reqMap, "applyno", PacsRecord.getExamApplyId());
		 * 
		 * RestEntityResponse response =
		 * pacsWebserviceDao.postForEntity("DownLoadPdf",
		 * RestRequest.SEND_TYPE_POST, reqMap); HisEntityResponse<PacsRecord>
		 * reuslt = new HisEntityResponse<PacsRecord>(response); Map<String,
		 * Object> resMap = response.getEntity(); if(response.isSuccess() &&
		 * null != resMap){
		 * PacsRecord.setDownLoadPdfResult(object2String(resMap.get(
		 * "DownLoadPdfResult"))); }
		 */
		String envelopeBegin = "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">";
		String data = envelopeBegin + "<soap:Body><DownLoadPdf xmlns=\"http://tempuri.org/\"><applyno>" + applyno
				+ "</applyno></DownLoadPdf></soap:Body></soap:Envelope>";
		PacsRecord.setData(data);

		List<PacsRecord> records = new ArrayList<PacsRecord>();
		String result = "";
		try {
			result = pacsWebserviceDao.postForEntity("op=DownLoadPdf", PacsRecord, PacsRecord.getData());// base64编码
			Date date = new Date();
			DateFormat format = new SimpleDateFormat("yyyyMMdd");
			String time = format.format(date);
			String fileName = time + applyno + ".pdf";
			String filePath = imagePath;// PacsRecord.getFilePath();
			byte[] bt = Base64Utils.decodeFromString(result);// base64解码
			
			File pdf = new File(filePath + fileName);
			pdf.getParentFile().mkdirs();
			if (!pdf.exists()){
				pdf.createNewFile();
			}
			FileOutputStream outputStream = new FileOutputStream(pdf);
			outputStream.write(bt);
			outputStream.flush();  
			outputStream.close();
			
			PdfUtil.pdf2multiImage(filePath + fileName, filePath + fileName.substring(0, fileName.lastIndexOf(".")) + ".jpeg");
			
			String pdfPath = filePath + fileName;
			File file = new File(pdfPath);
			if (file.exists()) {// 文件存在
				 PacsRecord.setFileName(fileName);
				// 之后删除生成的PDF文件
				file.delete();
			}
			 else {
				PacsRecord.setFileName("");
			}
			//String buff = getPdfFileText(filePath + fileName);
			/** 
             * 根据实际运行效果 设置缓冲区大小 
             */  
            /*byte[] buffer = new byte[1024 * 1024];
            buffer = buff.getBytes();
            if(buffer.length > 0){
            	pdf.delete();
            }
            FileOutputStream fileout = new FileOutputStream(pdf);
            fileout.write(buffer,0,buffer.length);
            fileout.flush();  
            fileout.close();*/
			
			/*String pdfPath = filePath + fileName;
			File file = new File(pdfPath);
			if (file.exists()) {// 文件存在
				 PacsRecord.setFileName(fileName);
				 PdfUtil.changePdfToImg(pdfPath, filePath, fileName);
				// 之后删除生成的PDF文件
				file.delete();
			} else {
				PacsRecord.setFileName("");
			}*/

		} catch (Exception e1) {
			e1.printStackTrace();
		}
		return PacsRecord;
	}

	@Override
	public String getPacsImagePath() {
		return imagePath;
	}

	@Override
	public PacsRecord print(PacsRecord record) {
		String fileName = record.getFileName();
		String filePath = record.getFilePath() + fileName.substring(0, fileName.lastIndexOf(".")) + ".jpeg";
		File file = new File(filePath);
		if (file.exists()) {// 文件存在
			// 之后删除生成的图片
			file.delete();
		}
		return null;
	}

	private PacsRecord parsePacsRecord(String content, PacsRecord def) {
		PacsRecord pacsRecord = new PacsRecord();
		BeanUtils.copyProperties(def, pacsRecord);
		String[] array = content.split(",");

		return pacsRecord;
	}
	
	private void putNullToMap(Map<String, Object> map, String key, Object value) {
		if (value == null || StringUtils.isBlank(value.toString())) {
			map.put(key, "");
		} else {
			map.put(key, value);
		}
	}

	private String object2String(Object obj) {
		return obj == null ? "" : obj.toString();
	}
	
	public static String getPdfFileText(String fileName) {  
		PdfReader reader;
		StringBuffer buff = new StringBuffer();
		PdfReaderContentParser parser;
		try {
			reader = new PdfReader(fileName);
			parser = new PdfReaderContentParser(reader);
			TextExtractionStrategy strategy;  
			for (int i = 1; i <= reader.getNumberOfPages(); i++) {  
				strategy = parser.processContent(i, new SimpleTextExtractionStrategy());  
				buff.append(strategy.getResultantText());  
			} 
		} catch (IOException e) {
			e.printStackTrace();
		}  
		return buff.toString();  
	} 
}
