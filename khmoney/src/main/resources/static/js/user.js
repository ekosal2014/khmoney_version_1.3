/**
 * 
 */
$(document).ready(function(){
	loadingUserList(1);
	$('#btn_addMore').click(function(){
		$('#popup_employee').bPopup();
	});
});
function loadingUserList(page){
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingUserList',
		success:function(json){
			if (json.code == 'undefined' || json.code == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			var userList = json.object.loadingUserList;
			var tbl = '';
			$('#tbl_user tbody').empty();
			$('#tbl_user tfoot').hide();
			$('#tbl_user tbody').show();
			if (userList.length > 0){
				var i = (parseInt(page)-1) * parseInt($('#num_rows').val().replace(/[​\-]/g,''));
				$.each(userList,function(index,value){
					tbl += '<tr>'
						+'<td><div><input type="checkbox"></div></td>'
						+'<td><div>'+(i+1)+'</div></td>'
						+'<td><div>'+value.full_name+'</div></td>'
						+'<td><div>'+(value.gender=='0'?'ប្រុស':'ស្រី')+'</div></td>'
						+'<td><div>'+Common.phoneWithComma(value.phone.replace(/\-/g, ''),"-")+'</div></td>'
						+'<td><div>'+value.email+'</div></td>'
						+'<td><div>'+value.txt+'</div></td>'
						+'<td><div>'+value.address+'</div></td>'
						+'<td><div>'+value.sts+'</div></td>'
						+'<td><div></div></td>'
						+'</tr>';
				});
				$('#tbl_user tbody').append(tbl);
				
			}else{
				$('#tbl_user tbody').hide();
				$('#tbl_user tfoot').show();
			}
			 var option = {
        			total       : json.object.loadingCountUserList,
    				maxVisible  : 10,
    				perPage     : $('#num_rows').val(),
    				currentPage : page,
    				numPage     : 1,
    				wrapClass   :'paging',
    				eventLink   :'goPageList'
        	 }
		     pagination.showPage(option);
		     $('#loading').bPopup().close();
		},error:function(json){
			console.log(json);
		}
		
	});
}