package com.lenovohit.hwe.org.model;

import javax.persistence.Transient;

import com.lenovohit.bdrp.authority.model.Authable;

public interface AuthModel extends Authable {
	@Transient
	public default String getNamespace(){
		return "hwe";
	}
}
