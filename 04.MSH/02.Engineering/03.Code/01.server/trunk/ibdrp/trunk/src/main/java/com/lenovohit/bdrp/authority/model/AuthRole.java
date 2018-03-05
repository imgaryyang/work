package com.lenovohit.bdrp.authority.model;


public interface AuthRole extends Cloneable{
	
	public String getId();
	
	public void setId(String id);
	
	public String getCode();

	public void setCode(String code) ;

	public String getName();

	public void setName(String name);
}
