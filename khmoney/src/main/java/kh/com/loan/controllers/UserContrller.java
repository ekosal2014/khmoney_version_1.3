package kh.com.loan.controllers;


import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.solr.common.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import kh.com.loan.domains.Message;
import kh.com.loan.domains.User;
import kh.com.loan.mappers.UserMapper;
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
	@RequestMapping(value = "/employeeAdd", method = RequestMethod.POST)
	public @ResponseBody Message employee(@RequestParam HashMap<String, Object> params,@RequestParam(name = "file", required = false) MultipartFile file,HttpServletRequest request) throws KHException {
		System.out.println(" Hello ===="+params+"  "+file);
		String storeFolderLocation = createStoredFolder(request);
		String fileName            = createFileName();
		try{
			if (file != null) {
				if (!isFileTypeImage(file.getOriginalFilename())){
					throw new KHException("9999", "ប្រភេទរូបភាពដែលបានបញ្ចូលមិនត្រឹមត្រូវទេ!");
				}
				String storeFileLocation = storeFolderLocation+file.getOriginalFilename();
				File fl    = new File(storeFileLocation);
				File newFl = new  File(storeFolderLocation+fileName);
				
				FileCopyUtils.copy(file.getBytes(), fl);
				FileUtils.moveFile(fl, newFl);
				//System.out.println(storeFolderLocation+createFileName());
				params.put("photo", fileName);
			}else {
				params.put("photo", "employee.png");
			}
			
			return userService.insertNewUser(params);
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
		
	}
	
	@RequestMapping(value = "/employeeGetById" , method = RequestMethod.GET)
	public @ResponseBody Message employeeGetById(@RequestParam int user_id) throws KHException {
		return userService.employeeGetById(user_id);
	}
	
	@RequestMapping(value = "/employeeChangePassword" , method = RequestMethod.POST)
	public @ResponseBody Message employeeChangePassword(@RequestBody HashMap<String, String> params) throws KHException{
		System.out.println(params);
		return userService.employeeChangePassword(params);
	}
	
	@RequestMapping(value = "/employeeChangeInformation" , method = RequestMethod.POST)
	public @ResponseBody Message employeeChangeInformation(@RequestParam HashMap<String, String> params,@RequestParam(name = "file", required = false) MultipartFile file,HttpServletRequest request) throws KHException{
		String storeFolderLocation = createStoredFolder(request);
		String fileName            = createFileName();
		try{
			if (file != null) {
				if (!isFileTypeImage(file.getOriginalFilename())){
					throw new KHException("9999", "ប្រភេទរូបភាពដែលបានបញ្ចូលមិនត្រឹមត្រូវទេ!");
				}
				String storeFileLocation = storeFolderLocation+file.getOriginalFilename();
				File fl    = new File(storeFileLocation);
				File newFl = new  File(storeFolderLocation+fileName);
				
				FileCopyUtils.copy(file.getBytes(), fl);
				FileUtils.moveFile(fl, newFl);
				//System.out.println(storeFolderLocation+createFileName());
				params.put("photo", fileName);
			}else {
				params.put("photo", "");
			}
			
			return userService.employeeChangeInformation(params);
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
	
	@RequestMapping(value = "/employeeDelete" , method = RequestMethod.GET)
	public @ResponseBody Message employeeDelete(@RequestParam int userId) throws KHException{
		return userService.employeeDelete(userId);
	}
	
	@RequestMapping(value = "/employeeSetPermission" , method = RequestMethod.GET)
	public @ResponseBody Message employeeSetPermission(@RequestParam int userId) throws KHException{
		return userService.employeeSetPermission(userId);
	}
	
	@RequestMapping(value = "/employeeUpdatePermission" , method = RequestMethod.POST)
	public @ResponseBody Message employeeUpdatePermission(@RequestBody List<HashMap<String,String>> params) throws KHException{
		//System.out.println(" Hello == "+params);
		return userService.insertOrUpdateUserInformation(params);
	}
	
	@RequestMapping(value = "/loadingMenuUser" , method = RequestMethod.GET)
	public @ResponseBody Message loadingMenuUser() throws KHException{
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User user = new User();
		if(!auth.getPrincipal().equals("anonymousUser")){			
			 user = (User) auth.getPrincipal();
		}else {
			throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
		}
		return userService.employeeSetPermission(user.getUser_id());
	}
	
	private String createStoredFolder(HttpServletRequest request) {
        String realPath = request.getSession().getServletContext().getRealPath("/");
        String relativePath = getRelativePath();
        String storedFolderLocation = realPath + relativePath;
        File dir = new File(storedFolderLocation);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        return storedFolderLocation;
    }
    private boolean isFileTypeImage(String fileName) {
        String imagePattern =
                "([^\\s]+(\\.(?i)(jpg|jpeg|png|gif|bmp))$)";
        return Pattern.compile(imagePattern).matcher(fileName).matches();
 
    }
    private String getRelativePath() {
        String fileSeparator = "/";
        return "../resources"+fileSeparator+"static"+fileSeparator+"img"+fileSeparator+"images/";
    }
    
    private String getDomainName(HttpServletRequest request) {
        return request.getProtocol().toLowerCase().replaceAll("[0-9./]", "") + "://" +
                request.getServerName() + ":" + request.getServerPort();
    }
    
    private String createFileName(){
    	return new SimpleDateFormat("yyyyMMddHHmmss").format(new Date())+".jpg";    	
    }
}
