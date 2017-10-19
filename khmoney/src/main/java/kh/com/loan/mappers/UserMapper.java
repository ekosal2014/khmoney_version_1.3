package kh.com.loan.mappers;


import java.util.List;

import org.apache.ibatis.annotations.Param;

import kh.com.loan.domains.User;


public interface UserMapper {
	/*
	 * check user name
	 * */
	public User loadUserByUsername(@Param("username") String username);
	public List<User> loadingAllUser();

}
