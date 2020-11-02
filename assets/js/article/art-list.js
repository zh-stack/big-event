$(function(){
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  template.defaults.imports.dataFormat = function(date){
      var dt = new Date(date);

      var y = dt.getFullYear();
      var m = dt.getMonth() + 1;
      m = m<10? '0'+m:m;
      var d = dt.getDate();
      d = d<10? '0'+d:d;
      var h = dt.getHours();
      h = h<10? '0'+h:h;
      var mm = dt.getMinutes();
      mm = mm<10? '0'+mm:mm;
      var s = dt.getSeconds();
      s = s<10? '0'+s:s;

      return y+'-'+m+'-'+d+' '+h+':'+mm+':'+s
  }

  function initTable(){
      $.ajax({
          type:'GET',
          url:'/my/article/list',
          data:q,
          success:function(res){
            //   console.log(res);
              if(res.status !== 0){
                  return layer.msg('获取文章列表失败！');
              }
              var htmlStr = template('tpl-table',res);
              $('tbody').html(htmlStr);
              renderPage(res.total);
          }
      })
  }
  initTable();

  function initCate(){
      $.ajax({
          type:'GET',
          url:'/my/article/cates',
          success:function(res){
              if(res.status !== 0){
                  return layer.msg('获取分类数据失败！');
              }
              var htmlStr = template('tpl-cate',res);
              $('[name=cate_id]').html(htmlStr);
              form.render();
          }
      })
  }

  initCate();

  $('#form-search').on('submit',function(e){
      e.preventDefault();
      var cate_id = $('[name=cate_id]').val();
      var state = $('[name=state]').val();
      q.cate_id = cate_id;
      q.state = state;
      initTable();
  })

  function renderPage(total){
     // 调用 laypage.render() 方法来渲染分页的结构
     laypage.render({
        elem: 'pageBox', // 分页容器的 Id
        count: total, // 总数据条数
        limit: q.pagesize, // 每页显示几条数据
        curr: q.pagenum, // 设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits:[2,3,4,5,10],
        jump:function(obj,first){
            // console.log(obj.curr);
            q.pagenum = obj.curr;
            // console.log(first);
            // console.log(obj.limit);
            if (!first){
                initTable();
            }
        }
      })
  }

  $('tbody').on('click','.btn-delet',function(){
      var len = $('.btn-delet').length;
    //   console.log(len);
    //   console.log(11);
    var id = $(this).attr('data-id');
    // console.log(id);
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
        $.ajax({
            type:'GET',
            url:'/my/article/delete/' + id,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('删除文章失败！');
                }
                layer.msg('删除文章成功！');
                if(len === 1){
                    q.pagenum = q.pagenum === 1? 1:q.pagenum - 1;
                }
                initTable();
                layer.close(index);
            }
        })
    })    
  })
})