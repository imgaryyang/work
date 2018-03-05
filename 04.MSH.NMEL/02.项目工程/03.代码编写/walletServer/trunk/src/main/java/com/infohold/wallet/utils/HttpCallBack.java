package com.infohold.wallet.utils;


public abstract class HttpCallBack {
	protected Object response;
	public Object getResponse(){
		return response;
	}
	public abstract void callBack(String responseText);
}
