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
	
	$('#file').change(function(event){
		console.log('23412');
		var tmppath = URL.createObjectURL(event.target.files[0]);
	    $("#photo").fadeIn("fast").attr('src',tmppath);    
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
	data.append('phone'             ,$('#emp_phone').val());
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
         },error:function(json){
        	 console.log(json); 
         }
	});
	$('#loading').bPopup().close();
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
    return pattern.test(emailAddress);
};