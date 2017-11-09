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
$('#logOut').on('click', function () {
    $.post('/api/logout', {}, function (data) {
        window.location.reload();
    })
})
//后台内容面板交互
layui.use('element', function () {
    var layerElem = layui.element;
    //侧栏tab选项卡添加
    layerElem.on('nav(nav-control)',function (ele) {
        var data_id = $(this).find("a").data('id');
        if(!$(this).hasClass('on')){
            layerElem.tabAdd('content', {
                title: ele[0].innerText,
                content:"<table class='layui-table' id="+data_id+"></table>",
                id: data_id
            });
        }
        layerElem.tabChange('content', data_id)
        $(this).attr('id',data_id).addClass('on');
    })
    layerElem.on('tabDelete(content)',function (data) {
        var id = data.index;
        $('#tab_'+id).removeClass('on');
    });
    layerElem.on('tab(content)',function (data) {
        var pageId = 'pageId_' + data.index;
        $.ajax({
            url:'/api/user',
            type:'get',
            data: {pid:pageId},
            dataType:'json',
            success:function (res) {
                
            }
        })
    })
});