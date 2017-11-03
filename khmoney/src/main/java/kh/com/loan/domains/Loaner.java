package kh.com.loan.domains;

public class Loaner {
	private int loaner_id;
	private int user_id;
	private String loaner_name;
	private String id_card;
	private String gender;
	private String phone;
	private String sts;
	private String txt;
	private int address_id;
	private String modify_date;
	private int modify_by;
	private String action;
	
	
	public Loaner() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Loaner(int loaner_id, int user_id,String loaner_name, String id_card, String gender,
			String phone, String sts, String txt, String modify_date, int modify_by, String action) {
		super();
		this.loaner_id = loaner_id;
		this.user_id = user_id;
		this.loaner_name = loaner_name;
		this.id_card = id_card;
		this.gender = gender;
		this.phone = phone;
		this.sts = sts;
		this.txt = txt;
		this.modify_date = modify_date;
		this.modify_by = modify_by;
		this.action = action;
	}
	public int getLoaner_id() {
		return loaner_id;
	}
	public void setLoaner_id(int loaner_id) {
		this.loaner_id = loaner_id;
	}
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	public String getLoaner_name() {
		return loaner_name;
	}
	public void setLoaner_name(String loaner_name) {
		this.loaner_name = loaner_name;
	}
	public String getId_card() {
		return id_card;
	}
	public void setId_card(String id_card) {
		this.id_card = id_card;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getSts() {
		return sts;
	}
	public void setSts(String sts) {
		this.sts = sts;
	}
	public String getTxt() {
		return txt;
	}
	public void setTxt(String txt) {
		this.txt = txt;
	}
	
	

	public int getAddress_id() {
		return address_id;
	}
	public void setAddress_id(int address_id) {
		this.address_id = address_id;
	}
	public String getModify_date() {
		return modify_date;
	}
	public void setModify_date(String modify_date) {
		this.modify_date = modify_date;
	}
	public int getModify_by() {
		return modify_by;
	}
	public void setModify_by(int modify_by) {
		this.modify_by = modify_by;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	

}
