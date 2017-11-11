//注册layui 模块
layui.use(['form','element','table'],function () {
    var mod_config = {
        form:layui.form,
        element:layui.element,
        table:layui.table
    }

    //登陆
    mod_config.form.on('submit(formDemo)', function (data) {
        $.ajax({
            url: '/api/login',
            type: 'post',
            dataType: 'json',
            data: data.field,
            success: function (result) {
                if (result.code) {
                    layer.msg(result.message);
                } else {
                    window.location.reload();
                }
            }
        })
        return false;
    });
    //退出登录
    $('#logOut').on('click', function () {
        $.post('/api/logout', {}, function (data) {
            window.location.reload();
        })
    });

    //分类添加
    mod_config.form.on('submit(addCate)',function (data) {
        console.log(data);
        $.ajax({
            url:'/api/category/add',
            type:'get',
            dataType:'json',
            data:data.field,
            success:function (res) {

                layer.msg(res.message)
            }
        })
        return false;
    })
})