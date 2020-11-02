$(function(){
    var layer = layui.layer;
    var form = layui.form;
    function initArtCateList(){
        $.ajax({
            type:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章分类列表失败！');
                }
                // console.log(res);
                var htmlStr = template('tpl-add',res);
                $('tbody').html(htmlStr);
            }
        })
    }
    initArtCateList();
    
    var indexAdd = null;
    $('#art-add').on('click',function(){
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#art-addPage').html()
          })
    })

    $('body').on('submit','#form-add',function(e){
        e.preventDefault();
        $.ajax({
            type:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('新增文章分类失败！');
                }
                layer.msg('新增文章分类成功！');
                initArtCateList();
                layer.close(indexAdd);
            }
        })
    })
    //弹出编辑框
    var indexEdit = null;
    $('tbody').on('click','.btn-edit',function(){
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '修改文章分类',
        content: $('#dialog-edit').html()
      })
        var id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            method:'GET',
            url:'/my/article/cates/' + id,
            success:function(res){
                form.val('form-edit', res.data)
            }
        })
    })
    //修改编辑内容
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
              method: 'POST',
              url: '/my/article/updatecate',
              data: $(this).serialize(),
              success: function(res) {
                if (res.status !== 0) {
                  return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
              }
        })
    })
    //删除内容
    $('tbody').on('click','.btn-renove',function(){
        // console.log(11);
        var id = $(this).attr('data-id')
        // console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/' + id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })
        })
    })


})