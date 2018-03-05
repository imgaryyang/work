package com.lenovohit.hcp.test.db.model;

import com.lenovohit.core.utils.StringUtils;

public class Column {
	public Column(Object obj){
		Object[] array = (Object[])obj;
		this.setColumnName(array[0].toString());
		this.setDataType(array[1].toString());
		this.setColumnComment(array[2].toString());
	}
	public Column(String columnName,String dataType,String columnComment){
		this.columnName =columnName;
		this.dataType =dataType;
		this.columnComment =columnComment;
	}
	private String columnName;
	private String dataType;
	private String columnComment;
	public String getColumnName() {
		return columnName;
	}
	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}
	public String getDataType() {
		return dataType;
	}
	public void setDataType(String dataType) {
		this.dataType = dataType;
	}
	public String getColumnComment() {
		return columnComment;
	}
	public void setColumnComment(String columnComment) {
		this.columnComment = columnComment;
	}
	public String toModel(){
		StringBuilder sb = new StringBuilder();
		sb.append("private ");
		sb.append(getType(this.dataType)).append(" ");
		sb.append(getName(this.columnName));
		sb.append(";");
		if(!StringUtils.isEmpty(this.columnComment))
			sb.append(" //").append(this.columnComment);
		return sb.toString();
	}
	private String getType(String type){
		if("char".equals(type.toLowerCase()) 
				||"varchar".equals(type.toLowerCase()) 
				||"varchar2".equals(type.toLowerCase()) 
		){
			return "String";
		}else if("datetime".equals(type.toLowerCase())) {
			return "Date";
		}else {
			return "String";
		}
	}
	private String getName(String name){
		String low = name.toLowerCase();
		String[] ns = low.split("_");
		StringBuilder sb=new StringBuilder();
		for(int i=0 ; i < ns.length;i++){
			if(i==0)sb.append( ns[i]);
			else{
				String v =  ns[i];
				sb.append( v.substring(0, 1).toUpperCase());
				sb.append( v.substring(1));
			}
		}
		return sb.toString();
	}
}
