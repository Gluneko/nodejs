var http = require('http');
var querystring = require('querystring');

var postData = querystring.stringify({
    'content': 'scott老师好帅',
    'cid': 348
});

var options = {
    hostname: 'www.imooc.com',
    port: 80,
    path: '/course/docomment',
    method: 'POST',
    headers: {
        'Accept':'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding':'gzip, deflate',
        'Accept-Language':'zh-CN,zh;q=0.8',
        'Connection':'keep-alive',
        'Content-Length':postData.length,
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie':'imooc_uuid=a56b1c9a-720a-4730-a6fb-42a6773ce8ab; imooc_isnew_ct=1476928530; loginstate=1; apsid=NhOTAxZjM3ZjI1MjQ4N2IyZDFlMzYzNWQwZDcwMzMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMzcyMzM2OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4NDQ0MTA2MTZAcXEuY29tAAAAAAAAAAAAAAAAAAAAAGE5ZWQxYzc1ZGFlMzU5MzU2MjA0YTEzNjAzMjg4YzVjfjWZWH41mVg%3DNG; last_login_username=844410616%40qq.com; PHPSESSID=95sa4gkkt23k0s9a6o7la6to50; imooc_isnew=2; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1486535248,1486626076,1487260164,1487391157; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1487431425; IMCDNS=0; cvde=58a7c9b1945f6-16',
        'Host':'www.imooc.com',
        'Origin':'http://www.imooc.com',
        'Referer':'http://www.imooc.com/comment/348',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36',
        'X-Requested-With':'XMLHttpRequest'
    }
}

var req = http.request(options, function(res) {
    console.log('Status: ' + res.statusCode);
    console.log('headers: ' + JSON.stringify(res.headers));

    res.on('data', function (chunk) {
        console.log(Buffer.isBuffer(chunk));
        console.log(typeof chunk);
    });

    res.on('end', function () {
        console.log('评论完毕！');
    });

});

req.on('error', function (e) {
    console.log('Error: ' + e.message);
});

req.write(postData);

req.end();