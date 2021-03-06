$(document).ready(function(){
	init();	
	$('#id_card').keyup(function(){
		$('#id_card').val(Common.numberWithComma($('#id_card').val().replace(/\-/g, ''),"-"));
	});
	$('#phone').keyup(function(){
		$('#phone').val(Common.phoneWithComma($('#phone').val().replace(/\-/g, ''),"-"));
	});
	
	$('#btn_addMore').click(function(){
		loadingSettingData('0');
	});
	
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('#popup_loan').bPopup().close();
	});
	
	$('#type_payment').change(function(){
		$('#loadingSettingOtherValue').hide();
		loadingSettingValue($('#type_payment').val());
	});
	
	$('input[name="rd_decrement"]').change(function(){
		$('#loadingDecrementTypeValue').hide();
		if($(this).val() == 'decrement'){
			$('#loadingDecrementTypeValue').show();
			loadingSettingData('1');
		}else{
			
			loadingSettingData('0');
		}
		
	});
	
	$('.btn_confirm').click(function(){
		$('#loading').bPopup();
		confrimCheck();
		$('#loading').bPopup().close();
	});
	
	$('#btn_save').click(function(){		
		loanSaveEdittem();
		
	});
	
	$('#list_provinces').change(function(){
		districtsListByProId();
	});
	$('#list_districts').change(function(){
		communesListByDisId();
	});
	$('#list_communes').change(function(){
		villageListByComId();
	});

});

function init(){
	$('#loading').bPopup();
	loanerGetMaxId();
	Common.datePicker('popup_start_date');
	$('#popup_total_money').autoNumeric('init',{ aSign: '​​ ៛',aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999999',vMin: '0'});
	$('#popup_time').autoNumeric('init',{ aSign: '​​ ដង',pSign: 's',aPad: false,vMax: '999',vMin: '0'});
	$('#popup_rate').autoNumeric('init', { aSign: ' %',pSign: 's',aPad: false,vMax: '99',vMin: '00.00',mDec: 2,});
	$('#popup_decrement').autoNumeric('init', { aSign: '​​ ៛',aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999',vMin: '0'});
	$('#loading').bPopup().close();
	
}

function loanerGetMaxId(){
	var data = {
			'loaner_id':$('#loaner_id').val(),
			'loan_id'  :$('#loan_id').val()
	}
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingLoanEdit',
		data:data,
		success:function(json){
			console.log(json);
			if (json.code == 'undefined'){
				alert(json.message);
				return;
			}
			$('#loaner_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loaner_id,9),'-'));
		    $('#loaner_name').val(json.object.loanObject.loaner_name);
		    $('#id_card').val(Common.phoneWithComma(json.object.loanObject.id_card));
		    $('#phone').val(Common.phoneWithComma(json.object.loanObject.phone));
		    $('input[name=gender][value='+json.object.loanObject.gender+']').prop('checked',true);
		    
		    var provinces = json.object.listProvinces;
			var opt       = '<option value="0" selected>ជ្រើសរើសខេត្ដ</option>';
			$('#list_provinces').empty();
			$.each(provinces,function(index,value){
				if (value.pro_id == json.object.loanObject.pro_id){
					opt += '<option value="'+value.pro_id+'" selected="selected">'+value.pro_name+'</option>'
				}else{
					opt += '<option value="'+value.pro_id+'">'+value.pro_name+'</option>'
				}				
			});
			$('#list_provinces').append(opt);
			
			var districts = json.object.listDistricts;
			var opt       = '<option value="0" selected>ជ្រើសរើសស្រុក</option>';
			$('#list_districts').empty();
			$.each(districts,function(index,value){
				if (value.dis_id == json.object.loanObject.dis_id){
					opt += '<option value="'+value.dis_id+'" selected="selected">'+value.dis_name+'</option>'
				}else{
					opt += '<option value="'+value.dis_id+'">'+value.dis_name+'</option>'
				}	
			});
			$('#list_districts').append(opt);
			
			var communes = json.object.listCommunes;
			var opt       = '<option value="0" selected>ជ្រើសរើសឃុំ</option>';
			$('#list_communes').empty();
			$.each(communes,function(index,value){
				if (value.com_id == json.object.loanObject.com_id){
					opt += '<option value="'+value.com_id+'" selected="selected">'+value.com_name+'</option>'
				}else{
					opt += '<option value="'+value.com_id+'">'+value.com_name+'</option>'
				}	
			});
			$('#list_communes').append(opt);
		    
			var villages = json.object.listVillages;
			var opt       = '<option value="0" selected>ជ្រើសរើសភូមិ</option>';
			$('#list_village').empty();
			$.each(villages,function(index,value){
				if (value.vil_id == json.object.loanObject.vil_id){
					opt += '<option value="'+value.vil_id+'" selected="selected">'+value.vil_name+'</option>'
				}else{
					opt += '<option value="'+value.vil_id+'">'+value.vil_name+'</option>'
				}	
			});
			$('#list_village').append(opt);
			
		    $('#loan_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loan_id,9),"-"));
		    $('#total_money_txt').val(Common.numberWithComma(json.object.loanObject.total_money) +' ៛');
		    $('#total_money_kh').val(Common.khmerMoney(json.object.loanObject.total_money) + " ៛");
		    $('#time_txt').val(Common.numberWithComma(json.object.loanObject.time) + ' ដង');
		    $('#start_date_txt').val(moment(json.object.loanObject.start_date).format('DD/MM/YYYY'));
		    $('#type_payment_txt').val(json.object.loanObject.type_payment_num);
		    $('#rate_db').val(json.object.loanObject.rate);
		    $('#type_payment_db').val(json.object.loanObject.type_payment);
		    $('#day_db').val(json.object.loanObject.count_day);
		    
		    var tt = ((parseInt(json.object.loanObject.total_money) / parseInt(json.object.loanObject.time) ) * parseFloat(json.object.loanObject.rate)) / 100;
		    tt = Math.round(tt);
		    var total_rate = Common.ConvertZeroTwoDigit(tt+'');
		   if (parseInt(json.object.loanObject.decrement) > 0){
			   tt = (parseInt(json.object.loanObject.total_money) * parseFloat(json.object.loanObject.rate)) / 100;
			   total_rate = Common.ConvertZeroTwoDigit(tt+'');
		   }
		   
		    var dt         = moment(json.object.loanObject.start_date).format('DD/MM/YYYY').split('/');
		    var start_date = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
		               day = json.object.loanObject.count_day;
			start_date.setDate(start_date.getDate()+ parseInt(day));
			
		   $('#first_date_txt').val(moment(start_date).format('DD/MM/YYYY'));
		   $('#rate_money_txt').val(Common.numberWithComma(total_rate) + ' ៛');
		   $('#decrement_txt').val(Common.numberWithComma(json.object.loanObject.decrement) + ' ៛');
		   $('#agent_txt').val(json.object.loanObject.full_name);
		   $('#agent').val(json.object.loanObject.user_id);
		   
		   var tbl = '', d = 0;
		   $('#tbl_lst1 tbody').empty();
		   $('#tbl_lst1 tbody').show();
		   $.each(json.object.loanPaymentList,function(index,value){
			    var a = 0 ;
				if (parseInt(tt) - parseInt(d) > 0 ){
					a = (parseInt(tt) - parseInt(d)) + parseInt(value.prak_derm) ;
				}
				var b = Common.ConvertZeroTwoDigit(a+'');
				var c = Common.numberWithComma(b) + ' ៛'
				var bg = '';
				if (value.txt == '9'){
					bg = 'payment_already';
				}
			   tbl += '<tr>'
					+'<td class="'+bg+'"><div class="t_center">'+(index+1)+'</div></td>'
					+'<td class="'+bg+'"><div class="t_center">'+Common.ConvertDayToKhmer(start_date)   +'</div></td>'
					+'<td class="'+bg+'"><div class="t_right tbl_start_date">' +moment(start_date).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm"></div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate"></div></td>'
					+'<td class="'+bg+'"><div class="t_right tbl_payment">'+c+'</div></td>'
					+'<td class="'+bg+'"><div></div></td>'
					+'<td style="display:none;"><div class="t_right tbl_left"></div></td>'
					+'<td style="display:none;"><div></div></td>'
					+'<td style="display:none;"><div></div></td>'
				+'</tr>';
			   
			    start_date.setDate(start_date.getDate() + parseInt(day));	 
			    d = parseInt(d) + parseInt(json.object.loanObject.decrement);	
		   });
			$('#tbl_lst1 tfoot').hide();
			$('#tbl_lst1 tbody').append(tbl);
		},error:function(json){
			console.log(json);
		}
	});
}
/*ប្រភេទបង់ប្រាក់*/
function loadingSettingData(id){
	if ($('#loaner_name').val() == ''){
		Message.infor(null,'សូមបញ្ចូលឈ្មោះអ្នកដែលខ្ចីប្រាក់!',null);
    	return;
    }
    if ($('#phone').val() == ''){
    	Message.infor(null,'សូមបញ្ចូលលេខទូរស័ព្ទអ្នកដែលខ្ចីប្រាក់!',null);
    	return;
    }
    if ($('#id_card').val() == ''){
    	Message.infor(null,'សូមបញ្ចូលអត្ដសញ្ញាណប័ណ្ណអ្នកដែលខ្ចីប្រាក់!',null);
    	return;
    }
    if ($('#list_provinces').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលខេត្ដអ្នកដែលខ្ចីប្រាក់រស់នៅ!',null);
    	return;
    }	
    if ($('#list_districts').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលស្រុកអ្នកដែលខ្ចីប្រាក់រស់នៅ!',null);
    	return;
    }	
    if ($('#list_communes').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលឃុំអ្នកដែលខ្ចីប្រាក់រស់នៅ!',null);
    	return;
    }	
    if ($('#list_village').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលភូមិអ្នកដែលខ្ចីប្រាក់រស់នៅ!',null);
    	return;
    }	
	if (id == '0'){
		$('#loadingSettingOtherValue').hide();
		$('#loadingDecrementTypeValue').hide();
		$('input:radio[name=rd_decrement]').filter('[value=""]').prop('checked', true);
		$('#div_decrement').hide();
	}
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingSettingData',
		data:'payTxt='+id,
		success:function(json){
			if (json.code == 'undefined'){
				alert(json.message);
				return;
			}
			//console.log(json);
			var ListColumns = json.object.ListColumns;
			var settingList = json.object.settingList			
			var userList    = json.object.ListUser;
			var opt ='';
			
			$('#popup_agent').empty();
			$.each(userList,function(index, value){
				opt += '<option value="'+value.user_id+'">'+value.full_name+'</option>';
			});
			$('#popup_agent').append(opt);	
			
			var opt ='';
			$("#type_payment").empty();			
			$.each(ListColumns,function(index, value){
				opt += '<option value="'+value.type+'" data='+value.day+'>'+value.columns+'</option>';
			});
			
			$("#type_payment").append(opt);			
			loadingSettingValue($('#type_payment').val(),id);
			$('#popup_loan').bPopup();
		},error:function(json){
			console.log(json);
		}
	});
}

/*ប្រភេទបង់ប្រាក់  loading check time*/
function loadingSettingValue(val,payTxt){
	$.ajax({
		type:"GET",
		url :'/khmoney/loadingSettingValue',
		data: 'payTxt='+payTxt,
		success:function(json){
			if (json.code == 'undefined'){
				alert(json.message);
				return;
			}
			var label='';
			$('#div_time').empty();
			var settingList = json.object.settingList;
			
			$.each(settingList,function(index, value){
				if (val == value.type){
					label += '<label><input type="radio" name="time" onChange="loadingSettingOtherValue(this)" value="'+value.value+'"> '+value.value+'​ ដង</label>'
					        +'<input type="hidden" value="'+value.rate+'" id="rate_'+value.value+'">&nbsp;&nbsp;&nbsp;&nbsp;';
				}				
			});
			label += '<label><input type="radio" name="time" onchange="loadingSettingOtherValue(this)" value=""> ផ្សេងៗ</label>'
			$('#div_time').append(label);
			
		},error:function(json){
			
		}
	});
}

function loadingSettingOtherValue(obj){
	if ($(obj).val() == ''){
		$('#loadingSettingOtherValue').show();
	}else{
		$('#loadingSettingOtherValue').hide();
	}	
}

function confrimCheck(){
	var time,decrement=0,rate,total_money,total_rate,day;
	if ($('#popup_total_money').val() == '')
	{
		alert("សូមបញ្ចូលចំនួនទឹកប្រាក់សរុបដែលត្រូវខ្ចី!");
		$('#popup_total_money').focus();
		return;
	}
	
	if ($('input[name=rd_decrement]:checked').val() == 'decrement'){
		if ($('#popup_decrement').val() == ''){
			alert("សូមបញ្ចូលចំនួនទឹកប្រាក់ថយពីចំនួនទឹកប្រាក់សន្សំក្នុងពេលបង់មួយលើកៗ");
			$('#popup_decrement').focus();
			return;
		}		
	}
	
	if ($('#type_payment').val() == ''){
		alert("សូមជ្រើសរើសប្រភេទនៃការបង់ប្រាក់!");
		return;
	}
	if (!$('input[name=time]').is(':checked')){
		alert("សូមជ្រើសរើសចំនួនដងដែលត្រូវបង់ប្រាក់!")
		return;
	}
	if ($('input[name=time]').is(':checked')){
		if ($('input[name=time]:checked').val() == ''){
			if ($('#popup_time').val() == ''){
				alert("សូមជ្រើសរើសចំនួនដងដែលត្រូវបង់ប្រាក់!");
				return;
			}
			if ($('#popup_rate').val() == ''){
				alert("សូមបញ្ចូលអត្រាការប្រាក់ ដើម្បីទូរទាត់ការប្រាក់!");
				return;
			}
			if ($('input[name=rd_decrement]:checked').val() == 'decrement'){
				if (parseInt($('#popup_time').val()) > 15 ){					
					alert('បើជ្រើសរើសការបង់ប្រាក់ថយចុះ អ្នកមិនអាចបង់ប្រាក់លើស ១៥ ដង ទេ!');
					return;
				}	
			}
			
		}
	}
	
	
	total_money = $('#popup_total_money').val().replace(/[​\u202f\៛\,]/g,'').trim();
	
	if ($('input[name=time]:checked').val() == ''){
		time = $('#popup_time').val().replace(/[​\u202f\ដង\,]/g,'');
		rate = $('#popup_rate').val().replace(/[​\u202f\%\,]/g,'');

	}else{
		time = $('input[name=time]:checked').val();
		rate = $('#rate_'+time).val();
	}
	
	var dt         = $('#popup_start_date').val().split('/');
	var start_date = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
               day = $('#type_payment option:selected').attr('data');
	start_date.setDate(start_date.getDate()+ parseInt(day));
	
	/*calculate rate and total money*/
	var tt = ((parseInt(total_money) / time ) * parseFloat(rate)) / 100;
	    tt = Math.round(tt);
	var total_rate = Common.ConvertZeroTwoDigit(tt+'');
	var prak_derm  = Math.round(parseInt(total_money) / time);	
	
	if ($('input[name=rd_decrement]:checked').val() == 'decrement'){
		decrement = $('#popup_decrement').val().replace(/[​\u202f\៛\,]/g,'').trim();
		tt = (parseInt(total_money) * parseFloat(rate)) / 100;
		total_rate = Common.ConvertZeroTwoDigit(tt+'');		
	}
	
	$('#first_date_txt').val(moment(start_date).format('DD/MM/YYYY'));	
	$("#total_money_txt").val($('#popup_total_money').val());
	$('#total_money_kh').val(Common.khmerMoney(total_money) + " ៛");
	$('#type_payment_txt').val($('#type_payment option:selected').text());
	$('#start_date_txt').val($('#popup_start_date').val());
	$('#time_txt').val(time+' ដង');
	$('#rate_money_txt').val(Common.numberWithComma(total_rate)+' ៛')
	$('#decrement_txt').val(Common.numberWithComma(decrement)+ ' ៛')
	$('#rate_db').val(rate);
	$('#type_payment_db').val($('#type_payment option:selected').val());
	$("#day_db").val(day);
	$('#agent_txt').val($('#popup_agent').text());
	$('#agent').val($('#popup_agent').val());
	
	var tbl = '', d = 0;
	$('#tbl_lst1 tbody').empty();
	$('#tbl_lst1 tbody').show();
	for (var i = 1; i <= time; i++){
		var a = 0 ;
		if (parseInt(tt) - parseInt(d) > 0 ){
			a = (parseInt(tt) - parseInt(d)) + parseInt(prak_derm) ;
		}
		var b = Common.ConvertZeroTwoDigit(a+'');
		var c = Common.numberWithComma(b) + ' ៛'
		
		var left =  parseInt(total_money) -  (parseInt(prak_derm) * i)
		
		tbl += '<tr>'
					+'<td><div class="t_center">'+i+'</div></td>'
					+'<td><div class="t_center">'+Common.ConvertDayToKhmer(start_date)   +'</div></td>'
					+'<td><div class="t_right tbl_start_date">' +moment(start_date).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm">'+prak_derm+'</div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate">'+(parseInt(tt) - parseInt(d))+'</div></td>'
					+'<td><div class="t_right tbl_payment">'+c+'</div></td>'
					+'<td><div></div></td>'
					+'<td style="display:none;"><div class="t_right tbl_left">'+left+'</div></td>'
					+'<td style="display:none;"><div></div></td>'
					+'<td style="display:none;"><div></div></td>'
				+'</tr>';
		
		//set end date
	    start_date.setDate(start_date.getDate() + parseInt(day));	 
	    d = parseInt(d) + parseInt(decrement);
	   
	}
	$('#tbl_lst1 tfoot').hide();
	$('#tbl_lst1 tbody').append(tbl);
	$('#popup_loan').bPopup().close();
}


function loanSaveEdittem(){
	if ($('#loaner_name').val() == ''){
		Message.infor(null,'សូមបញ្ចូលឈ្មោះអ្នកដែលខ្ចីប្រាក់!',null);
    	return;
    }
    if ($('#phone').val() == ''){
    	Message.infor(null,'សូមបញ្ចូលលេខទូរស័ព្ទអ្នកដែលខ្ចីប្រាក់!',null);
    	return;
    }
    if ($('#id_card').val() == ''){
    	Message.infor(null,'សូមបញ្ចូលអត្ដសញ្ញាណប័ណ្ណអ្នកដែលខ្ចីប្រាក់!',null);
    	return;
    }
    if ($('#list_provinces').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលខេត្ដអ្នកដែលខ្ចីប្រាក់រស់នៅ!',null);
    	return;
    }	
    if ($('#list_districts').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលស្រុកអ្នកដែលខ្ចីប្រាក់រស់នៅ!',null);
    	return;
    }	
    if ($('#list_communes').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលឃុំអ្នកដែលខ្ចីប្រាក់រស់នៅ!',null);
    	return;
    }	
    if ($('#list_village').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលភូមិអ្នកដែលខ្ចីប្រាក់រស់នៅ!',null);
    	return;
    }
	
    $('#loading').bPopup();
	var data = {
			'loaner_id'   :$('#loaner_code').val().replace(/\-/g,'').trim(),
			'loaner_name' :$('#loaner_name').val(),
			'gender'      :$('input[name=gender]:checked').val(),
			'id_card'     :$('#id_card').val().replace(/\-/g,'').trim(),
			'phone'       :$('#phone').val().replace(/\-/g,'').trim(),
			'address_id'  :$('#list_village').val(),
			'start_date'  :Common.formatDateToString($('#start_date_txt').val().trim()),
			'loan_id'     :$('#loan_code').val().replace(/\-/g,'').trim(),
			'total_money' :$('#total_money_txt').val().replace(/[​\u202f\៛\,]/g,'').trim(),
			'rate'        :$('#rate_db').val(),
			'type_payment':$('#type_payment_db').val(),
			'time'        :$('#time_txt').val().replace(/[​\u202f\ដង\,]/g,'').trim(),
			'decrement'   :$('#decrement_txt').val().replace(/[​\u202f\៛\,]/g,'').trim(),
			'day'         :$('#day_db').val(),
			'agent'       :$('#agent').val(),
			'agentName'   :$('#agent_txt').val()
	};
	console.log(data);
	$.ajax({
		type:'GET',
		url :'/khmoney/loanSaveUdateItem',
		data:data,
		success:function(json){
			console.log(json);
			if (json.code == 'undefined' || json.code ==  '9999'){
				alert(json.message);
				return;
			}
			alert(json.message);
			window.location.href = '/khmoney/loan';
		},error:function(json){
			console.log(json)
		}
	});
	$('#loading').bPopup().close();
}
function errorCheck(json){
	if (json.code == 'undefined'){
		alert(json.message);
		return;
	}
}
function districtsListByProId(){

	$.ajax({
		type:'GET',
		url :'/khmoney/districtsListByProId',
		data:'proId='+$('#list_provinces').val(),
		success:function(json){
			console.log(json);
			if (json.code == 'undefined' || json.code == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			var districts = json.object.listDistricts;
			var opt       = '<option value="0" selected>ជ្រើសរើសស្រុក</option>';
			$('#list_districts').empty();
			$.each(districts,function(index,value){
				opt += '<option value="'+value.dis_id+'">'+value.dis_name+'</option>';
			});
			$('#list_districts').append(opt);
		},error:function(json){
			console.log(json);
		}
	});
}
function communesListByDisId(){

	$.ajax({
		type:'GET',
		url :'/khmoney/communesListByDisId',
		data:'comDisId='+$('#list_districts').val(),
		success:function(json){
			console.log(json);
			if (json.code == 'undefined' || json.code == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			var communes = json.object.listCommunes;
			var opt       = '<option value="0" selected>ជ្រើសរើសឃុំ</option>';
			$('#list_communes').empty();
			$.each(communes,function(index,value){
				opt += '<option value="'+value.com_id+'">'+value.com_name+'</option>';
			});
			$('#list_communes').append(opt);
		},error:function(json){
			console.log(json);
		}
	});
}
function villageListByComId(){
	
	$.ajax({
		type:'GET',
		url :'/khmoney/villageListByComId',
		data:'vilComId='+$('#list_communes').val(),
		success:function(json){
			console.log(json);
			if (json.code == 'undefined' || json.code == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			var villages = json.object.listVillages;
			var opt       = '<option value="0" selected>ជ្រើសរើសភូមិ</option>';
			$('#list_village').empty();
			$.each(villages,function(index,value){
				opt += '<option value="'+value.vil_id+'">'+value.vil_name+'</option>';
			});
			$('#list_village').append(opt);
		},error:function(json){
			console.log(json);
		}
	});
}