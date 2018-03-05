package com.lenovohit.hcp.odws.manager;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilderFactory;

import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

public class WeatherUtil2 {

	/**
	 * 组装soap请求xml文件
	 * 
	 * @param hospitalName
	 *            登录名，即送检医院名称
	 * @param password
	 *            登录密码
	 * @param startDate
	 *            查询起始时间
	 * @param endDate
	 *            查询截止时间
	 * @return
	 */
	private static String getSoapRequest(String hospitalName, String password, String startDate, String endDate) {
		StringBuilder sb = new StringBuilder();
		sb.append("<?xml version=\"1.0\" encoding=\"utf-8\"?>"
				+ "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
				+ "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" "
				+ "xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" + "<soap:Body>"
				+ "<GetDetailData5 xmlns=\"http://report.dagene.net/\">" + "<ClientID>" + hospitalName + "</ClientID>"
				+ "<ClientGUID>" + password + "</ClientGUID>" + "<StartDate>" + startDate + "</StartDate>" + "<EndDate>"
				+ endDate + "</EndDate>" + "</GetDetailData5>" + "</soap:Body>" + "</soap:Envelope>");
		return sb.toString();
	}

	/**
	 * 用户把SOAP请求发送给服务器端，并返回服务器点返回的输入流
	 * 
	 * @param hospitalName
	 *            登录名，即送检医院名称
	 * @param password
	 *            登录密码
	 * @param startDate
	 *            查询起始时间
	 * @param endDate
	 *            查询截止时间
	 * @return 服务器端返回的输入流，供客户端读取
	 * @throws Exception
	 */
	private static String getSoapInputStream(String hospitalName, String password, String startDate, String endDate)
			throws Exception {
		try {
			String soap = getSoapRequest(hospitalName, password, startDate, endDate);
			if (soap == null) {
				return null;
			}
			URL url = new URL("http://report.dagene.net/RasClientDetail.asmx");
			URLConnection conn = url.openConnection();
			conn.setUseCaches(false);
			conn.setDoInput(true);
			conn.setDoOutput(true);

			conn.setRequestProperty("Content-Length", Integer.toString(soap.length()));
			conn.setRequestProperty("Content-Type", "text/xml; charset=utf-8");
			conn.setRequestProperty("SOAPAction", "http://report.dagene.net/GetDetailData5");

			OutputStream os = conn.getOutputStream();
			OutputStreamWriter osw = new OutputStreamWriter(os, "utf-8");
			osw.write(soap);
			osw.flush();
			osw.close();

			InputStream is = conn.getInputStream();
			byte[] b = new byte[1024];
			int len = 0;
			String s = "";
			while ((len = is.read(b)) != -1) {
				String ss = new String(b, 0, len, "UTF-8");
				s += ss;
			}
			s = s.replaceAll("&lt;", "<");
			s = s.replaceAll("&gt;", ">");
			System.out.println(s);
			return s;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 对服务器端返回的XML进行解析
	 * 
	 * @param city
	 *            用户输入的城市名称
	 * @return 字符串 用#分割
	 */
	public static List<Map<String, Object>> getDataFromXml(String hospitalName, String password, String startDate,
			String endDate) {
		List<Map<String, Object>> mapList = new ArrayList<Map<String, Object>>();
		try {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			dbf.setNamespaceAware(true);
			String is = getSoapInputStream(hospitalName, password, startDate, endDate);

			long start = System.currentTimeMillis();
			SAXReader reader = new SAXReader();
			try {
				org.dom4j.Document doc = reader.read(new ByteArrayInputStream(is.getBytes("UTF-8")));
				Element rootElt = doc.getRootElement(); // 获取根节点
				Iterator body = rootElt.elementIterator("Body");
				while (body.hasNext()) {
					Element recordEless = (Element) body.next();
					Iterator cdGasFyResponse = recordEless.elementIterator("GetDetailData5Response");
					while (cdGasFyResponse.hasNext()) {
						Element returnValue = (Element) cdGasFyResponse.next();
						Iterator rt = returnValue.elementIterator("GetDetailData5Result");
						while (rt.hasNext()) {
							Element rv = (Element) rt.next();
							Iterator returnIt = rv.elementIterator("ResultsDataSet");
							while (returnIt.hasNext()) {
								Element items = (Element) returnIt.next();
								Iterator itemIt = items.elementIterator("Table");
								while (itemIt.hasNext()) {
									Map<String, Object> map = new HashMap<String, Object>();
									Element item = (Element) itemIt.next();
									String barcode = item.elementTextTrim("BARCODE");
									String samplefrom = item.elementTextTrim("SAMPLEFROM");
									String sampletype = item.elementTextTrim("SAMPLETYPE");
									String collectddate = item.elementTextTrim("COLLECTDDATE");
									String submitdate = item.elementTextTrim("SUBMITDATE");
									String testcode = item.elementTextTrim("TESTCODE");
									String apprdate = item.elementTextTrim("APPRDATE");
									String dept = item.elementTextTrim("DEPT");
									String servgrp = item.elementTextTrim("SERVGRP");
									String usrnam = item.elementTextTrim("USRNAM");
									String apprvedby = item.elementTextTrim("APPRVEDBY");
									String patientname = item.elementTextTrim("PATIENTNAME");
									String sex = item.elementTextTrim("SEX");
									String ageunit = item.elementTextTrim("AGEUNIT");
									String sinonym = item.elementTextTrim("SINONYM");
									String finalValue = item.elementTextTrim("FINAL");
									String analyte = item.elementTextTrim("ANALYTE");
									String s = item.elementTextTrim("S");
									String sorter = item.elementTextTrim("SORTER");
									map.put("barcode", barcode);
									map.put("samplefrom", samplefrom);
									map.put("sampletype", sampletype);
									map.put("collectddate", collectddate);
									map.put("submitdate", submitdate);
									map.put("testcode", testcode);
									map.put("apprdate", apprdate);
									map.put("dept", dept);
									map.put("servgrp", servgrp);
									map.put("usrnam", usrnam);
									map.put("apprvedby", apprvedby);
									map.put("patientname", patientname);
									map.put("sex", sex);
									map.put("ageunit", ageunit);
									map.put("sinonym", sinonym);
									map.put("final", finalValue);
									map.put("analyte", analyte);
									map.put("s", s);
									map.put("sorter", sorter);
									mapList.add(map);
								}
							}
						}
					}
				}
			} catch (DocumentException e) {
				e.printStackTrace();
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
			long end = System.currentTimeMillis();
			System.out.println("耗时：" + (end - start) + "ms");
			return mapList;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 测试
	 * 
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		List<Map<String, Object>> mapList = getDataFromXml("泉州迪安测试客户", "2D94F753D7BBDAFAE0530BF0000A14FC",
				"2017-9-28 00:00:00", "2017-9-28 23:59:59");
		System.out.println("完成");
	}
}