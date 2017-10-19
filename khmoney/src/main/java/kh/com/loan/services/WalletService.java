package kh.com.loan.services;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kh.com.loan.domains.Message;
import kh.com.loan.mappers.WalletMapper;
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
}
