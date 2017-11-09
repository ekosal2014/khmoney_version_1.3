/**
 * 
 */

$(document).ready(function(){
	
	provinceListAll();
	
});

function provinceListAll(){
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/provinceListAll',
		success:function(json){
			console.log(json);
			if (json.code == 'undefined' || json.code == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			var province = json.object;
			var opt       = '';
			$('#cssmenu>ul').empty();
			$.each(province,function(index,value){
				opt += '<li class="has-sub"><a href="javascript:" data-id="'+value.pro_id+'" onClick="districtsListByProId(this)"><span>'+value.pro_name+'</span></a></li>';
			});
			opt += '<li><a href="javascript:" onClick="provinceAddNew()"><span>បន្ថែមខេត្ដថ្មី</span></a></li>';
			$('#cssmenu>ul').append(opt);
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}
function districtsListByProId(obj){	
	if ($(obj).parent('li').hasClass('has-sub')){
		$(obj).parent('li').removeClass('has-sub');
		$(obj).parent('li').addClass('active');
	}else{
		$(obj).parent('li').addClass('has-sub');
		$(obj).parent('li').removeClass('active');
		$(obj).next('ul').hide('slow');
		return;
	}
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/districtsListByProId',
		data:'proId='+$(obj).attr('data-id'),
		success:function(json){
			console.log(json);
			if (json.code == 'undefined' || json.code == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			var districts = json.object.listDistricts;
			var opt       = '<ul>';
			$(obj).next().remove();
			$.each(districts,function(index,value){
				opt += '<li class="has-sub"><a href="javascript:" data-id="'+value.dis_id+'" onClick="communesListByDisId(this)"><span>'+value.dis_name+'</span></a></li>';
			});
			opt += '<li><a href="javascript:" onClick=""><span>បន្ថែមស្រុកថ្មី</span></a></li>';
			opt += '</ul>'
			$(obj).parent('li').append(opt).hide().show('slow');
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}
function communesListByDisId(obj){
	if ($(obj).parent('li').hasClass('has-sub')){
		$(obj).parent('li').removeClass('has-sub');
		$(obj).parent('li').addClass('active');
	}else{
		$(obj).parent('li').addClass('has-sub');
		$(obj).parent('li').removeClass('active');
		$(obj).next('ul').hide('slow');
		return;
	}
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/communesListByDisId',
		data:'comDisId='+$(obj).attr('data-id'),
		success:function(json){
			console.log(json);
			if (json.code == 'undefined' || json.code == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			var communes = json.object.listCommunes;
			var opt       = '<ul>';
			$(obj).next().remove();
			$.each(communes,function(index,value){
				opt += '<li class="has-sub"><a href="javascript:" data-id="'+value.com_id+'" onClick="villageListByComId(this)"><span>'+value.com_name+'</span></a></li>';
			});
			opt += '<li><a href="javascript:" onClick=""><span>បន្ថែមឃុំថ្មី</span></a></li>';
			opt += '</ul>'
			$(obj).parent('li').append(opt).hide().show('slow');
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}
function villageListByComId(obj){
	if ($(obj).parent('li').hasClass('has-sub')){
		$(obj).parent('li').removeClass('has-sub');
		$(obj).parent('li').addClass('active');
	}else{
		$(obj).parent('li').addClass('has-sub');
		$(obj).parent('li').removeClass('active');
		$(obj).next('ul').hide('slow');
		return;
	}
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/villageListByComId',
		data:'vilComId='+$(obj).attr('data-id'),
		success:function(json){
			console.log(json);
			if (json.code == 'undefined' || json.code == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			var villages = json.object.listVillages;
			var opt       = '<ul>';
			$(obj).next().remove();
			$.each(villages,function(index,value){
				opt += '<li><a href="javascript:"><span>'+value.vil_name+'</span></a></li>';
			});
			opt += '<li><a href="javascript:" onClick=""><span>បន្ថែមភូមិថ្មី</span></a></li>';
			opt += '</ul>'
			$(obj).parent('li').append(opt).hide().show('slow');
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}

function provinceAddNew(){
	$('#popup_province').bPopup();
}
