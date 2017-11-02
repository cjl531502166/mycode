layui.use('form', function () {
    var form = layui.form;
    //监听提交
    form.on('submit(formDemo)', function (data) {
        console.log(data)
        $.ajax({
            url:'/api/login',
            type:'post',
            dataType:'json',
            data:data.field,
            success:function (result) {
                layer.msg(result.message);
            }
        })
        return false;
    });
});