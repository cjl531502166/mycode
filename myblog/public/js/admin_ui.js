
//注册layui 模块
layui.use(['form', 'element', 'table'],function () {
    //模块加载
    var mod_config = {
        form:layui.form,
        element:layui.element,
        table:layui.table,
        editorInit: function (ele) {
            if(!$(ele)[0]) return false;
            window.editor = new window.wangEditor(ele);
            editor.customConfig.zIndex = 100;
            editor.create();
        }
    }
    //初始化编辑器
    mod_config.editorInit('#Editor');
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
                        layer.close(index);
                    }
                });
            })
        })
    }
    //分类操作
    var operatCate = function (submitOption,ajaxApi,ajaxType) {
        mod_config.form.on('submit('+submitOption+')',function (data) {
            var loadIndex = layer.load(1, { shade: [0.4, '#fff'] });
            $.ajax({
                url:ajaxApi,
                type:ajaxType,
                data:data.field,
                success:function (res) {
                    if (res.code == 0) {
                        window.location.href = '/admin/page?pid=pageId_1'
                    } else {
                        layer.msg(res.message);
                    }
                    layer.close(loadIndex);
                }
            })
            return false;
        })
    }
    //内容操作
    var operateContent = function (submitOption,ajaxApi,ajaxType) {
        mod_config.form.on('submit('+submitOption+')',function (data) {
            var loadIndex = layer.load(1, { shade: [0.4, '#fff'] })
            ,postData = {
                title: data.field.title,
                content: editor.txt.html(),
                descrip: data.field.descp,
                category: data.field.category,
                id:data.field.id
            }
            $.ajax({
                url:ajaxApi,
                type:ajaxType,
                data: postData,
                dataType:'json',
                success:function (res) {
                    if (res.code == 0) {
                        window.location.href = '/admin/page?pid=pageId_3'
                    } else {
                        layer.msg(res.message, { icon: 5 });
                    }
                    layer.close(loadIndex);
                }
            })
            return false;
        })
    }
    //登陆
    mod_config.form.on('submit(formLogin)', function (data) {
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

    //注册
    mod_config.form.on('submit(formRegister)',function (data) {
        var loadIndex = layer.load(1, { shade: [0.4, '#fff'] });
        $.ajax({
            url:'/api/register',
            type:'post',
            dataType:'json',
            data:data.field,
            success:function (result) {
                layer.close(loadIndex);
                if(result.code !=0){
                    layer.msg(result.message);
                }else{
                    window.location.href= '/admin/index';
                }
            }
        })
    })

    //用户删除
    runDel('.delUser', 'tr', 'api/user/delete');

    //资料更新
    mod_config.form.on('submit(editInfo)',function (data) {
        console.log(data.field);
    })

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
    operatCate('addCate','/api/category/add','POST');
    // 分类修改
    operatCate('editCate', '/api/category/edit', 'POST')
    //分类删除
    runDel('.delCate', 'tr','api/category/delete');
    
    //内容添加
    operateContent('addContent','/api/content/add','POST');
    //内容修改
    operateContent('editContent', '/api/content/edit', 'POST');
    //内容删除
    runDel('.delContent', 'tr', 'api/content/delete');
});

