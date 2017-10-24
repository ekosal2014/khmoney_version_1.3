package kh.com.loan.services;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import kh.com.loan.domains.Message;
import kh.com.loan.domains.User;
import kh.com.loan.domains.Wallet;
import kh.com.loan.mappers.WalletMapper;
import kh.com.loan.utils.Common;
import kh.com.loan.utils.KHException;
import kh.com.loan.utils.PaginationUtils;

@Service
public class WalletService {
	
	@Autowired
	private WalletMapper walletMapper;
	
	public Message loadingWalletListInformation(HashMap<String, String> params) throws KHException{
		HashMap<String, Object> result = new HashMap<>();
		try{
			PaginationUtils.perPage = Integer.valueOf(params.get("perPage"));
			PaginationUtils.currentPage = Integer.valueOf(params.get("currentPage"));			
			params.put("start",  String.valueOf(PaginationUtils.getStart()));
			params.put("perPage", String.valueOf(PaginationUtils.perPage));	
			result.put("walletList",            walletMapper.loadingListWallet(params));
			result.put("loadingTotalCountRows", walletMapper.loadingTotalCountRows());
			result.put("TotalAmount",           walletMapper.loadingMywalletByIMaxId());
			return new Message("0000", result);
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message walletTransaction(HashMap<String, Object> params) throws KHException{
		
		try{
			Wallet wallet = new Wallet();
			User   user   = new User();
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				user = (User) auth.getPrincipal();
				
			}else {
				throw new KHException("9999", "ការកែប្រែរបស់លោកអ្នកទទួលបរាជ័យ");
			}
			wallet = walletMapper.loadingMywalletByIMaxId();
			System.out.println("Hello === 1"+params.get("totalAmount"));
			wallet.setOld_amount(wallet.getTotal_amount());
			wallet.setAmount(Long.valueOf((String)params.get("totalAmount")));
			wallet.setType_amount((String)params.get("typeAmonut"));
			wallet.setDecription((String)params.get("decription"));
			wallet.setRequest_by(user.getUser_id());
			wallet.setRequest_date(Common.getCurrentDate());
			wallet.setRequest_id(0);
			wallet.setApprove_by(user.getUser_id());
			wallet.setApprove_date(Common.getCurrentDate());
			System.out.println("Hello === 2");
			if (wallet.getType_amount().equals("1")){
				wallet.setTotal_amount(wallet.getTotal_amount() + wallet.getAmount());
			}else{
				wallet.setTotal_amount(wallet.getTotal_amount() - wallet.getAmount());
			}
			if (walletMapper.insertMywallet(wallet) <= 0){
		    	throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
		    }
			return new Message("0000", "ការកែប្រែរបស់លោកអ្នកទទួលបានជោគជ័យ");
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
}
