package com.lenovohit.ssm.treat.dao.impl;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;

import com.lenovohit.core.utils.DocMap;
import com.lenovohit.ssm.treat.dao.LisWebserviceDao;

public class LisWebserviceDaoImpl implements LisWebserviceDao{

	private String location;

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
	private CloseableHttpClient client = HttpClientBuilder.create().build(); 
	
	public  String postForEntity(String code, Object param ) throws Exception {
		Map<String,Object> result = this.post(code, param);
		Object listObject = result.get("string");
		if(null == listObject )return null;
		if(listObject instanceof Object[]){
			Object[] array = (Object[])listObject;
			if(array.length >=0)return array[0].toString();
			return null;
		}else{
			return listObject.toString();
		}
	}

	public  List<String> postForList(String code, Object param) throws Exception {
		Map<String,Object> result = this.post(code, param);
		List<String> list = new ArrayList<String>();
		DocMap XWST = (DocMap)result.get("XWST");
		if( null == XWST )return list;
		
		Object bz = XWST.get("BZ");
		if(("0").equals(bz.toString())){//表示查询成功
			DocMap DATA =   (DocMap)XWST.get("DATA");
			Object DetailObj = DATA.get("DETAIL");
			if(DetailObj instanceof Object[]){
				/*DocMap[] details = (DocMap[])DetailObj;  
				for(DocMap detail : details){
					list.add(detail.toString());
				}*/
				Object[] array = (Object[])DetailObj;
				for(Object value : array){
					System.out.println(value.toString());
					list.add(value.toString());
				}
			}else{
				DocMap detail = (DocMap)DetailObj;
				list.add(detail.toString());
			}
		}else{
			return list;
		}
		//System.out.println(result.get("XWST"));
		//System.out.println(((Map)result.get("XWST")).get("XX"));
		/*Object listObject = result.get("XWST");
		if( null == listObject )return list;
		if(listObject instanceof Object[]){
			Object[] array = (Object[])listObject;
			for(Object value : array){
				System.out.println(value.toString());
				list.add(value.toString());
			}
		}else{
			System.out.println(listObject.toString());
			list.add(listObject.toString());
		}*/
		return list;
	}
	
	public  Map<String,Object> post(String code, Object param) throws Exception {
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		BeanInfo paramBean = Introspector.getBeanInfo(param.getClass());
		PropertyDescriptor[] propertyDescriptors = paramBean.getPropertyDescriptors();
		for (int i = 0; i < propertyDescriptors.length; i++) {
			PropertyDescriptor pro = propertyDescriptors[i];
			if("class".equals(pro.getDisplayName()))continue;
			Method rm = pro.getReadMethod();
			Object value = rm.invoke(param, new Object[0]);
			System.out.println("pro.getDisplayName() : "+pro.getDisplayName()+": "+value);
			if(null != value )params.add(new BasicNameValuePair(pro.getDisplayName(),value.toString()));
		}	
		String xml = post(code,params);
		Document doc = DocumentHelper.parseText(xml);
		DocMap map = new DocMap(doc.getRootElement());
		//System.out.println(((DocMap)map.get("XWST")).get("XX"));
		return map;
	}

	public String post(String code,List<NameValuePair> params ) throws Exception {
		String url = this.location + code;
		System.out.println(" url "+ url);
		HttpPost post = new HttpPost(url);
//		StringEntity stringEntity = new StringEntity("patientId=0003463433&patientType=门诊&dtReg=2017-04-01&dtEnd=2017-04-15");//param参数，可以为"key1=value1&key2=value2"的一串字符串  
//	    stringEntity.setContentType("application/x-www-form-urlencoded;charset=utf-8"); 
		UrlEncodedFormEntity entity = new UrlEncodedFormEntity(params,"utf-8");
		entity.setContentType("application/x-www-form-urlencoded;charset=utf-8");  
		post.setEntity(entity);  
        
        try {
             //提交登录数据
             HttpResponse response = client.execute(post);
          // 判断网络连接状态码是否正常(0--200都数正常)
             String xml = "";
             String strData = "";
             int status =  response.getStatusLine().getStatusCode();
             if (status == HttpStatus.SC_OK) {
            	 xml= EntityUtils.toString(response.getEntity(),"utf-8");
            	 strData = decodeString(xml);
            	 System.out.println(decodeString(xml));
            	 return strData;
             } else{
            	 xml= EntityUtils.toString(response.getEntity(),"utf-8");
            	 System.out.println(decodeString(xml));
            	throw new RuntimeException("请求LIS出错，返回状态码： " + status ); 
             }
         } catch (Exception e) {
        	e.printStackTrace(); 
        	throw e;
         }
//		HttpHeaders headers = new HttpHeaders();
//		headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
//		List<MediaType> acceptableMediaTypes = new ArrayList<MediaType>();
//		acceptableMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
//		headers.setAccept(acceptableMediaTypes);
//		HttpEntity<LinkedMultiValueMap<String, String> > requestEntity = new HttpEntity<LinkedMultiValueMap<String, String> >(map,headers);  
//		
//		ResponseEntity<String> responseEntity = client.postForEntity(url, requestEntity, String.class);
//		String xml = responseEntity.getBody();
//		System.out.println("HisRequest: URL 【" + url + "】");
//		System.out.println("HisRequest: Code【" + code + "】");
//		System.out.println("HisRequest: param【" + JSONUtils.serialize(map) + "】");
//		System.out.println("HisRequest: response 【" + JSONUtils.serialize(xml) + "】");
	}
	
	/**
	 * 替换一个字符串中的某些指定字符
	 * @param strData String 原始字符串
	 * @param regex String 要替换的字符串
	 * @param replacement String 替代字符串
	 * @return String 替换后的字符串
	 */
	public static String replaceString(String strData, String regex, String replacement) {
		if (strData == null) {
			return null;
		}
		int index;
		index = strData.indexOf(regex);
		String strNew = "";
		if (index >= 0) {
			while (index >= 0) {
				strNew += strData.substring(0, index) + replacement;
				strData = strData.substring(index + regex.length());
				index = strData.indexOf(regex);
			}
			strNew += strData;
			return strNew;
		}
		return strData;
	}

	/**
	 * 替换字符串中特殊字符
	 */
	public static String encodeString(String strData) {
		if (strData == null) {
			return "";
		}
		strData = replaceString(strData, "&", "&amp;");
		strData = replaceString(strData, "<", "&lt;");
		strData = replaceString(strData, ">", "&gt;");
		strData = replaceString(strData, "&apos;", "&apos;");
		strData = replaceString(strData, "\"", "&quot;");
		return strData;
	}

	/**
	 * 还原字符串中特殊字符
	 */
	public static String decodeString(String strData) {
		strData = replaceString(strData, "&lt;", "<");
		strData = replaceString(strData, "&gt;", ">");
		strData = replaceString(strData, "&apos;", "&apos;");
		strData = replaceString(strData, "&quot;", "\"");
		strData = replaceString(strData, "&amp;", "&");
		return strData;
	}
	
//	System.out.println(responseEntity.getBody());
//	
//	System.out.println("CONTENT : "+response.getContent());
//	System.out.println("RESUST : "+response.getResult());
//	System.out.println("RESULTcODE : "+response.getResultcode());
//	
////	HisDepartment dept =  JSONUtils.deserialize(response.getContent(), HisDepartment.class);
////	System.out.println("deptname : "+dept.getName());
//	List<HisDepartment> list = JSONUtils.parseObject(response.getContent(),new TypeReference<List<HisDepartment>>(){});
//	System.out.println("deptname : "+list.get(0).getName());
//	String small = JSONUtils.serialize(list.get(0));
//	System.out.println("dept  : "+small);
//	//System.out.println("deptSeized  : "+JSONUtils.parseObject(list.get(0)));
//	System.out.println("************************************");
//	return null;

	
	
}

//
//private void initClient() throws Exception {
//	JaxWsDynamicClientFactory clientFactory = JaxWsDynamicClientFactory.newInstance();
//	this.client = clientFactory.createClient("assay.wsdl");
//}
//private Object[] invoke() throws Exception{
//	Object[] result = client.invoke("sayHello", "KEVIN");
//	return result;
//}
//@Override
//public void afterPropertiesSet() throws Exception {
//	
//}
//public static void main(String args[]) throws Exception{
//	DynamicClientFactory clientFactory = DynamicClientFactory.newInstance();
//	Client client = clientFactory.createClient("assay.wsdl");
//	Object[] result = client.invoke("OpenCon");
//	System.out.println(result[0]);
//	Object[] result1 = client.invoke("GetTestForm","patientId=0003463433&patientType=门诊&dtReg=2017-04-01&dtEnd=2017-04-15");
//	System.out.println(result1[0]);
//}