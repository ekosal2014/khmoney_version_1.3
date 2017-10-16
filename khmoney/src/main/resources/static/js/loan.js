var status = 'pay_constand';
$(document).ready(function(){
	Common.datePickerRang('start_date','end_date');
	pagConstand(1);
	$('#status').change(function(){
		if ($('#status').is(':checked')){
			$('#status_date').show();
		}else{
			$('#status_date').hide();
		}
	});
	$('#tbl_search').click(function(){			
		if (status == 'pay_constand'){
			pagConstand(1);
		}else{
			pagDown(1);
		}
	});
	$('#num_rows').change(function(){
		if (status == 'pay_constand'){
			pagConstand(1);
		}else{
			pagDown(1);
		}
	});
});
function openTabLinke(evt, obj){
	$('.tabContents').hide();
	$('.tabLinks').parent('li').removeClass('on');
	$('#'+ obj).show();
	$(evt).parent('li').addClass('on');
	status = obj;
	if (obj == 'pay_constand'){
		pagConstand(1);
	}else{
		pagDown(1);
	}
	
}
function pagConstand(page){
	var object = {
			'perPage'     : $('#num_rows').val(),
			'currentPage' : page,
			'search'      : $('#search').val(),
			'typePayment' : '',
			'startDate'   : '',
			'endDate'     : '',
			'decrementTxt': ''
	}
	if ($('#status').is(':checked')){
		//alert($('#start_date').val());
		object['startDate'] = Common.formatDateToString($('#start_date').val().trim());
		object['endDate']   = Common.formatDateToString($('#end_date').val().trim());
	}
	if (typeof $('#type_payment').val() != null){
		object['typePayment']   = $('#type_payment').val();
	}
	console.log(object);
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingLoanListView',
		data:object,
		success:function(json){
			console.log(json);
			if (json.code == 'undefined' || json.code == '9999'){
				alert(json.message);
				return;
			}
			var loanList = json.object.loanList;
			var typePayment = json.object.typePaymentList;
			var tbl = '',opt='<option value="">ទាំងអស់</option>';
			$('#pay_constand tbody').empty();
			$('#type_payment').empty();
			$('#pay_constand tfoot').hide();
			$('#pay_constand tbody').show();
			$.each(typePayment,function(index,value){
				opt += '<option value="'+value.type+'" '+(json.object.typePayment==value.type?'selected="selected"':'')+'>'+value.columns+'</option>'
			});
			$('#type_payment').append(opt);
			
			if (loanList.length > 0 ){
				var i = (parseInt(page)-1) * parseInt($('#num_rows').text().replace(/[​\-]/g,''));
				$.each(loanList,function(index,value){
					var rate    = ((parseInt(value.total_money) / parseInt(value.time)) * parseFloat(value.rate)) / 100;
					var total   = parseFloat(rate) + (parseInt(value.total_money) / parseInt(value.time));
					var  tt     = Math.round(rate);
					    total   = Math.round(total);
				    var end_date  = '';
				    if (value.txt == '1'){
				    	end_date  = '';
				    }else{
				    	end_date = moment(value.end_date).format('DD/MM/YYYY');
				    }
				    var amount = '0';
				    //console.log(value.amount);
				    if (typeof value.amount != 'undefined' && typeof value.amount != ''){
				    	amount = Common.numberWithComma(Common.ConvertZeroTwoDigit(Math.round(value.amount)+''));
				    }
					tbl += '<tr>'
								+'<td><div class="t_center"><input type="checkbox"><input type="hidden" class="loaner_id" value="'+value.loaner_id+'"/></div></td>'
								+'<td><div>'+(i+1)+'</div></td>'
								+'<td><div>'+Common.numberWithComma(Common.leftPage(value.loan_id,9))+'</div></td>'
								+'<td><div>'+moment(value.start_date).format('DD/MM/YYYY')+'</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(value.total_money)+' ៛</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(Common.ConvertZeroTwoDigit(tt+''))+' ៛</div></td>'
								+'<td><div class="t_center">'+Common.numberWithComma(value.time)+' ដង</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(Common.ConvertZeroTwoDigit(total+''))+' ៛</div></td>'
								+'<td><div class="t_right">'+amount+' ៛</div></td>'
								+'<td><div>'+end_date+'</div></td>'
								+'<td><div class="t_center">'+(value.txt=='9'?'បានបញ្ចប់':'រង់ចាំ')+'</div></td>'
								+'<td><div><a href="/khmoney/loan/loan-view-detail?loaner_id='+value.loaner_id+'&loan_id='+value.loan_id+'&id=loan" style="width:50px;">លំអិត</a><a loan_id="'+value.loan_id+'" loaner_id="'+value.loaner_id+'" href="javascript:" onClick="loadingEditLoan(this)" txt="'+value.txt+'" style="width:50px;">កែប្រែ</a></div></td>'
							+'</tr>';
					i++;
				});
			}else{
				$('#pay_constand tfoot').show();
				$('#pay_constand tbody').hide();
			}
			$('#pay_constand tbody').append(tbl);
			 var option = {
        			total       : json.object.total_row,
    				maxVisible  : 10,
    				perPage     : $('#num_rows').val(),
    				currentPage : page,
    				numPage     : 1,
    				wrapClass   :'paging',
    				eventLink   :'pagConstand'
        	 }
		     pagination.showPage(option);
		     $('#loading').bPopup().close();
		},error:function(){
			
		}
	});
}
function pagDown(page){
	var object = {
			'perPage'     : $('#num_rows').val(),
			'currentPage' : page,
			'search'      : $('#search').val(),
			'typePayment' : '',
			'startDate'   : '',
			'endDate'     : '',
			'decrementTxt':'decrement'
	}
	if ($('#status').is(':checked')){
		//alert($('#start_date').val());
		object['startDate'] = Common.formatDateToString($('#start_date').val().trim());
		object['endDate']   = Common.formatDateToString($('#end_date').val().trim());
	}
	if (typeof $('#type_payment').val() != null){
		object['typePayment']   = $('#type_payment').val();
	}
	console.log(object);
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingLoanListView',
		data:object,
		success:function(json){
			console.log(json);
			if (json.code == 'undefined' || json.code == '9999'){
				alert(json.message);
				return;
			}
			var loanList = json.object.loanList;
			var typePayment = json.object.typePaymentList;
			var tbl = '',opt='<option value="">ទាំងអស់</option>';
			$('#pay_down tbody').empty();
			$('#type_payment').empty();
			$('#pay_down tfoot').hide();
			$('#pay_down tbody').show();
			$.each(typePayment,function(index,value){
				opt += '<option value="'+value.type+'" '+(json.object.typePayment==value.type?'selected="selected"':'')+'>'+value.columns+'</option>'
			});
			$('#type_payment').append(opt);
			
			if (loanList.length > 0 ){
				var i = (parseInt(page)-1) * parseInt($('#num_rows').text().replace(/[​\-]/g,''));
				$.each(loanList,function(index,value){
					var rate      = (parseInt(value.total_money) * parseFloat(value.rate)) / 100;					
				    var end_date  = '';
				    if (value.txt == '1'){
				    	end_date  = '';
				    }else{
				    	end_date = moment(value.end_date).format('DD/MM/YYYY');
				    }
				    var amount = '0';
				    //console.log(value.amount);
				    if (typeof value.amount != 'undefined' && typeof value.amount != ''){
				    	amount = Common.numberWithComma(Common.ConvertZeroTwoDigit(Math.round(value.amount)+''));
				    }
					tbl += '<tr>'
								+'<td><div class="t_center"><input type="checkbox"><input type="hidden" class="loaner_id" value="'+value.loaner_id+'"/></div></td>'
								+'<td><div>'+(i+1)+'</div></td>'
								+'<td><div>'+Common.numberWithComma(Common.leftPage(value.loan_id,9))+'</div></td>'
								+'<td><div>'+moment(value.start_date).format('DD/MM/YYYY')+'</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(value.total_money)+' ៛</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(Common.ConvertZeroTwoDigit(rate+''))+' ៛</div></td>'
								+'<td><div class="t_center">'+Common.numberWithComma(value.time)+' ដង</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(Common.ConvertZeroTwoDigit(value.decrement+''))+' ៛</div></td>'
								+'<td><div class="t_right">'+amount+' ៛</div></td>'
								+'<td><div>'+end_date+'</div></td>'
								+'<td><div class="t_center">'+(value.txt=='9'?'បានបញ្ចប់':'រង់ចាំ')+'</div></td>'
								+'<td><div><a href="/khmoney/loan/loan-view-detail?loaner_id='+value.loaner_id+'&loan_id='+value.loan_id+'&id=loan" style="width:50px;">លំអិត</a><a loan_id="'+value.loan_id+'" loaner_id="'+value.loaner_id+'" href="javascript:" onClick="loadingEditLoan(this)" txt="'+value.txt+'" style="width:50px;">កែប្រែ</a></div></td>'
							+'</tr>';
					i++;
				});
			}else{
				$('#pay_down tfoot').show();
				$('#pay_down tbody').hide();
			}
			console.log(tbl);
			$('#pay_down tbody').append(tbl);
			 var option = {
        			total       : json.object.total_row,
    				maxVisible  : 10,
    				perPage     : $('#num_rows').val(),
    				currentPage : page,
    				numPage     : 1,
    				wrapClass   :'paging',
    				eventLink   :'pagDown'
        	 }
		     pagination.showPage(option);
		     $('#loading').bPopup().close();
		},error:function(){
			
		}
	});
}


function loadingEditLoan(obj){
	if ($(obj).attr('txt') == '9'){
		alert("អ្នកមិនអាចធ្វើការកែប្រែបានទេ ពីព្រោះអ្នកខ្ចីបានបង់ប្រាក់អស់ហើយ!");
		return;
	}
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingCheckLoanPayMent',
		data:'loan_id='+$(obj).attr('loan_id'),
		success:function(json){
			var count = json.object.count;
			if (parseInt(count) <= 0 ){
				window.location.href = '/khmoney/loan/loan-edit?loaner_id='+$(obj).attr('loaner_id')+'&loan_id='+$(obj).attr('loan_id');
			}else{
				alert("អ្នកមិនអាចធ្វើការកែប្រែបានទេ ពីព្រោះអ្នកខ្ចីបានបង់ប្រាក់ខ្លះហើយ!");
				return;
			}
		},error:function(){
			
		}
		
	});
	
}