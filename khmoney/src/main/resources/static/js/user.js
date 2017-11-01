/**
 * 
 */
$(document).ready(function(){
	loadingUserList(1);
	$('#btn_addMore').click(function(){
		$('#popup_employee').bPopup();
	});
	$('#btn_save').click(function(e){		
		employeeAddNew(e);
	});
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('.alert_wrap').bPopup().close();
	});
	
	$('#file').change(function(event){
		var tmppath = URL.createObjectURL(event.target.files[0]);
	    $("#photo").fadeIn("fast").attr('src',tmppath);    
	});
	$('#emp_phone').keyup(function(){
		$('#emp_phone').val(Common.phoneWithComma($('#emp_phone').val().replace(/\-/g, ''),"-"));
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
						+'<td><div>'+value.address+'</div></td>'
						+'<td><div>'+value.sts+'</div></td>'
						+'<td><div>' 					
						+'         <a href="javascript:" data-id="'+value.user_id+'" onClick="deleteUserInformation(this);" style="width:30%;margin:0px;">លុប</a>|'
						+'         <a href="javascript:" data-id="'+value.user_id+'" onClick="serPermissionUser(this)" style="width:30%;margin:0px;">សិទ្ធិ</a></div></td>'
						+'</tr>';
					i++;
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

function employeeAddNew(e){
	e.preventDefault();
	if ($('#emp_name').val() == ''){
		Message.infor(null,'សូមបញ្ចូលឈ្មោះបុគ្គលិក!',null);
		return;
	}
	if ($('#emp_phone').val() == ''){
		Message.infor(null,'សូមបញ្ចូលលេខទូរស័ព្ទបុគ្គលិក!',null);
		return;
	}
	if ($('#emp_email').val() == ''){
		Message.infor(null,'សូមបញ្ចូលអ៊ីមែលបុគ្គលិក!',null);
		return;
	}
	if ($('#emp_address').val() == ''){
		Message.infor(null,'សូមបញ្ចូលអាស័យដ្ឋានបុគ្គលិក!',null);
		return;
	}
	if ($('#user_name').val() == ''){
		Message.infor(null,'សូមបញ្ចូលឈ្មោះបុគ្គលិកសំរាប់ប្រើក្នុងប្រព័ន្ធ!',null);
		return;
	}
	if ($('#password').val() == ''){
		Message.infor(null,'សូមបញ្ចូលពាក្យសំងាត់បុគ្គលិក!',null);
		return;	
	}
	
	if ($('#confirm_password').val() == ''){
		Message.infor(null,'សូមបញ្ចូលបញ្ជាក់ពាក្យសំងាត់បុគ្គលិក!',null);
		return;
	}
	if ($('#confirm_password').val() != $('#password').val()){
		Message.infor(null,'សូមបញ្ចូលពាក្យសំងាត់ និងបញ្ជាក់ពាក្យសំងាត់បុគ្គលិក!',null);
		return;
	}

	
	if (!isValidEmailAddress($('#emp_email').val())){
		Message.infor(null,'អ៊ីមែលបុគ្គលិកមិនត្រូវទេ!!',null);
		return ;
	}
	
	var data = new FormData();
	var file = document.getElementById('file');
	if (file.files.length > 0){
		console.log(file.files[0]);
		data.append('file',file.files[0]);
	}else{
		data.append('file',null);
	}
	
	//console.log($('#file').prop('files')[0])
	$('#loading').bPopup();
	data.append('full_name'         ,$('#emp_name').val());
	data.append('gender'            ,$('input[name=gender]:checked').val());
	data.append('phone'             ,$('#emp_phone').val().replace(/\-/g,'').trim());
	data.append('email'             ,$('#emp_email').val());
	data.append('address'           ,$('#emp_address').val());
	data.append('username'          ,$('#user_name').val());
	data.append('password'          ,$('#password').val());
	data.append('confirmPassword'   ,$('#confirm_password').val());
	console.log(data);
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	$.ajax({
		url:window.location.pathname+'Add',
		type:'POST',
		//dataType: 'text',
	    processData: false,
	    contentType: false,
	    data:data,
	    beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
         success:function(json){
        	 if (json.code == 'undefined' || json.code == '9999'){
 				Message.infor(null,json.message,null);
 				return;
 			}
        	 Message.infor(null,json.message,loadingUserList(1));
        	 $('#popup_employee').bPopup().close();
        	 clearTextBox();
         },error:function(json){
        	 console.log(json); 
         }
	});
	$('#loading').bPopup().close();
}

function deleteUserInformation(obj){
	if (!window.confirm("Do you really want to leave?")) { 
		return; 
	}	
	$.ajax({
		url:window.location.pathname+'Delete',
		type:'GET',
	    data:'userId='+$(obj).attr('data-id'),
         success:function(json){
        	 if (json.code == 'undefined' || json.code == '9999'){
 				Message.infor(null,json.message,null);
 				return;
 			}
        	 Message.infor(null,json.message,loadingUserList,1);
         },error:function(json){
        	 console.log(json); 
         }
	});
	$('#loading').bPopup().close();
}

function serPermissionUser(obj){
	console.log($(obj).attr('data-id'));
	$.ajax({
		url:window.location.pathname+'SetPermission',
		type:'GET',
	    data:'userId='+$(obj).attr('data-id'),
         success:function(json){
        	 console.log(json);
        	 if (json.code == 'undefined' || json.code == '9999'){
 				Message.infor(null,json.message,null);
 				return;
 			 }
        	 var tbl = '';
        	 var list= json.object.listPermission;
        	 $('#user_permission table tbody').empty();
        	 if (list.length > 0 ){
        		 $.each(list,function(index,value){
        			 console.log(value.title);
        			 tbl += '<tr>'
							  +'<td  colspan="3"><div class="t_left">'+value.title.replace(/\<br>/g, '')+'</div></td>'
							  +'<td><div class="t_center permission_on" onClick="changePermission(this)" style="height:20px;position:absolute;right: 0px;top: 0px;width: 40px;cursor:pointer;"></div></td>'
							+'</tr>';
        		 });
        		 $('#user_permission table tbody').append(tbl);
        	 }
         },error:function(json){
        	 console.log(json); 
         }
	});
	
	$('#popup_employee_permission').bPopup();
	
}

function changePermission(obj){
	if ($(obj).hasClass('permission_on')){
		$(obj).removeClass('permission_on');
		$(obj).addClass('permission');
	}else{
		$(obj).removeClass('permission');
		$(obj).addClass('permission_on');
	}
}
function clearTextBox(){
	$('#emp_name').val('');
	$('#emp_phone').val('') ;
	$('#emp_email').val('');
	$('#emp_address').val('') ;
	$('#user_name').val('');
	$('#password').val('') ;
	$('#confirm_password').val('');
	$('#male').prop('checked',true);
	$('#file').attr({ value: '' }); 
	$('#photo').attr('src','/khmoney/img/images/employee.png');
}
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
    return pattern.test(emailAddress);
};
