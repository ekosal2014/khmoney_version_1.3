$(document).ready(function(){
	init();		
	$('#type_payment').change(function(){
		loanShowBytime();
	});
	$('#btn_print').click(function(){
		$(".wrap").printElement({
				overrideElementCSS:[
				'/khmoney/css/print.css', 
				{ href:'/khmoney/css/print.css',media:'print'}] 
			}); 

	});
});

function init(){
	$('#loading').bPopup();
	/*
	 * we click from form loaner so you didn't have loan_id
	 */	
	if ($('#loan_id').val() == ''){
		$.ajax({
			type:'GET',
			url :'/khmoney/loadingLoanview',
			data:'loaner_id='+$('#loaner_id').val()+'&id='+$('#id').val(),
			success:function(json){
				loadingInformationLoaner(json);
			},error:function(json){
				console.log(json);
			}
		});
	}/* * we click from form loan so you didn't have loan_id * */
	else{
		var data = {
				'loaner_id':$('#loaner_id').val(),
				'loan_id'  :$('#loan_id').val(),
				'id'       :$('#id').val()
		}
		$.ajax({
			type:'GET',
			url :'/khmoney/loadingLoanEdit',
			data:data,
			success:function(json){
				loadingInformationLoaner(json);
			},error:function(json){
				console.log(json);
			}
		});
	}
	$('#loading').bPopup().close();
	
}
/* * loading All information of loaner * */
function loadingInformationLoaner(json){	
			if (json.code == '9999'){
				alert(json.message);
				return;
			}
			$('#loaner_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loaner_id,9),"-"));
		    $('#loaner_name').val(json.object.loanObject.loaner_name);
		    $('#id_card').val(Common.phoneWithComma(json.object.loanObject.id_card));
		    $('#phone').val(Common.phoneWithComma(json.object.loanObject.phone));
		    $('input[name=gender][value='+json.object.loanObject.gender+']').prop('checked',true);
		    $('#address').val(json.object.loanObject.address);
		    $('#loan_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loan_id,9),"-"));
		    $('#total_money_txt').val(Common.numberWithComma(json.object.loanObject.total_money) +' ៛');
		    $('#total_money_kh').val(Common.khmerMoney(json.object.loanObject.total_money) + " ៛");
		    $('#time_txt').val(Common.numberWithComma(json.object.loanObject.time) + ' ដង');
		    $('#start_date_txt').val(moment(json.object.loanObject.start_date).format('DD/MM/YYYY'));
		    
		    var opt = '';
		    if (typeof json.object.loanList != 'undefined'){
	    	   $.each(json.object.loanList,function(index,value){
			    	opt += '<option value="'+value.loan_id+'">លើទី'+(index+1)+'</option>';
			    });
	    	   $('#type_payment').append(opt);
	    	   $('#type_payment').show();
		    }else{
		    	$('#type_payment').hide();
		    }		 
		    
		    
		    $('#type_payment_txt').val(json.object.loanObject.type_payment_num);
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
		   $('#agent').val(json.object.loanObject.full_name);
		  
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
				}else if(value.txt == '2'){
					bg = 'payment_all';
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
				if (index==1){
			    	$('#end_date_db').val(moment(start_date).format('YYYYMMDD'));
			    }
			    start_date.setDate(start_date.getDate() + parseInt(day));	 
			    d = parseInt(d) + parseInt(json.object.loanObject.decrement);	
		   });
			$('#tbl_lst1 tfoot').hide();
			$('#tbl_lst1 tbody').append(tbl);
		
}
/* * one Loaner loan many time * */
function loanShowBytime(){
	$.ajax({
		type:'GET',
		url :'/khmoney/loanShowBytime',
		data:'loan_id='+$('#type_payment').val(),
		success:function(json){
			//console.log(json);
			if (json.code == 'undefined'){
				alert(json.message);
				return;
			}

		    $('#loan_code').val(Common.numberWithComma(Common.leftPage(json.object.loanerObject[0].loan_id,9),"-"));
		    $('#total_money_txt').val(Common.numberWithComma(json.object.loanerObject[0].total_money) +' ៛');
		    $('#total_money_kh').val(Common.khmerMoney(json.object.loanerObject[0].total_money+'') + " ៛");
		    $('#time_txt').val(Common.numberWithComma(json.object.loanerObject[0].time) + ' ដង');
		    $('#start_date_txt').val(moment(json.object.loanerObject[0].start_date).format('DD/MM/YYYY'));
		    
		    if (json.object.listtypePayment.length > 0){
		    	  $.each(json.object.listtypePayment,function(index, value){
				    	if (value.type == json.object.loanerObject[0].type_payment){
				    		 $('#type_payment_txt').val(value.columns);
				    	}
				    });
		    }
		  
		    
		    var tt = ((parseInt(json.object.loanerObject[0].total_money) / parseInt(json.object.loanerObject[0].time) ) * parseFloat(json.object.loanerObject[0].rate)) / 100;
		    tt = Math.round(tt);
		    var total_rate = Common.ConvertZeroTwoDigit(tt+'');
		   if (json.object.loanerObject[0].decrement != 0){
			   tt = (parseInt(json.object.loanerObject[0].total_money) * parseFloat(json.object.loanerObject[0].time)) / 100;
			   total_rate = Common.ConvertZeroTwoDigit(tt+'');
		   }
		   
		    var dt         = moment(json.object.loanerObject[0].start_date).format('DD/MM/YYYY').split('/');
		    var start_date = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
		               day = json.object.loanerObject[0].count_day;
			start_date.setDate(start_date.getDate()+ parseInt(day));
		   $('#first_date_txt').val(moment(start_date).format('DD/MM/YYYY'));
		   $('#rate_money_txt').val(Common.numberWithComma(total_rate) + ' ៛');
		   $('#decrement_txt').val(Common.numberWithComma(json.object.loanerObject[0].decrement) + ' ៛');
		   $('#agent').val(json.object.loanerObject[0].full_name);
		   
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
			   tbl += '<tr>'
					+'<td><div class="t_center">'+index+'</div></td>'
					+'<td><div class="t_center">'+Common.ConvertDayToKhmer(start_date)   +'</div></td>'
					+'<td><div class="t_right tbl_start_date">' +moment(start_date).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm"></div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate"></div></td>'
					+'<td><div class="t_right tbl_payment">'+c+'</div></td>'
					+'<td><div></div></td>'
					+'<td style="display:none;"><div class="t_right tbl_left"></div></td>'
					+'<td style="display:none;"><div></div></td>'
					+'<td style="display:none;"><div></div></td>'
				+'</tr>';
				if (index==1){
			    	$('#end_date_db').val(moment(start_date).format('YYYYMMDD'));
			    }
			    start_date.setDate(start_date.getDate() + parseInt(day));	 
			    d = parseInt(d) + parseInt(json.object.loanerObject[0].decrement);	
		   });
			$('#tbl_lst1 tfoot').hide();
			$('#tbl_lst1 tbody').append(tbl);
		},error:function(json){
			console.log(json);
		}
	});
}

