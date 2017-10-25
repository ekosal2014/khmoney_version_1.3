package kh.com.loan.controllers;


import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import kh.com.loan.domains.Message;
import kh.com.loan.domains.User;
import kh.com.loan.services.UserService;
import kh.com.loan.utils.KHException;

@Controller
public class UserContrller {
	
	@Autowired
	private UserService userService;
	
	@RequestMapping(value = "/loadingUserList", method = RequestMethod.GET)
	public @ResponseBody Message loadingUserList() throws KHException {
		return userService.loadingUserList();
	}
	@RequestMapping(value = "/employeeAdd", method = RequestMethod.POST, headers = "content-type=multipart/form-data")
	public @ResponseBody Message employee(@RequestParam HashMap<String, Object> param,MultipartHttpServletRequest request) throws KHException {
		System.out.println(" Hello ===="+param+"  "+request.getParameter("gender")+"  "+request.getParameter("file"));
		return new Message();
	}

}
