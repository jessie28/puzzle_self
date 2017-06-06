

$(function() {
	var submit_flag = true;
	$("#submit_btn").on('click',function () {
		var $that = $(this);
		// if(!($that.hasClass('submit_ok'))){
		// 	return false;
		// }
		// $that.removeClass('submit_ok');
		var username = $('input[name="username"]').val();
		var userphone = $('input[name="userphone"]').val();
		var useradd = $('input[name="useradd"]').val();
		if(username==''){
			my_notify('请填写姓名');
			return;
		}
		if(useradd==''){
			my_notify("请填写地址");
			return;
		}
		if(!userphone.match(/^1\d{10}$/)){
			my_notify("请填写正确的手机号码");
			return;
		}
		var data_info = {'username':username,'userphone':userphone,'useradd':useradd}
		if(submit_flag){
			submit_flag = false;
			$.post(info_submit,data_info,function (res) {
				if(res != '1'){
					my_notify(res)
				}else{
					my_notify('提交成功')
				}
			})
		}

	})
	
});