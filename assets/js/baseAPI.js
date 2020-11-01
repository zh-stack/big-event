$.ajaxPrefilter(function(options){
    options.url = 'http://ajax.frontend.itheima.net'+ options.url
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
})