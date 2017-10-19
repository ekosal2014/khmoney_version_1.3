package kh.com.loan.controllers;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kh.com.loan.domains.Message;
import kh.com.loan.services.WalletService;
import kh.com.loan.utils.KHException;

@Controller
public class WalletController {

	@Autowired
	private WalletService walletService;
	
	@RequestMapping(value = "/loadingWalletListInformation", method = RequestMethod.GET)
	public @ResponseBody Message loadingWalletListInformation(@RequestParam HashMap<String, String> params) throws KHException{
		return walletService.loadingWalletListInformation(params);
	}
	
}
