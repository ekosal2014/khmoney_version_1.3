var pagination;
if (!pagination) pagination = {};
if (!pagination.showPage){
	pagination.showPage = {};
	var item = {};
	pagination = {
		total : 10,
		maxVisible : 5,
		perPage : 10,
		currentPage : 1,
		numPage : 1,
		nextClass:'next',
		prevClass:'prev',
		lastClass:'last',
		firstClass:'first',
		activeClass:'on',
		disabledClass:'disabled',
		first :'←',
		last:'→',
		next:'»',
		prev:'«',
		wrapClass:'pagination',
		eventLink:''
	};
}
pagination.showPage = function(option){
	this.item        = option;
	this.total       = this.item.total;
	this.maxVisible  = this.item.maxVisible;
	this.perPage     = this.item.perPage;
	this.currentPage = this.item.currentPage;
	this.eventLink   = this.item.eventLink;
	this.wrapClass   = this.item.wrapClass;
	this.numPage     = Math.ceil(this.total / this.perPage);
	if (typeof first != 'undefined') {
		this.first = this.item.first;
	}
	if (typeof last != 'undefined') {
		this.last = this.item.last;
	}
	if (typeof next != 'undefined') {
		this.next = this.item.next;
	}
	if (typeof prev != 'undefined') {
		this.prev = this.item.prev;
	}
	if (typeof wrapClass != 'undefined') {
		this.wrapClass = this.item.wrapClass;
	}
	var start= ((Math.ceil(this.currentPage / this.maxVisible) * this.maxVisible) - this.maxVisible)+1;
	var end  = (Math.ceil(this.currentPage / this.maxVisible) * this.maxVisible);
	if (end > this.numPage){ end = this.numPage; }
	var page =  '';
	if (start > this.maxVisible){
		page += '<a href="javascript:" data-lp="1" onClick="'+this.eventLink+'(1)"'+' class="btn_pag_cntr first on"><span class="blind">first</span></a>';
		page += '<a href="javascript:" data-lp="'+(start-1)+'" onClick="'+this.eventLink+'('+(start-1)+')"'+' class="btn_pag_cntr prev on"><span class="blind">previous</span></a>'
	}else{
		page += '<a href="javascript:" data-lp="" onClick="" class="btn_pag_cntr first"><span class="blind">first</span></a>';
		page += '<a href="javascript:" data-lp="" onClick="" class="btn_pag_cntr prev"><span class="blind">previous</span></a>'
	}
	page += '<span class="pag_num">';	
	for(var i = start; i <= end; i++){		
		if (i==this.currentPage){
			page += '<a href="javascript:" data-lp="'+i+'" class="'+this.activeClass+'" onClick="'+this.eventLink+'('+i+')">'+i+'</a>';		
				//'<li data-lp="'+i+'" class="'+this.activeClass+'"><a onClick="'+this.eventLink+'('+i+')">'+i+'</a></li>';
		}else{
			page += '<a href="javascript:" data-lp="'+i+'" onClick="'+this.eventLink+'('+i+')">'+i+'</a>';
				//'<li data-lp="'+i+'"><a onClick="'+this.eventLink+'('+i+')">'+i+'</a></li>';
		}
		
	}
	page += '</span>';
	if (this.numPage <= this.maxVisible){
		page += '<a href="javascript:" data-lp="" onClick="" class="btn_pag_cntr next"><span class="blind">next</span></a>';
		page += '<a href="javascript:" data-lp="" onClick="" class="btn_pag_cntr last"><span class="blind">last</span></a>';
	}else{
		if (end > this.maxVisible){
			if (end == this.numPage){
				page += '<a href="javascript:" data-lp="" onClick="" class="btn_pag_cntr next"><span class="blind">next</span></a>';
				page += '<a href="javascript:" data-lp="" onClick="" class="btn_pag_cntr last"><span class="blind">last</span></a>';
			}else{
				page += '<a href="javascript:" data-lp="'+(end+1)+'" onClick="'+this.eventLink+'('+(end+1)+')" class="btn_pag_cntr next on"><span class="blind">next</span></a>';
				page += '<a href="javascript:" data-lp="'+this.numPage+'" onClick="'+this.eventLink+'('+(this.numPage)+')" class="btn_pag_cntr last on"><span class="blind">last</span></a>';
			}
			
		}else{
			page += '<a href="javascript:" data-lp="'+(end+1)+'" onClick="'+this.eventLink+'('+(end+1)+')" class="btn_pag_cntr next on"><span class="blind">next</span></a>';
			page += '<a href="javascript:" data-lp="'+this.numPage+'" onClick="'+this.eventLink+'('+(this.numPage)+')" class="btn_pag_cntr last on"><span class="blind">last</span></a>';
		}
	}
	
	
	$('.'+this.wrapClass).empty();
	$('.'+this.wrapClass).append(page);
}

