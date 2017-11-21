//注册layui 模块
layui.use(['form', 'element', 'table','layedit'],function () {
    var mod_config = {
        form:layui.form,
        element:layui.element,
        table:layui.table,
        layedit: layui.layedit
    }
    //删除操作
    var runDel = function (selector,eledel,apiurl) {
        var delBtn = $(selector);
        delBtn.on('click',function () {
            var that = this,id = $(that).data('id');
            layer.alert('确定删除？',function (index) {
                $.ajax({
                    url: '/' + apiurl,
                    type: 'POST',
                    data: { id: id },
                    dataType: 'json',
                    success: function (res) {
                        if (res.code == 0) {
                            window.location.reload();
                        } else {
                            layer.msg(res.message);
                        }
                    }
                });
                layer.close(index);
            })
        })
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

    //用户删除
    runDel('.delUser', 'tr', 'api/user/delete');

    //设置管理员
    $('#setAdmin').on('click',function () {
        var id = $(this).data('id'), user = $(this).data('user');
        layer.alert("确定将用户&nbsp;" + "<span class='text-red'>"+user+"</span>" + "&nbsp;设置为管理员吗", function (index) {
            $.ajax({
                url: '/api/user/set',
                type: 'POST',
                data: { id: id },
                dataType: 'json',
                success: function (res) {
                    window.location.reload();
                }
            });
            layer.close(index);
        })
    })

    //分类添加
    mod_config.form.on('submit(addCate)',function (data) {
        console.log(data);
        $.ajax({
            url:'/api/category/add',
            type:'POST',
            dataType:'json',
            data:data.field,
            success:function (res) {
                if(res.code ==0){
                    window.location.href = '/admin/page?pid=pageId_1'
                }else{
                    layer.msg(res.message);
                }
            }
        })
        return false;
    });

    //分类删除
    runDel('.delCate', 'tr','api/category/delete');

    //内容添加
    var index =  mod_config.layedit.build('contentEdit');
    mod_config.form.on('submit(addContent)',function (data) {
        var postData;
        postData = {
            title:data.field.title,
            content: mod_config.layedit.getContent(index),
            descrip: data.field.descp,
            category:data.field.category,
            file:data.field.file
        }
        $.ajax({
            url:'/api/content/add',
            type:'POST',
            dataType:'json',
            data:postData,
            success:function (res) {
                console.log(res);
                if(res.code ==0){
                    
                    window.location.href = '/admin/page?pid=pageId_3';
                }else{
                    layer.msg(res.message);
                }
            }
        })
        return false;
    })
    //内容删除
    runDel('.delContent', 'tr', 'api/content/delete');
});

