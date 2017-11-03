//登陆交互
layui.use('form', function () {
    var form = layui.form;
    //监听提交
    form.on('submit(formDemo)', function (data) {
        $.ajax({
            url:'/api/login',
            type:'post',
            dataType:'json',
            data:data.field,
            success:function (result) {
                if(result.code){
                    layer.msg(result.message);
                }else{
                   
                }
            }
        })
        return false;
    });
});

//面板也交互
layui.use('element', function () {
    var element = layui.element;
});