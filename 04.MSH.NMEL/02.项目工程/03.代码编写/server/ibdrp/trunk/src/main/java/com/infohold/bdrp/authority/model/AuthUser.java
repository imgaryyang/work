package com.infohold.bdrp.authority.model;


public interface AuthUser{

	public String getId();
	
	public void setId(String id);
	
	public String getUsername();

	public void setUsername(String username);

	public String getName();

	public void setName(String name);

	public String getPassword();

	public void setPassword(String password);
	
//	public String getRoles();
//
//	public void setRoles(String roles);
//
//	public List<String> getRoleList() ;

//	public Date getRegisterDate();
//
//	public void setRegisterDate(Date registerDate);
}
