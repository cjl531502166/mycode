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
                    window.location.reload();
                }
            }
        })
        return false;
    });
});

//后台内容面板交互
layui.use('element', function () {
    var element = layui.element;
    $('#logOut').on('click',function () {
        $.post('/api/logout',{},function (data) {
            
            window.location.reload();
        })
    })
});