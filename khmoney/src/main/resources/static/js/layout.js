/**
 * 
 */
$(document).ready(function(){
	checkUserInformation();
	$('#user_infor').click(function(){
		$('.dropdown-profile').toggle(500);
	});
	$(document).click(function(e){
        if(!$(e.target).closest('.navbar-right>li>a, .dropdown-menu').length){
            $(".dropdown-profile").hide();
        }
    });
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('.alert_wrap').bPopup().close();
	});
	$('#change_passowrd').click(function(){
		$('#popup_employee_change_password').bPopup();
	});
	$('#change_profile').click(function(){
		$('#popup_employee_edit').bPopup();
		loadingUserEdit(this);
	});
	$('#btn_edit').click(function(){
		
	});
});

function checkUserInformation(){
	$.ajax({
		url:'checkUserInformation',
		type:'GET',
		success:function(json){
			$('.profile').attr('src','/khmoney/img/images/'+json.object.photo)
			$('#full_name').text(json.object.full_name);
			$('#change_password').attr('data-id',json.object.user_id);
		},error:function(json){
			
		}
	});
}
function loadingUserEdit(obj){
	 $('#popup_employee_edit').bPopup();
	 $.ajax({
		 url:'/khmoney/employeeGetById',
		 type:'GET',
		 data:'user_id='+$(obj).attr('data-id'),
		 success:function(json){
			 if (json.code == 'undefined' || json.code == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			 setValueForEdit(json);
		 },error:function(json){
			 console.log(json);
		 }
	 });
}

function setValueForEdit(json){
	$('#emp_edit_name').val(json.object.userEntry.full_name);
	$('#emp_edit_id').val(json.object.userEntry.user_id)
	$('#emp_edit_phone').val(json.object.userEntry.phone) ;
	$('#emp_edit_email').val(json.object.userEntry.email);
	$('#emp_edit_address').val(json.object.userEntry.address) ;
	$('input[name=edit_gender][value='+json.object.userEntry.gender+']').prop('checked',true);
	$('#edit_file').attr({ value: '' }); 
	$('#edit_photo').attr('src','/khmoney/img/images/'+json.object.userEntry.photo);
}

