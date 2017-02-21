"use strict";
var http = require('http');
var Promise =  require('bluebird');
var cheerio = require('cheerio');
var baseUrl = "http://www.imooc.com/learn/";
var videoIds = [75,134,197,259,348,637,728];

function filterChapters(ajaxData) {
    var $ = cheerio.load(ajaxData.html);

    var chapters = $('.chapter');
    var title = $('.course-infos .path span').text();
    var number = ajaxData.watchedNumber;
    // courseData = {
    //     title: title,
    //     number: number,
    //     videos: [{
    //         chapterTitle: '',
    //         videos: {
    //             title: '',
    //             id: ''
    //         }
    //     }]
    // }


    var courseData = {
        title: title,
        number: number,
        videos: []
    }
    var chapter, chapterTitle, intro, chapterTitleStr, videos, chapterData, video, videoTitle, id;
    chapters.each(function (item) {
        chapter = $(this);
        chapter.find('.chapter-content').remove();
        chapter.find('.moco-btn').remove();
        chapterTitle = chapter.find('strong').text().trim();
        videos=chapter.find('.video').children('li');
        chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        }
        videos.each(function(item){
            video = $(this).find('.J-media-item');
            videoTitle = video.text().replace(/\s+/g,'');
            id = video.attr('href').split('video/')[1];
            chapterData.videos.push({
                title: videoTitle,
                id: id
            });
        });

        courseData.videos.push(chapterData);
    });

    return courseData;
}

function printCourseInfo(coursesData) {
    coursesData.forEach( function(courseData) {
        console.log(courseData.number+' 人学过 '+courseData.title+'\n');
    });
    coursesData.forEach( function(courseData) {
        console.log('### '+courseData.title+'\n');
        courseData.videos.forEach( function(item) {
            var chapterTitle = item.chapterTitle;
            console.log(chapterTitle + '\n');
            item.videos.forEach( function(video) {
                console.log('    【'+video.id+'】'+video.title+'\n');
            });
        });
    });
}

function getPageAsync (url) {
    return new Promise(function (resolve, reject) {
        var ajaxData = {
            watchedNumber: 0,
            html: ''
        }
        console.log('正在爬取'+url);
        // ajax get观看人数
        let numbers = new Promise((resolve, reject) => {
            let vid = url.match(/[^http://www.imooc.com/learn/]\d*/);
            let headers = {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding': 'gzip, deflate, sdch',
                'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Cookie': 'imooc_uuid=3a6a7b23-a1cb-4e58-881f-6f01b389d10d; imooc_isnew_ct=1485182108; loginstate=1; apsid=g4NDgzNTVlZDhlZWFkZjBiMDU1MDA2MTJhNmI2NTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMzczNDU0NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3aW41ZG9AcXEuY29tAAAAAAAAAAAAAAAAAAAAAAAAADgzMzg3YzIxYmRkMjNmY2FkZTgwZWFmN2JlZjVjYmIxExWGWBMVhlg%3DYT; last_login_username=win5do%40qq.com; channel=491b6f5ab9637e8f6dffbbdd8806db9b_phpkecheng; PHPSESSID=erl04j809ba73030p4nj47vmd0; imooc_isnew=2; IMCDNS=0; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1485426499,1485446171,1485502103,1485525699; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1485525715; cvde=588b52c05f023-9',
                'Host': 'www.imooc.com',
                'Pragma': 'no-cache',
                'Referer': url,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            }
            let options = {
                hostname: 'www.imooc.com',
                path: `/course/AjaxCourseMembers?ids=${vid}`,
                method: 'GET',
                headers,
            }
            http.get(options, (res) => {
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                })
                res.on('end', () => {
                    ajaxData.watchedNumber = parseInt(JSON.parse(rawData).data[0].numbers);
                    resolve(ajaxData);
                }).on('error', (e) => {
                    reject(e)
                })
            })
        })
        // get网站html
        http.get(url, function (res) {
            var html = '';

            res.on('data', function (data) {
                html += data;
            });

            res.on('end', function () {
                ajaxData.html = html;
                resolve(numbers);
            });
        }).on('error', function (e) {
            reject(e);
            console.log('获取课程数据出错');
        });
    });
}

var fetchCourseArray =[];
// getpageAsync返回的5个promise对象组成的数组
videoIds.forEach( function(id) {
    fetchCourseArray.push(getPageAsync(baseUrl+id));
});

Promise
    .all(fetchCourseArray)
    .then(function (pages) {
        var coursesData = [];

        pages.forEach( function(ajaxData) {
            var courses = filterChapters(ajaxData);
            coursesData.push(courses);
        });

        coursesData.sort(function (a, b) {
            return a.number < b.number;
        });

        printCourseInfo(coursesData);

    });

