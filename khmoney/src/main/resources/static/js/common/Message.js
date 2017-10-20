/**
 * 
 */

var Message = {};
if (!Message) Message = {};
Message.infor = function (title,content,callBack){
	var title   = (typeof title   != 'undefined' || title   == null) ? 'ពត័មាន' : title;
	var content = (typeof content != 'undefined' || content == null) ? '' : content;
	$.alert({
	    title: title,
	    content: content,
	    type: 'green',
	    boxWidth: '300px',
	    useBootstrap: false,
	    closeIcon: function(){
	    	callBack;
	    },
	    buttons: {   
	        ok: {
	            text: "យល់ព្រម!",
	            btnClass: 'btn-primary',
	            keys: ['enter'],
	            action: function(){
	            	callBack;
	            }
	        }
	    }
	});
}