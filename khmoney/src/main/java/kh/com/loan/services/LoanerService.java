package kh.com.loan.services;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kh.com.loan.domains.Loan;
import kh.com.loan.domains.LoanPayment;
import kh.com.loan.domains.Loaner;
import kh.com.loan.domains.Message;
import kh.com.loan.domains.Setting;
import kh.com.loan.domains.User;
import kh.com.loan.domains.Wallet;
import kh.com.loan.enums.Gender;
import kh.com.loan.enums.LoanSts;
import kh.com.loan.enums.LoanTxt;
import kh.com.loan.mappers.AddressMapper;
import kh.com.loan.mappers.LoanMapper;
import kh.com.loan.mappers.LoanerMapper;
import kh.com.loan.mappers.SettingMapper;
import kh.com.loan.mappers.UserMapper;
import kh.com.loan.mappers.WalletMapper;
import kh.com.loan.utils.Common;
import kh.com.loan.utils.KHException;
import kh.com.loan.utils.PaginationUtils;
import kh.com.loan.utils.Validation;

@Service
public class LoanerService {
	SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
	SimpleDateFormat formatToSting = new SimpleDateFormat("dd-MM-yyyy");
	
	@Autowired
	private LoanerMapper loanerMapper;
	@Autowired
	private LoanMapper loanMapper;	
	@Autowired
	private SettingMapper settingMapper;
	@Autowired
	private WalletMapper walletMapper;
	@Autowired
	private UserMapper userMapper;
	@Autowired
	private AddressMapper addressMapper;
	
	public Message districtsListByProId(int proId) throws KHException{
		HashMap<String,String> params = new HashMap<>();
		HashMap<String,Object> result = new HashMap<>();
		try{
			params.put("disProId", String.valueOf(proId));
			result.put("listDistricts", addressMapper.loadingDistrictsByProvinceId(params));
			return new Message("0000",result);
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
	public Message communesListByDisId(int disId) throws KHException{
		HashMap<String,String> params = new HashMap<>();
		HashMap<String,Object> result = new HashMap<>();
		try{
			params.put("comDisId", String.valueOf(disId));
			result.put("listCommunes", addressMapper.loadingCommunesByDistrictsId(params));
			return new Message("0000",result);
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
	public Message villageListByComId(int comId) throws KHException{
		HashMap<String,String> params = new HashMap<>();
		HashMap<String,Object> result = new HashMap<>();
		try{
			params.put("vilComId", String.valueOf(comId));
			result.put("listVillages", addressMapper.loadingVillagesByCommunesId(params));
			return new Message("0000",result);
		}catch(Exception e){
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message loanerGetMaxId() throws KHException {
		HashMap<String, Object> result = new HashMap<>();
		User user = new User();
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				user = (User) auth.getPrincipal();				
			}
			
			int maxLoanerId = loanerMapper.loanerGetMaxId() + 1;
			String maxLoanerPad = StringUtils.leftPad(String.valueOf(maxLoanerId), 9, "0");
			int maxLoanId = loanMapper.loanGetMaxId() + 1;
			String maxLoanPad =  StringUtils.leftPad(String.valueOf(maxLoanId), 9, "0");
			result.put("maxLoanerId", maxLoanerPad);
			result.put("maxLoanId", maxLoanPad);
			result.put("listProvinces", addressMapper.loadingAllProvinces());
			return new Message("0000", result);
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message loadingSettingData(String payTxt) throws KHException{
		HashMap<String, Object> objSetting = new HashMap<>();
		try {
			List<Setting> columnList  =  settingMapper.loadingListColumns(payTxt);
			List<Setting> settingList =  settingMapper.loadingListSetting(payTxt);	
			List<User>    userList    =  userMapper.loadingAllUser();
			objSetting.put("ListColumns", columnList);
			objSetting.put("settingList", settingList);
			objSetting.put("ListUser",    userList);
			return new Message("0000",    objSetting);
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message loadingSettingValue(String payTxt) throws KHException{
		HashMap<String, Object> objSetting = new HashMap<>();
		try {			
			List<Setting> settingList = (List) settingMapper.loadingListSetting(payTxt);				
			objSetting.put("settingList", settingList);
			return new Message("0000",objSetting);
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message decrementTypeValue() throws KHException {
		HashMap<String, Object> objSetting = new HashMap<>();
		try {			
			List<Setting> decrementList = (List) loanMapper.decrementTypeValue();				
			objSetting.put("decrementList", decrementList);
			return new Message("0000",objSetting);
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	@Transactional(value="transactionManager",rollbackFor={KHException.class,Exception.class})
	public Message loanSaveNewItem(Map map) throws KHException {
		/*Loaner information */
		Validation.isBlank((String)map.get("loaner_name"), "សូមធ្វើការបញ្ជូលលេខឈ្មោះរបស់អ្នកខ្ចី");
		Validation.isNumber((String)map.get("id_card"), "សូមធ្វើការបញ្ជូលលេខអត្តសញ្ញាណប័ណ្ណរបស់អ្នកខ្ចី");
		Validation.isNumber((String)map.get("phone"), "សូមធ្វើការបញ្ជូលលេខទូរស័ព្ទរបស់អ្នកខ្ចី");
		Validation.isBlank((String)map.get("address_id"), "សូមធ្វើការបញ្ជូលលេខអាស័យដ្ឋានរបស់អ្នកខ្ចី");
		//Validation.isEnum(Gender.class, Gender.fromValue((String)map.get("gender")).name(), "សូមធ្វើការជ្រើសរើសភេទរបស់អ្នកខ្ចីប្រាក់!");
		if (!Gender.contains((String)map.get("gender"))){
			throw new KHException("9999", "សូមធ្វើការជ្រើសរើសភេទរបស់អ្នកខ្ចីប្រាក់!");
		}
		/*Loan information */
		Validation.isNumber((String)map.get("total_money"), "សូមធ្វើការបញ្ជូលចំនួនទឹកលុយដែលត្រូវខ្ចី");
		Validation.isNumber((String)map.get("decrement"), "សូមធ្វើការបញ្ជូលចំនួនទឹកលុយដែលត្រូវបង់ថយមួយលើក");
		Validation.isNumber((String)map.get("time"), "សូមធ្វើការបញ្ជូលចំនួនដងដែលត្រូវបង់ប្រាក់");		
		Validation.isRate((String)map.get("rate"), "សូមធ្វើការបញ្ជូលអត្រាការប្រាក់នៃចំនួនទឹកប្រាក់ដែលខ្ចី");
		
		User user     = new User();
		Loaner loaner = new Loaner();
		Loan loan     = new Loan();
		/*Wallet wallet = new Wallet();*/
		
		try {
			/*set loan information */
			Long total_money= Long.valueOf((String)map.get("total_money"));
			int  decrement  = Integer.valueOf((String)map.get("decrement"));
			Double rate     = Double.valueOf((String)map.get("rate"));
			int time        = Integer.valueOf((String)map.get("time"));
			int  day        = Integer.valueOf((String)map.get("day"));
			Double prak_derm  = (double) (total_money / time);
			
			/*check user login information */
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				user = (User) auth.getPrincipal();
				
			}else {
				throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
			}
			
			/*insert loaner information */
			loaner.setUser_id(Integer.valueOf((String) map.get("agent")));
			loaner.setLoaner_name((String)map.get("loaner_name"));
			loaner.setGender((String)map.get("gender"));
			loaner.setPhone((String)map.get("phone"));
			loaner.setId_card((String)map.get("id_card"));
			loaner.setAddress_id(Integer.valueOf((String)map.get("address_id")));
			loaner.setSts(LoanSts.ACTIVE.getValue());
			loaner.setTxt(LoanTxt.ACTIVE.getValue());
			loaner.setModify_by(user.getUser_id());
			loaner.setAction("insert Loaner");
			loaner.setModify_date(Common.getCurrentDate());				
			
			if (loanerMapper.insertLoanerItem(loaner) <= 0){
				throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
			}
			/*insert loan information */
			loan.setLoaner_id(loaner.getLoaner_id());
			loan.setTotal_money(total_money);
			loan.setUser_id(Integer.valueOf((String) map.get("agent")));
			loan.setStart_date((String)map.get("start_date"));
			loan.setCount_date(day);
			loan.setRate(rate);
			loan.setType_payment((String)map.get("type_payment"));
			loan.setType_money("1");
			loan.setTime(time);
			loan.setDecrement(decrement);
			loan.setSts(LoanSts.ACTIVE.getValue());
			loan.setTxt(LoanTxt.ACTIVE.getValue());
			loan.setModify_by(user.getUser_id());
			loan.setModify_date(Common.getCurrentDate());
			loan.setAction("inser Loan");					
			
			if (loanMapper.insertLoanItem(loan) <= 0){
				throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
			}		
			
			/*insert wallet information */			
			/*wallet = walletMapper.loadingMywalletByIMaxId();
			 if (wallet.getTotal_amount() < loan.getTotal_money()){
		    	throw new KHException("9999", "មិនអាចធ្វើការខ្ចីបានទេ ព្រោះចំនួនទឹកប្រាក់ច្រើនហួសកំនត់ សូមទំនាក់ទំនងទៅកាន់ថ្នាក់លើរបស់អ្នក!");
		    }*/	
			 
			/*wallet.setOld_amount(wallet.getTotal_amount());
			wallet.setAmount(loan.getTotal_money());
			wallet.setTotal_amount(wallet.getTotal_amount() - loan.getTotal_money());
			wallet.setType_amount("9");
			wallet.setRequest_by(Integer.valueOf((String) map.get("agent")));
			wallet.setRequest_date(Common.getCurrentDate());
			wallet.setRequest_id(loan.getLoan_id());
			wallet.setApprove_by(user.getUser_id());
			wallet.setApprove_date(Common.getCurrentDate());
		    wallet.setDecription( " ស្នើសុំដោយអ្នកប្រើប្រាស់ឈ្មោះ  "+ (String)map.get("agentName")
		    					 +" សំរាប់ការកំម្ចីលេខកូដ  "+Common.padLeft(String.valueOf(loan.getLoan_id()), 9)
		    					 +" ខ្ចីដោយឈ្មោះ "+loaner.getLoaner_name());
		    
		    if (walletMapper.insertMywallet(wallet) <= 0){
		    	throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
		    }*/
		  
		    /*insert loan payment information */
			Date dt = formatter.parse((String)map.get("start_date"));			
			int d = 0;
			for(int i=1; i<= Integer.valueOf((String)map.get("time")) ; i++) {
				LoanPayment loanPayment = new LoanPayment();
				dt = DateUtils.addDays(dt, day);
				
				Double total_rate = 0.0;
				if (decrement == 0) {
					total_rate = (Double) ((prak_derm * rate) / 100); 
				}else {
					total_rate = (Double) ((total_money * rate) / 100) - d; 
				}

				Double total_left = total_money - (prak_derm * i) ;				
				
				loanPayment.setLoan_id(loan.getLoan_id());
				loanPayment.setPayment_date(formatter.format(dt).toString());
				loanPayment.setPrak_derm(prak_derm);
				loanPayment.setTotal_rate(total_rate);
				loanPayment.setTotal_left(total_left);
				loanPayment.setTxt(LoanTxt.ACTIVE.getValue());
				loanPayment.setModify_by(user.getUser_id());
				loanPayment.setModify_date(Common.getCurrentDate());
				loanPayment.setAction("Insert Loaner payment");
				if (loanMapper.insertLoanPayment(loanPayment) <= 0){
					throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
				}
				
				d += decrement;
			}

			return new Message("0000","ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលជោគជ័យ");
		}catch(Exception e) {
			throw new KHException("9999",e.getMessage());
		}
	}
	public Message loadingLoanerListInformation(HashMap<String, String> params) throws KHException {
		HashMap<String, Object> result = new HashMap<>();
		try {
			
			PaginationUtils.perPage = Integer.valueOf(params.get("perPage"));
			PaginationUtils.currentPage = Integer.valueOf(params.get("currentPage"));
			PaginationUtils.total = (long) loanerMapper.loadingTotalCountRows(params);
			params.put("search", (String)params.get("search").trim());
			params.put("start",  String.valueOf(PaginationUtils.getStart()));
			params.put("perPage", String.valueOf(PaginationUtils.perPage));	
			result.put("loanerList", loanerMapper.loadingLoanerListInformation(params));
			result.put("loadingTotalCountRows", PaginationUtils.total);
			result.put("totalPage", PaginationUtils.totalPage());			
			return new Message("0000",result);
			
		}catch(Exception e) {
			e.printStackTrace();
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message loadingLoanAgain(int loaner_id) throws KHException {
		HashMap<String, Object> result = new HashMap<>();
		HashMap<String, String> params = new HashMap<>();
		User user = new User();
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				user = (User) auth.getPrincipal();
				
			}
			int maxLoanId = loanMapper.loanGetMaxId() + 1;
			String maxLoanPad =  StringUtils.leftPad(String.valueOf(maxLoanId), 9, "0");
			result.put("maxLoanId", maxLoanPad);
			params.put("loaner_id", String.valueOf(loaner_id));
			params.put("txt", "9");
			result.put("loanerObject", loanerMapper.loadingLoanerById(params));
			return new Message("0000", result);
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	@Transactional(value="transactionManager",rollbackFor={KHException.class,Exception.class})
	public Message loanSaveLoanAgain(HashMap<String, String> params) throws KHException {

		/*loan information*/
		Validation.isNumber((String)params.get("total_money"), "សូមធ្វើការបញ្ជូលចំនួនទឹកលុយដែលត្រូវខ្ចី");
		Validation.isNumber((String)params.get("decrement"), "សូមធ្វើការបញ្ជូលចំនួនទឹកលុយដែលត្រូវបង់ថយមួយលើក");
		Validation.isNumber((String)params.get("time"), "សូមធ្វើការបញ្ជូលចំនួនដងដែលត្រូវបង់ប្រាក់");		
		Validation.isRate((String)params.get("rate"), "សូមធ្វើការបញ្ជូលអត្រាការប្រាក់នៃចំនួនទឹកប្រាក់ដែលខ្ចី");
		HashMap<String, String> param = new HashMap<>();
		User user     = new User();
		Loaner loaner = new Loaner();
		Loan loan     = new Loan();
		/*Wallet wallet = new Wallet();*/
		try {
			
			Long total_money= Long.valueOf((String)params.get("total_money"));
			int  decrement  = Integer.valueOf((String)params.get("decrement"));
			Double rate     = Double.valueOf((String)params.get("rate"));
			int time        = Integer.valueOf((String)params.get("time"));
			int  day        = Integer.valueOf((String)params.get("day"));
			Double prak_derm  = (double) (total_money / time);
			
			
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				user = (User) auth.getPrincipal();
				
			}else {
				throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
			}
			
			int loaner_id = Integer.valueOf((String)params.get("loaner_id"));
			param.put("loaner_id", String.valueOf(loaner_id));
			param.put("txt", "9");
			loaner = (Loaner)loanerMapper.loadingLoanerInformationById(param);
			System.out.println(loaner.toString());
			loaner.setTxt("1");
			loaner.setAction("Update Loaner Information (txt)");
			if (loanerMapper.loanerUpdateById(loaner) <= 0 ){
				throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
			}
			
			loan.setLoaner_id(loaner_id);
			loan.setTotal_money(total_money);
			loan.setUser_id(Integer.valueOf((String) params.get("agent")));
			loan.setStart_date((String)params.get("start_date"));
			loan.setCount_date(day);
			loan.setRate(rate);
			loan.setType_payment((String)params.get("type_payment"));
			loan.setType_money("1");
			loan.setTime(time);
			loan.setDecrement(decrement);
			loan.setSts(LoanSts.ACTIVE.getValue());
			loan.setTxt(LoanTxt.ACTIVE.getValue());
			loan.setModify_by(user.getUser_id());
			loan.setModify_date(Common.getCurrentDate());
			loan.setAction("inser Loan");
					
			
			if (loanMapper.insertLoanItem(loan) <= 0 ) {
				throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
			}
			
			/*insert wallet information */			
			/*wallet = walletMapper.loadingMywalletByIMaxId();
			 if (wallet.getTotal_amount() < loan.getTotal_money()){
		    	throw new KHException("9999", "មិនអាចធ្វើការខ្ចីបានទេ ព្រោះចំនួនទឹកប្រាក់ច្រើនហួសកំនត់ សូមទំនាក់ទំនងទៅកាន់ថ្នាក់លើរបស់អ្នក!");
		    }	*/
			 
			/*wallet.setOld_amount(wallet.getTotal_amount());
			wallet.setAmount(loan.getTotal_money());
			wallet.setTotal_amount(wallet.getTotal_amount() - loan.getTotal_money());
			wallet.setType_amount("9");
			wallet.setRequest_by(Integer.valueOf((String) params.get("agent")));
			wallet.setRequest_date(Common.getCurrentDate());
			wallet.setRequest_id(loan.getLoan_id());
			wallet.setApprove_by(user.getUser_id());
			wallet.setApprove_date(Common.getCurrentDate());
		    wallet.setDecription( " ស្នើសុំខ្ចីម្ដងទៀតដោយអ្នកប្រើប្រាស់ឈ្មោះ  "+ (String)params.get("agentName")
		    					 +" សំរាប់ការកំម្ចីលេខកូដ  "+Common.padLeft(String.valueOf(loan.getLoan_id()), 9)
		    					 +" ខ្ចីដោយឈ្មោះ "+loaner.getLoaner_name());
		    
		    if (walletMapper.insertMywallet(wallet) <= 0){
		    	throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
		    }*/
			
			Date dt = formatter.parse((String)params.get("start_date"));
			
			int d = 0;
			for(int i=1; i<= Integer.valueOf((String)params.get("time")) ; i++) {
				LoanPayment loanPayment = new LoanPayment();
				dt = DateUtils.addDays(dt, day);
				
				Double total_rate = 0.0;
				if (decrement == 0) {
					total_rate = (Double) ((prak_derm * rate) / 100); 
				}else {
					total_rate = (Double) ((total_money * rate) / 100) - d; 
				}

				Double total_left = total_money - (prak_derm * i) ;
				
				
				loanPayment.setLoan_id(loan.getLoan_id());
				loanPayment.setPayment_date(formatter.format(dt).toString());
				loanPayment.setPrak_derm(prak_derm);
				loanPayment.setTotal_rate(total_rate);
				loanPayment.setTotal_left(total_left);
				loanPayment.setTxt(LoanTxt.ACTIVE.getValue());
				loanPayment.setModify_by(user.getUser_id());
				loanPayment.setModify_date(Common.getCurrentDate());
				loanPayment.setAction("Insert Loaner payment");
				if (loanMapper.insertLoanPayment(loanPayment) <= 0 ){
					throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
				}
				
				d += decrement;
			}

			return new Message("0000","ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលជោគជ័យ");
		}catch(Exception e) {
			throw new KHException("9999",e.getMessage());
		}
	}
	
	
	public Message loadingLoanview(int loaner_id,String id) throws KHException {
		HashMap<String, Object> result = new HashMap<>();
		HashMap<String, String> params = new HashMap<>();
		try {
			
			System.out.println(" loaner id =="+ loaner_id);
			params.put("loaner_id", String.valueOf(loaner_id));
			HashMap<String, String> res = loanMapper.loadingLoanView(params);			
			result.put("loanObject", res);
			if (id.equals("loaner")) {
					result.put("loanList", loanMapper.loadingLoanById(params));
			}	
			// this param use for only loadingLoanPayment can not input below
			params.put("loan_id", String.valueOf(res.get("loan_id")));			
			//result.put("listtypePayment", loanMapper.loadingTypePayment());					
			result.put("loanPaymentList", loanMapper.loadingLoanPayment(params));
			return new Message("0000", result);
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	public Message loanShowBytime(int loan_id) throws KHException {
		HashMap<String, Object> result = new HashMap<>();
		HashMap<String, String> params = new HashMap<>();
		try {
			params.put("loan_id", String.valueOf(loan_id));	
			result.put("listtypePayment", loanMapper.loadingTypePayment());
			result.put("loanerObject", loanMapper.loadingLoanById(params));					
			result.put("loanPaymentList", loanMapper.loadingLoanPayment(params));
			return new Message("0000", result);
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message loadingLoanListView(HashMap<String, String> params) throws KHException {
		HashMap<String, Object> result = new HashMap<>();
		try {
			
			PaginationUtils.perPage = Integer.valueOf(params.get("perPage"));
			PaginationUtils.currentPage = Integer.valueOf(params.get("currentPage"));			
			params.put("search", (String)params.get("search").trim());
			params.put("start",  String.valueOf(PaginationUtils.getStart()));
			params.put("perPage", String.valueOf(PaginationUtils.perPage));	
			params.put("startDate", (String)params.get("startDate").trim());
			params.put("endDate",  String.valueOf(params.get("endDate").trim()));
			params.put("typePayment", String.valueOf(params.get("typePayment")));
			System.out.println(" searcher "+ String.valueOf(params.get("decrementTxt")));
			PaginationUtils.total = Long.valueOf(loanMapper.loadingLoanListViewCount(params));
			result.put("total_row", PaginationUtils.total);
			result.put("loanList", loanMapper.loadingLoanListView(params));
			result.put("typePaymentList", loanMapper.loadingTypePayment());
			result.put("typePayment", String.valueOf(params.get("typePayment")));
			return new Message("0000",result);
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message loadingLoanEdit(HashMap<String, String> params) throws KHException {
		HashMap<String, Object> result = new HashMap<>();
		HashMap<String, String> param = new HashMap<>();
		try {
			//param.put("loaner_id", String.valueOf(params.get("loaner_id")));
			//result.put("loanerObject", loanerMapper.loadingLoanerInformationById(params));
			HashMap<String, String> obj = loanMapper.loadingLoanViewEdit(params);			
			param.put("disProId", String.valueOf(obj.get("pro_id")));
			param.put("comDisId", String.valueOf(obj.get("dis_id")));
			param.put("vilComId", String.valueOf(obj.get("com_id")));
			result.put("listProvinces", addressMapper.loadingAllProvinces());
			result.put("listDistricts", addressMapper.loadingDistrictsByProvinceId(param));
			result.put("listCommunes",  addressMapper.loadingCommunesByDistrictsId(param));
			result.put("listVillages",  addressMapper.loadingVillagesByCommunesId(param));
			result.put("loanObject",    obj);
			result.put("loanPaymentList", loanMapper.loadingLoanPayment(params));
			return new Message("0000", result);
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	@Transactional(value="transactionManager",rollbackFor={KHException.class,Exception.class})
	public Message loanSaveUdateItem(HashMap<String, String> params) throws KHException {
		HashMap<String, String> param = new HashMap<>();
		/*Loaner information */
		Validation.isBlank((String)params.get("loaner_name"), "សូមធ្វើការបញ្ជូលលេខឈ្មោះរបស់អ្នកខ្ចី");
		Validation.isNumber((String)params.get("id_card"), "សូមធ្វើការបញ្ជូលលេខអត្តសញ្ញាណប័ណ្ណរបស់អ្នកខ្ចី");
		Validation.isNumber((String)params.get("phone"), "សូមធ្វើការបញ្ជូលលេខទូរស័ព្ទរបស់អ្នកខ្ចី");
		Validation.isBlank((String)params.get("address_id"), "សូមធ្វើការបញ្ជូលលេខអាស័យដ្ឋានរបស់អ្នកខ្ចី");
		if (!Gender.contains((String)params.get("gender"))){
			throw new KHException("9999", "សូមធ្វើការជ្រើសរើសភេទរបស់អ្នកខ្ចីប្រាក់!");
		}
		
		Validation.isNumber((String)params.get("total_money"), "សូមធ្វើការបញ្ជូលចំនួនទឹកលុយដែលត្រូវខ្ចី");
		Validation.isNumber((String)params.get("decrement"), "សូមធ្វើការបញ្ជូលចំនួនទឹកលុយដែលត្រូវបង់ថយមួយលើក");
		Validation.isNumber((String)params.get("time"), "សូមធ្វើការបញ្ជូលចំនួនដងដែលត្រូវបង់ប្រាក់");		
		Validation.isRate((String)params.get("rate"), "សូមធ្វើការបញ្ជូលអត្រាការប្រាក់នៃចំនួនទឹកប្រាក់ដែលខ្ចី");
		User user     = new User();
		Loaner loaner = new Loaner();
		Loan loan     = new Loan();
		/*Wallet wallet = new Wallet();*/
		try {
			Long total_money= Long.valueOf((String)params.get("total_money"));
			int  decrement  = Integer.valueOf((String)params.get("decrement"));
			Double rate     = Double.valueOf((String)params.get("rate"));
			int time        = Integer.valueOf((String)params.get("time"));
			int  day        = Integer.valueOf((String)params.get("day"));
			Double prak_derm  = (double) (total_money / time);
			Long b_tt         = 0L;
			Long a_tt         = 0L;
			
			
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				user = (User) auth.getPrincipal();
				
			}else {
				throw new KHException("9999", "ការកែប្រែរបស់លោកអ្នកទទួលបរាជ័យ");
			}
			
			int loaner_id = Integer.valueOf((String)params.get("loaner_id"));
			param.put("loaner_id", String.valueOf(loaner_id));
			loaner = (Loaner)loanerMapper.loadingLoanerInformationById(param);		
			
			loaner.setLoaner_name((String)params.get("loaner_name"));
			loaner.setGender((String)params.get("gender"));
			loaner.setPhone((String)params.get("phone"));
			loaner.setId_card((String)params.get("id_card"));
			loaner.setAddress_id(Integer.valueOf((String)params.get("address_id")));
			loaner.setModify_by(user.getUser_id());
			loaner.setModify_date(Common.getCurrentDate());
			loaner.setAction("Update Loaner Information (txt)");
			if (loanerMapper.loanerUpdateById(loaner) <= 0 ) {
				throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
			}
			
			int loan_id = Integer.valueOf(params.get("loan_id"));
			loan        = loanMapper.loadingLoanViewCheck(loan_id);
			b_tt        = loan.getTotal_money();
			loan.setLoaner_id(loaner.getLoaner_id());
			loan.setTotal_money(total_money);
			loan.setUser_id(user.getUser_id());
			loan.setStart_date((String)params.get("start_date"));
			loan.setCount_date(day);
			loan.setRate(rate);
			loan.setType_payment((String)params.get("type_payment"));
			loan.setTime(time);
			loan.setDecrement(decrement);
			loan.setModify_by(user.getUser_id());
			loan.setModify_date(Common.getCurrentDate());
			loan.setAction("update Loan");
			
			if (loanMapper.updateLoanById(loan) <= 0 ){
				throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
			}
		
			/*insert wallet information */			
			/*wallet = walletMapper.loadingMywalletByIMaxId();
		    String typeAmount = "";
		    Long    addAmount = 0L;
			if (b_tt < total_money){
				a_tt = wallet.getTotal_amount() - (total_money - b_tt);
				addAmount = total_money - b_tt;
				typeAmount = "9";
			}else{
				a_tt = wallet.getTotal_amount() + (b_tt - total_money);
				addAmount = b_tt - total_money;
				typeAmount = "1";
			}
			 if (a_tt < 0){
		    	throw new KHException("9999", "មិនអាចធ្វើការខ្ចីបានទេ ព្រោះចំនួនទឹកប្រាក់ច្រើនហួសកំនត់ សូមទំនាក់ទំនងទៅកាន់ថ្នាក់លើរបស់អ្នក!");
		    }	

			wallet.setOld_amount(wallet.getTotal_amount());
			wallet.setAmount(addAmount);
			wallet.setTotal_amount(a_tt);
			wallet.setType_amount(typeAmount);
			wallet.setRequest_by(Integer.valueOf((String) params.get("agent")));
			wallet.setRequest_date(Common.getCurrentDate());
			wallet.setRequest_id(loan.getLoan_id());
			wallet.setApprove_by(user.getUser_id());
			wallet.setApprove_date(Common.getCurrentDate());
		    wallet.setDecription( " ស្នើសុំកែប្រែដោយអ្នកប្រើប្រាស់ឈ្មោះ  "+ user.getFull_name()
		    					 +" សំរាប់ការកំម្ចីលេខកូដ  "+Common.padLeft(String.valueOf(loan.getLoan_id()), 9)
		    					 +" ខ្ចីដោយឈ្មោះ "+loaner.getLoaner_name());
		    
		    if (walletMapper.insertMywallet(wallet) <= 0){
		    	throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
		    }*/
			
            Date dt = formatter.parse((String)params.get("start_date"));			
            
           loanMapper.deleteLoanPaymentByLoanId(loan_id);
           
			int d = 0;
			for(int i=1; i<= Integer.valueOf((String)params.get("time")) ; i++) {
				LoanPayment loanPayment = new LoanPayment();
				dt = DateUtils.addDays(dt, day);
				
				Double total_rate = 0.0;
				if (decrement == 0) {
					total_rate = (Double) ((prak_derm * rate) / 100); 
				}else {
					total_rate = (Double) ((total_money * rate) / 100) -  d; 
				}

				Double total_left = total_money - (prak_derm * i) ;
								
				loanPayment.setLoan_id(loan.getLoan_id());
				loanPayment.setPayment_date(formatter.format(dt).toString());
				loanPayment.setPrak_derm(prak_derm);
				loanPayment.setTotal_rate(total_rate);
				loanPayment.setTotal_left(total_left);
				loanPayment.setTxt("1");
				loanPayment.setModify_by(user.getUser_id());
				loanPayment.setModify_date(Common.getCurrentDate());
				loanPayment.setAction("Insert Loaner payment");
				if (loanMapper.insertLoanPayment(loanPayment) <= 0 ){
					throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
				}
				
				d += decrement;
			}
			
			return new Message("0000", "ការកែប្រែរបស់លោកអ្នកទទួលបានជោគជ័យ");
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message missingPaymentList(HashMap<String, String> params) throws KHException {
		try {
			return new Message("0000",loanMapper.missingPaymentList(params));
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	@Transactional(value="transactionManager",rollbackFor={KHException.class,Exception.class})
	@SuppressWarnings("unchecked")
	public Message loanPaymentSaveUpdate(HashMap<String,Object> params) throws KHException {
		try {
			User    user  = new User();
			Loaner loaner = new Loaner();
			Loan   loan   = new Loan();
			/*Wallet wallet = new Wallet();*/
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				user = (User) auth.getPrincipal();
				
			}else {
				throw new KHException("9999", "ការកែប្រែរបស់លោកអ្នកទទួលបរាជ័យ");			}

			
			List<HashMap<String, String>> payMent = (List)params.get("loanPayment");
			
			for (int i=0;i<payMent.size();i++) {
				HashMap<String, String> param = new HashMap<>();
				param = payMent.get(i);
				param.put("payment_id", (String)param.get("payment_id"));
				param.put("modify_by", String.valueOf(user.getUser_id()));
				param.put("modify_date", Common.getCurrentDate());
				param.put("note", (String)param.get("note"));
				param.put("txt", LoanTxt.DELETED.getValue());
				param.put("action", "update Information");
				loanMapper.loanPaymentSaveUpdate(param);
			}
			
			
			
			String payMentAll = (String)params.get("paymentAll");
			System.out.println( " Pay All "+ payMentAll);
			if (payMentAll.equals("true")) {
				HashMap<String, String> param = new HashMap<>();
				param.put("loaner_id", (String)params.get("loaner_id"));
				param.put("loan_id", (String)params.get("loan_id"));
				param.put("modify_by", String.valueOf(user.getUser_id()));
				param.put("modify_date", Common.getCurrentDate());
				param.put("note", "");
				param.put("txt", "2");
				param.put("action", "update Information");
				loanMapper.loanPaymentSaveUpdateAll(param);
			}
			
			HashMap<String, String> param = new HashMap<>();
			param.put("loaner_id", (String)params.get("loaner_id"));
			param.put("loan_id", (String)params.get("loan_id"));
			loaner = (Loaner)loanerMapper.loadingLoanerInformationById(param);
			loan   = (Loan)loanMapper.loadingLoanViewCheck(Integer.valueOf(param.get("loan_id")));
			if (loanMapper.loanPaymentCountNotPay(param) <= 0) {							

				loaner.setTxt("9");
				loaner.setModify_by(user.getUser_id());
				loaner.setModify_date(Common.getCurrentDate());
				loaner.setAction("update Loan");
				System.out.println( " loaner  id"+ loaner.getLoaner_id());
				loanerMapper.loanerUpdateById(loaner);				

				loan.setTxt("9");
				loan.setModify_by(user.getUser_id());
				loan.setModify_date(Common.getCurrentDate());
				loan.setAction("update Loan");
				System.out.println( " loan  id"+ loan.getLoan_id());
				loanMapper.updateLoanById(loan);
			}
			
			//Long totalAmount = Long.valueOf((String)params.get("totalAmount"));
			/*wallet = walletMapper.loadingMywalletByIMaxId();			 
			wallet.setOld_amount(wallet.getTotal_amount());
			wallet.setAmount(totalAmount);
			wallet.setTotal_amount(wallet.getTotal_amount() + totalAmount);
			wallet.setType_amount("1");
			wallet.setRequest_by(user.getUser_id());
			wallet.setRequest_date(Common.getCurrentDate());
			wallet.setRequest_id(loan.getLoan_id());
			wallet.setApprove_by(user.getUser_id());
			wallet.setApprove_date(Common.getCurrentDate());
		    wallet.setDecription( " ស្នើសុំដោយអ្នកប្រើប្រាស់ឈ្មោះ  "+ user.getFull_name()
		    					 +" សំរាប់ការកំម្ចីលេខកូដ  "+Common.padLeft(String.valueOf(loan.getLoan_id()), 9)
		    					 +" ខ្ចីដោយឈ្មោះ "+loaner.getLoaner_name());
			
		    if (walletMapper.insertMywallet(wallet) <= 0){
		    	throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
		    }*/
			
			return new Message("0000","ការកែប្រែរបស់លោកអ្នកទទួលបានជោគជ័យ");
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	public Message loanPaymentCountPay(int loan_id) throws KHException {
		try {
			HashMap<String, String> result = new HashMap<>();
			result.put("count", String.valueOf(loanMapper.loanPaymentCountPay(loan_id)));
			return new Message("0000",result);
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
	@Transactional(value="transactionManager",rollbackFor= {KHException.class,Exception.class})
	public Message loadingDeleteLoan(int loan_id,int loaner_id) throws KHException {
		try {
			HashMap<String, String> params = new HashMap<>();
			User   user   = new User();
			Loaner loaner = new Loaner();
			Loan   loan   = new Loan();
			/*Wallet wallet = new Wallet();*/
			
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				user = (User) auth.getPrincipal();
				
			}else {
				throw new KHException("9999", "ការកែប្រែរបស់លោកអ្នកទទួលបរាជ័យ");
			}
			
			params.put("loaner_id", String.valueOf(loaner_id));
			if (loanMapper.loanPaymentCountPay(loan_id) > 0) {
				return new Message("0000","មិនអ្នកមិនអាចលុបបានទេ ពីព្រោះអ្នកខ្ចីកំពុងធ្វើការសង់ប្រាក់!");
			}
			if (loanMapper.loadingLoanCountByLoanerId(loaner_id) == 1) {
				loaner = loanerMapper.loadingLoanerInformationById(params);
				loaner.setSts(LoanSts.DELETED.getValue());
				loanerMapper.loanerUpdateById(loaner);
			}

			loan = loanMapper.loadingLoanViewCheck(loan_id);
			loan.setSts(LoanSts.DELETED.getValue());
			loanMapper.updateLoanById(loan);
			loanMapper.deleteLoanPaymentByLoanId(loan_id);
			
			/*insert wallet information */			
			/*wallet = walletMapper.loadingMywalletByIMaxId();			 
			wallet.setOld_amount(wallet.getTotal_amount());
			wallet.setAmount(loan.getTotal_money());
			wallet.setTotal_amount(wallet.getTotal_amount() + loan.getTotal_money());
			wallet.setType_amount("1");
			wallet.setRequest_by(user.getUser_id());
			wallet.setRequest_date(Common.getCurrentDate());
			wallet.setRequest_id(loan.getLoan_id());
			wallet.setApprove_by(user.getUser_id());
			wallet.setApprove_date(Common.getCurrentDate());
		    wallet.setDecription( " ស្នើសុំលុបដោយអ្នកប្រើប្រាស់ឈ្មោះ  "+ user.getFull_name()
		    					 +" សំរាប់ការកំម្ចីលេខកូដ  "+Common.padLeft(String.valueOf(loan.getLoan_id()), 9)
		    					 +" ខ្ចីដោយឈ្មោះ "+loaner.getLoaner_name());
			
		    if (walletMapper.insertMywallet(wallet) <= 0){
		    	throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
		    }*/
		    
			return new Message("0000","ការលុបរបស់លោកអ្នកទទួលបានជោគជ័យ!");
		}catch(Exception e) {
			throw new KHException("9999", e.getMessage());
		}
	}
	
}




