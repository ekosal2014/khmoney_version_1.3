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
		$('.alert_wrap').bPopup().close();
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
		loanSaveLoanAgain();
		
	});
	
});

function init(){
	$('#loading').bPopup();
	loanerGetMaxId();
	Common.datePickerRang('popup_start_date');
	$('#popup_total_money').autoNumeric('init',{ aSign: '​​ ៛',aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999999',vMin: '0'});
	$('#popup_time').autoNumeric('init',{ aSign: '​​ ដង',pSign: 's',aPad: false,vMax: '999',vMin: '0'});
	$('#popup_rate').autoNumeric('init', { aSign: ' %',pSign: 's',aPad: false,vMax: '99',vMin: '00.00',mDec: 2,});
	$('#popup_decrement').autoNumeric('init', { aSign: '​​ ៛',aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999',vMin: '0'});
	$('#loading').bPopup().close();
	
}

function loanerGetMaxId(){
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingLoanAgain',
		data:'loaner_id='+$('#loaner_id').val(),
		success:function(json){
			console.log(json);
			if (json.code == 'undefined'){
				alert(json.message);
				return;
			}
			/*$('#loaner_code').val(Common.numberWithComma(json.object.maxLoanerId,"-"));*/
			$('#loaner_code').val(Common.numberWithComma(Common.leftPage(json.object.loanerObject.loaner_id,9)));
		    $('#loaner_name').val(json.object.loanerObject.loaner_name);
		    $('#id_card').val(Common.phoneWithComma(json.object.loanerObject.id_card));
		    $('#phone').val(Common.phoneWithComma(json.object.loanerObject.phone));
		    $('input[name=gender][value='+json.object.loanerObject.gender+']').prop('checked',true);
		    $('#address').val(json.object.loanerObject.address);
			$('#loan_code').val(Common.numberWithComma(json.object.maxLoanId,"-"));
			$('#agent_txt').val(json.object.userName);
		},error:function(json){
			console.log(json);
		}
	});
}
/*ប្រភេទបង់ប្រាក់*/
function loadingSettingData(id){
	if ($('#loaner_name').val() == '' || $('#phone').val() == '' || $('#id_card').val() == '' || $('#address').val() == ''){
    	alert('សូមបំពេញពត៍មានរបស់អ្នកខ្ចីមុន ទើបអាចបំពេញទឹកប្រាក់ដែលត្រូវខ្ចីបាន!!');
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
			console.log(json);
			var ListColumns = json.object.ListColumns;
			var settingList = json.object.settingList			
			var opt ='';
			$("#type_payment").empty();
			$.each(ListColumns,function(index, value){
				opt += '<option value="'+value.type+'" data='+value.day+'>'+value.columns+'</option>';
			});
			$("#type_payment").append(opt);			
			loadingSettingValue($('#type_payment').val(),id);
			$('.alert_wrap').bPopup();
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
	$('.alert_wrap').bPopup().close();
}


function loanSaveLoanAgain(){
	if ($('#loaner_name').val() == ''){
    	alert('សូមបញ្ចូលឈ្មោះអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }
    if ($('#phone').val() == ''){
    	alert('សូមបញ្ចូលលេខទូរស័ព្ទអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }
    if ($('#id_card').val() == ''){
    	alert('សូមបញ្ចូលអត្ដសញ្ញាណប័ណ្ណអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }
    if ($('#address').val() == ''){
    	alert('សូមបញ្ចូលអាស័យដ្ឋានអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }	
	
    $('#loading').bPopup();

	var data = {
			'loaner_id'   :$('#loaner_id').val(),
			'start_date'  :Common.formatDateToString($('#start_date_txt').val().trim()),
			'total_money' :$('#total_money_txt').val().replace(/[​\u202f\៛\,]/g,'').trim(),
			'rate'        :$('#rate_db').val(),
			'type_payment':$('#type_payment_db').val(),
			'time'        :$('#time_txt').val().replace(/[​\u202f\ដង\,]/g,'').trim(),
			'decrement'   :$('#decrement_txt').val().replace(/[​\u202f\៛\,]/g,'').trim(),
			'day'         :$('#day_db').val()
	};
	console.log(data);
	$.ajax({
		type:'GET',
		url :'/khmoney/loanSaveLoanAgain',
		data:data,
		success:function(json){
			if (json.code == 'undefined'){
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