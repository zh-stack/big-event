$(function(){
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
          if (value.length > 6) {
            return '昵称长度必须在 1 ~ 6 个字符之间！'
          }
        }
    })
    //初始化用户信息
    function initUserInfo(){
        $.ajax({
            type:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('个人信息请求失败！');
                }
                // console.log(res);
                form.val('formUserInfo',res.data);
            }
        })
    }
    initUserInfo();

    $('#btnReset').on('click',function(e){
        e.preventDefault();
        initUserInfo();
    })

    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更改个人信息失败！');
                }
                layer.msg('更新用户信息成功！');
                window.parent.getUserInfo();
            }
        })
    })
})