package kh.com.loan.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import kh.com.loan.domains.Message;
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

}
