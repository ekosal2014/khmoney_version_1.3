package kh.com.loan.controllers;


import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.solr.common.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
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
	@RequestMapping(value = "/employeeAdd", method = RequestMethod.POST)
	public @ResponseBody Message employee(@RequestParam HashMap<String, Object> params,@RequestParam("file") MultipartFile file,HttpServletRequest request) throws KHException {
		System.out.println(" Hello ===="+params+"  "+file);
		String storeFolderLocation = createStoredFolder(request);
		String fileName            = createFileName();
		try{
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
			return userService.insertNewUser(params);
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
		
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
