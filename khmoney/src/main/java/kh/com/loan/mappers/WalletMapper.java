package kh.com.loan.mappers;

import kh.com.loan.domains.Wallet;

public interface WalletMapper {
	public Wallet loadingMywalletByIMaxId();
	public int insertMywallet(Wallet wallet);
}
