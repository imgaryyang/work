package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Card;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisCardService {	
	public RestEntityResponse<Card> getInfo(Card request, Map<String, ?> variables);
	
	public RestListResponse<Card> findList(Card request, Map<String, ?> variables);
	
	public RestEntityResponse<Card> bind(Card request, Map<String, ?> variables);
	
	public RestEntityResponse<Card> logoff(Card request, Map<String, ?> variables);
	
	public RestEntityResponse<Card> logon(Card request, Map<String, ?> variables);
}
