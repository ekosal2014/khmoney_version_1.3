package kh.com.loan.mappers;

import java.util.HashMap;
import java.util.List;

import kh.com.loan.domains.Wallet;

public interface WalletMapper {
	public Wallet loadingMywalletByIMaxId();
	public int insertMywallet(Wallet wallet);
	public List<HashMap<String, String>> loadingListWallet(HashMap<String, String> params);
	public int loadingTotalCountRows();
}
