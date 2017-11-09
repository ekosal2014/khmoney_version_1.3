package kh.com.loan.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import kh.com.loan.domains.Message;
import kh.com.loan.mappers.AddressMapper;
import kh.com.loan.utils.KHException;

@Service
public class AddressService {

	@Autowired
	private AddressMapper addressMapper;
	
	public Message provinceListAll() throws KHException{
		try{
			return new Message("0000",addressMapper.loadingAllProvinces());
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
}
