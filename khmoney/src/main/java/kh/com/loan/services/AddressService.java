package kh.com.loan.services;

import java.util.HashMap;

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
	
	public Message provinceSaveNew(HashMap<String,String> params) throws KHException{
		try{
			addressMapper.provinceSaveNew(params);
			return new Message("0000","success hz");
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message districtSaveNew(HashMap<String,String> params) throws KHException{
		try{
			addressMapper.districtSaveNew(params);
			return new Message("0000","success hz");
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message communeSaveNew(HashMap<String,String> params) throws KHException{
		try{
			addressMapper.communeSaveNew(params);
			return new Message("0000","success hz");
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message villageSaveNew(HashMap<String,String> params) throws KHException{
		try{
			addressMapper.villageSaveNew(params);
			return new Message("0000","success hz");
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
}
