package com.lenovohit.hwe.pay.exception;

public enum ExceptionLevel {
	
	EXCEPTION_LEVEL_UNDEFINED(""),
	EXCEPTION_LEVEL_ERROR("ERROR"),
	EXCEPTION_LEVEL_WARN("WARN"),
	EXCEPTION_LEVEL_INFO("INFO"),
	EXCEPTION_LEVEL_DEBUG("DEBUG");
	  
	private final String level;
	private ExceptionLevel(String level){
		this.level = level;
	}
	
	public String getExceptionType(){
		return this.level;
	}
}
