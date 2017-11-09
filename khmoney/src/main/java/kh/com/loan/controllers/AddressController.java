package kh.com.loan.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import kh.com.loan.domains.Message;
import kh.com.loan.services.AddressService;
import kh.com.loan.utils.KHException;

@Controller
public class AddressController {
	
	@Autowired
	private AddressService addressService;
	
	@RequestMapping(value = "/provinceListAll", method = RequestMethod.GET)
	public @ResponseBody Message provinceListAll() throws KHException{
		return addressService.provinceListAll();
	}
	
	@RequestMapping(value = "/provinceSaveNew", method = RequestMethod.GET)
	public @ResponseBody Message provinceSaveNew() throws KHException{
		return addressService.provinceListAll();
	}
	
	
	
}
