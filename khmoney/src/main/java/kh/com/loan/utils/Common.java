package kh.com.loan.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;

public class Common {
	private static String dtst = "yyyyMMdd";
	public static String padLeft(String str, String symbol,int number) {
		if (symbol == null) {
			symbol = "0";
		}
		if (str != null){
			return String.format("%"+number+"s", str).replace(" ", symbol);
		}
		return null;
	}
	public static String padLeft(String str,int number) {
		return padLeft(str, null, number);
	}
	public static String getCurrentDate(){
		SimpleDateFormat df = new SimpleDateFormat(dtst);
		Date dt = new Date();
		return df.format(dt).toString();
	}

}
