package kh.com.loan.services;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import kh.com.loan.domains.Message;
import kh.com.loan.domains.User;
import kh.com.loan.mappers.UserMapper;
import kh.com.loan.utils.Common;
import kh.com.loan.utils.KHException;



@Service
public class UserService {
	
	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
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
	
	public Message insertNewUser(HashMap<String, Object> params) throws KHException{
		try{
			User user = new User();
			/*check user login information */
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				user = (User) auth.getPrincipal();
				
			}else {
				throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
			}
		   if (String.valueOf(params.get("photo")).equals("")){
			   params.put("photo","employee.png");
		   }
		   if (!String.valueOf(params.get("password")).equals(String.valueOf(params.get("confirmPassword")))){
			   throw new KHException("9999", "ពាក្យសំងាត់ និងបញ្ជាក់ពាក្យមិនត្រូវគ្នាទ!");
		   }
		   params.put("password"   , passwordEncoder.encode(String.valueOf(params.get("password"))));
		   params.put("sts"        , "1");
		   params.put("txt"        , "1");
		   params.put("modify_by"  , String.valueOf(user.getUser_id()));
		   params.put("modify_date", Common.getCurrentDate());		
		   params.put("action"     , "បញ្ចូលពត័មានអំពីអ្នកប្រើប្រាស់ថ្មី!");	
		   params.put("user_code", "EMP-"+Common.padLeft(String.valueOf(userMapper.loadingUserIdMax()+1), 6));
		   userMapper.insertNewUser(params);
		   return new Message("0000","ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលជោគជ័យ");
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
	public Message employeeGetById(int user_id) throws KHException{
		HashMap<String,String> params = new HashMap<>();
		HashMap<String,Object> result = new HashMap<>();
		try{
			params.put("userId", String.valueOf(user_id));
			result.put("userEntry", userMapper.loadUserByCondition(params));
			return new Message("0000",result);
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message employeeChangePassword(HashMap<String,String> params) throws KHException{
		User user = new User();
		try{
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				user = (User) auth.getPrincipal();
				
			}else {
				throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
			}
			user = userMapper.loadUserByCondition(params);
			if (user.getPassword().equals((String)params.get("oldPassword"))){
				throw new KHException("9999", "ពាក្យសំងាត់ និងបញ្ជាក់ពាក្យមិនត្រូវគ្នាទ!");
			}
			if (!String.valueOf(params.get("newPassword")).equals(String.valueOf(params.get("confirmPassword")))){
				throw new KHException("9999", "ពាក្យសំងាត់ និងបញ្ជាក់ពាក្យមិនត្រូវគ្នាទ!");
			}
			user.setPassword(String.valueOf(params.get("newPassword")));
			user.setModify_by(user.getUser_id());
			user.setModify_date(Common.getCurrentDate());
			user.setAction("ធ្វើការកែប្រែពាក្យសំងាត់ដោយ "+ user.getFull_name());
			
			userMapper.editUseById(user);
			return new Message("0000","ការកែប្រែពត័មានរបស់លោកអ្នកទទួលបានជោគជ័យហើយ!");
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message employeeChangeInformation(HashMap<String, String> params) throws KHException{
		try{
			User user = new User();
			/*check user login information */
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				user = (User) auth.getPrincipal();
				
			}else {
				throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
			}
		   user = userMapper.loadUserByCondition(params);
		   if (String.valueOf(params.get("photo")).equals("")){
			   params.put("photo",user.getPhoto());
		   }
		  		
           user.setFull_name(String.valueOf(params.get("fullName")));
           user.setGender(String.valueOf(params.get("gender")));
           user.setPhone(String.valueOf(params.get("phone")));
           user.setEmail(String.valueOf(params.get("email")));
           user.setAddress(String.valueOf(params.get("address")));
           user.setPhoto(String.valueOf(params.get("photo")));
		   user.setModify_by(user.getUser_id());
		   user.setModify_date(Common.getCurrentDate());
		   user.setAction("ធ្វើការកែប្រែដោយ "+ user.getFull_name());
		   
		   userMapper.editUseById(user);
		   return new Message("0000","ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលជោគជ័យ");			
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}

}

	