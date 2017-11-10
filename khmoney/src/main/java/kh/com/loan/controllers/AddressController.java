package kh.com.loan.controllers;


import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
	public @ResponseBody Message provinceSaveNew(@RequestParam HashMap<String,String> params) throws KHException{
		System.out.println(" hello +++++++++++ "+params);
		return addressService.provinceSaveNew(params);
	}
	
	@RequestMapping(value = "/districtSaveNew", method = RequestMethod.GET)
	public @ResponseBody Message districtSaveNew(@RequestParam HashMap<String,String> params) throws KHException{
		System.out.println(" hello +++++++++++ "+params);
		return addressService.districtSaveNew(params);
	}
	
	@RequestMapping(value = "/communeSaveNew", method = RequestMethod.GET)
	public @ResponseBody Message communeSaveNew(@RequestParam HashMap<String,String> params) throws KHException{
		System.out.println(" hello +++++++++++ "+params);
		return addressService.communeSaveNew(params);
	}
	@RequestMapping(value = "/villageSaveNew", method = RequestMethod.GET)
	public @ResponseBody Message villageSaveNew(@RequestParam HashMap<String,String> params) throws KHException{
		System.out.println(" hello +++++++++++ "+params);
		return addressService.villageSaveNew(params);
	}
	
	
}
