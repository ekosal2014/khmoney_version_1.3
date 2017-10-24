package kh.com.loan.services;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kh.com.loan.domains.Message;
import kh.com.loan.domains.User;
import kh.com.loan.mappers.UserMapper;
import kh.com.loan.utils.KHException;



@Service
public class UserService {
	
	@Autowired
	private UserMapper userMapper;
	
	public User loadUserByUsername (String username) {		
		return userMapper.loadUserByUsername(username);		
		
	}
	
	public Message loadingUserList() throws KHException {
		try {
			HashMap<String, Object> result = new HashMap<>();
			result.put("loadingUserList", userMapper.loadingAllUser());
			result.put("loadingCountUserList", userMapper.loadingCountAllUser());
			return new Message("0000",result);
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	

}
