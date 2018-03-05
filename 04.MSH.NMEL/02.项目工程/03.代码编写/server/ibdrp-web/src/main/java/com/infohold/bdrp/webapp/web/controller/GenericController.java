package com.infohold.bdrp.webapp.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import com.infohold.core.web.controller.BaseController;

public class GenericController extends BaseController {

	private String apiUri;

	private String viewUri;

	private RestTemplate restTemplate = new RestTemplate();

	public void setApiUri(String apiUri) {
		this.apiUri = apiUri;
	}

	public void setViewUri(String viewUri) {
		this.viewUri = viewUri;
	}

	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		ModelAndView mv = new ModelAndView(viewUri);
		if (RequestMethod.GET.equals(request.getMethod())) {
		} else if (RequestMethod.POST.equals(request.getMethod())) {
		}
		return mv;
	}

}
