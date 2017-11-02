package kh.com.loan.mappers;

import java.util.HashMap;
import java.util.List;

public interface AddressMapper {
	public List<HashMap<String,String>> loadingAllProvinces(HashMap<String,String> params);
	public List<HashMap<String,String>> loadingDistrictsByProvinceId(HashMap<String,String> params);
	public List<HashMap<String,String>> loadingCommunesByDistrictsId(HashMap<String,String> params);
	public List<HashMap<String,String>> loadingVillagesByCommunesId(HashMap<String,String> params);
}
