package com.test;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.dom4j.DocumentHelper;

import com.lenovohit.core.utils.DocMap;

public class XmlToExcel {
	public static String inputStream2String(InputStream is) throws IOException{
	   BufferedReader in = new BufferedReader(new InputStreamReader(is));
	   StringBuffer buffer = new StringBuffer();
	   String line = "";
	   while ((line = in.readLine()) != null){
	     buffer.append(line);
	   }
	   return buffer.toString();
	}
	public static void main(String args[]) throws Exception{
		String root ="C:/Users/lenovo/Desktop/新建文本文档 (8).txt";
		File file = new File(root);
		String xml =  inputStream2String(new FileInputStream(file));
		System.out.println(xml);
		DocMap map = new DocMap(DocumentHelper.parseText(xml).getRootElement());
		
		Object[] objs =(Object[]) map.get("NTQPAYQYZ");
		
		 FileOutputStream output = new FileOutputStream(new File("C:/Users/lenovo/Desktop/bankxml20170620.xlsx"));  //读取的文件路径   
	        XSSFWorkbook wb = new XSSFWorkbook();//(new BufferedInputStream(output));         
	        XSSFSheet sheet = wb.createSheet("0");  
	        wb.setSheetName(0, "mi"); 
	        String[] names={
	        		 "EPTDAT","REQNBR","YURREF","TRSAMT","NUSAGE","RTNNAR",
					 "CRTACC","CRTNAM","CRTADR","CRTBNK","RCVBRD",
					 "C_REQSTS","C_RTNFLG","OPRDAT","REGFLG",
					 "REQSTS","RTNFLG","STLCHN","BNKFLG","BUSSTS"
					 
			};
	        XSSFRow row1 = sheet.createRow(0); 
			 
			 for(int c =0 ; c<names.length;c++){
				 XSSFCell cell = row1.createCell(c);                     
	              cell.setCellType(XSSFCell.CELL_TYPE_STRING);//文本格式  
	              cell.setCellValue(names[c]);//写入内容  
			 }
		for(int line =0;line<objs.length;line++){
			DocMap docMap = (DocMap)objs[line];
			 XSSFRow row = sheet.createRow(line+1); 
			 
			 for(int c =0 ; c<names.length;c++){
				 XSSFCell cell = row.createCell(c);                     
	              cell.setCellType(XSSFCell.CELL_TYPE_STRING);//文本格式  
	              DocMap v =(DocMap) docMap.get(names[c]);
	              String str ="";
	              if(v!= null)str = v.toString();
	              cell.setCellValue(str);//写入内容  
			 }
		}
		 wb.write(output);  
		 wb.close();
	        output.close();   
	}

	public static void readLog(File file,ArrayList<String[]> list1,ArrayList<String[]> list2) {
	//	System.out.println(file.getPath());
		//int line = 0;
		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new InputStreamReader(new FileInputStream(file),"GBK"));  
			String tempString = null;
			// 一次读一行，读入null时文件结束
			while ((tempString = reader.readLine()) != null) {
				if(tempString.indexOf("G^") != -1){
					tempString = tempString.replace("入参:G^", "");
					tempString = tempString.replace("^", " ");
					String[] strs = tempString.split(" ");
					//System.out.println("'"+tempString.substring(0, tempString.length()-2));
					//System.out.println(line);
					if(strs[0].length() == 10){
						list1.add(strs);
					}else{
						list2.add(strs);
					}
				}
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e1) {
				}
			}
		}
	}

}
