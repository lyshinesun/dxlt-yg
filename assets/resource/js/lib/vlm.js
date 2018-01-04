/*
 * vlm.js
 * out_api:common assembly
 * author:qzz
 * 2016-12-28
 * ver:1.0
 */
(function (e, t) {
    var n = n || (function (n) {
                // var _api = location.protocol + "//223.71.146.194:8006/api/GetServiceApiResult",
                var _api = location.protocol + "//192.168.2.214:8001/api/GetServiceApiResult",
                // serverAddr = "http://223.71.146.194:8003/dxsky/",
                serverAddr = "http://192.168.2.214:8011/dxsky/",
                lStorage = window.localStorage,
                sStorage = window.sessionStorage,
                _Utils = {
                    //补零
                    format_add_zero: function (time) {
                        if (parseInt(time) < 10) {
                            return "0" + time;
                        } else {
                            return time;
                        }
                    },
                    trim: function (str) {
                        return str = str.replace(/(^\s*)|(\s*$)/g, "")
                    },
                    //格式化日期
                    format_date: function (dtime, format) {
                        var stringTime = dtime.replace('-', "/").replace('-', "/").replace('T', " ");
                        var newDate = new Date(stringTime);
                        var year = newDate.getFullYear();
                        var yy = year.toString(),
                            yy = yy.substr(-2),
                            month = parseInt(newDate.getMonth()) + 1,
                            day = parseInt(newDate.getDate());
                        var hour = newDate.getHours(),
                            minutes = parseInt(newDate.getMinutes()),
                            seconds = parseInt(newDate.getSeconds());
                        month = month < 10 ? '0' + month : month;
                        day = day < 10 ? '0' + day : day;
                        hour = hour < 10 ? '0' + hour : hour;
                        minutes = minutes < 10 ? '0' + minutes : minutes;
                        seconds = seconds < 10 ? '0' + seconds : seconds;
                        var timeStr;
                        format = typeof format == 'undefined' ? '' : format;
                        if (format == 'YmdHi') {
                            timeStr = year + '' + month + '' + day + '' + hour + '' + minutes;
                        } else if (format == 'YmdHispace') {
                            timeStr = year + '-' + month + '-' + day + ' 23:59';
                        } else if (format == 'YmdHizero') {
                            timeStr = year + '-' + month + '-' + day + ' 00:00';
                        } else if (format == 'YmdHis') {
                            timeStr = year + '' + month + '' + day + '' + hour + '' + minutes + '' + seconds;
                        } else if (format == 'Ymd') {
                            timeStr = year + '' + month + '' + day;
                        } else if (format == 'ymd') {
                            timeStr = yy + '' + month + '' + day;
                        } else if (format == 'md') {
                            timeStr = month + '月' + day + "日";
                        } else if (format == 'cymd') {
                            timeStr = year + '年' + month + '月' + day + "日";
                        } else if (format == 'hm') {
                            timeStr = hour + '' + minutes
                        } else {
                            timeStr = month + '' + day;
                        }
                        return timeStr;
                    },

                    //当天00:00:00
                    currentDay: function () {
                        var d = new Date();
                        d.setHours(0, 0, 0);
                        var month = d.getMonth() + 1;
                        var day = d.getDate();
                        var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
                        var minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
                        var second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();

                        if (month < 10) {
                            month = "0" + month;
                        }
                        if (day < 10) {
                            day = "0" + day;
                        }
                        var val = d.getFullYear() + '' + month + '' + day + '' + hour + '' + minute + '' + second;
                        return val;
                    },

                    currentNight: function () {
                        var d = new Date();
                        d.setHours(23, 59, 59);
                        var month = d.getMonth() + 1;
                        if (month < 10) {
                            month = "0" + month;
                        }
                        var day = d.getDate();
                        if (day < 10) {
                            day = "0" + day;
                        }
                        var val = d.getFullYear() + '' + month + '' + day + '235959';
                        return val;
                    },

                    //当月1号00:00:00
                    currentMonth: function () {
                        var d = new Date();
                        d.setDate(1);
                        d.setHours(0, 0, 0);
                        var month = d.getMonth() + 1;
                        var day = d.getDate();
                        var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
                        var minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
                        var second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();

                        if (month < 10) {
                            month = "0" + month;
                        }
                        if (day < 10) {
                            day = "0" + day;
                        }
                        var val = d.getFullYear() + '' + month + '' + day + '' + hour + '' + minute + '' + second;
                        return val;
                    },

                    //当年1月1号0000
                    currentYear: function () {
                        var d = new Date();
                        var val = d.getFullYear() + '0101000000';
                        return val;
                    },

                    //明年1月1号0000
                    nextYear: function () {
                        var d = new Date();
                        var val = (d.getFullYear() + 1) + '0101000000';
                        return val;
                    },

                    //获取日期时间
                    GetDay: function (now_day, now_year, now_mon) {
                        //console.log(now_day+":"+now_year+":"+now_mon);
                        var today = new Date();
                        if (now_day) {
                            var _time = 1000 * 60 * 60 * 24 * now_day;
                            var yesterday_milliseconds = today.getTime() - _time;
                        } else {
                            var yesterday_milliseconds = today.getTime();
                        }
                        var yesterday = new Date();
                        yesterday.setTime(yesterday_milliseconds);
                        var strYear = yesterday.getFullYear();
                        if (now_year) {
                            strYear = strYear - now_year;
                        }
                        var strDay = yesterday.getDate();
                        //console.log(strDay);
                        var strMonth = yesterday.getMonth() + 1;
                        if (now_mon) {
                            if (strMonth - now_mon <= 0) {
                                strYear = strYear - 1;
                                strMonth = strMonth + 12 - now_mon;
                            } else {
                                strMonth = strMonth - now_mon;
                            }
                        }
                        var strHours = yesterday.getHours(); //获取当前小时数(0-23)
                        var strMin = yesterday.getMinutes();
                        if (strDay < 10)
                            strDay = "0" + strDay;//获取当前分钟数(0-59)
                        if (strMonth < 10)
                            strMonth = "0" + strMonth;
                        if (strHours < 10)
                            strHours = "0" + strHours;
                        if (strMin < 10)
                            strMin = "0" + strMin;
                        return strYesterday = strYear + "-" + strMonth + "-" + strDay + " "
                            + strHours + ":" + strMin;
                    },

                    getlastday: function (year, month) {
                        var new_year = year;    //取当前地年份
                        var new_month = month++;//取下一个月地第一天，方便计算（最后一天不固定）
                        if (month > 12)            //如果当前大于12月，则年份转到下一年
                        {
                            new_month -= 12;        //月份减
                            new_year++;            //年份增
                        }
                        var new_date = new Date(new_year, new_month, 1);                //取当年当月中地第一天
                        var s = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
                        //s = eval(s+1);
                        return s;//获取当月最后一天日期
                    },

                    //得到日期是一年中的第几周
                    getWeekNumber: function () {
                        // Copy date so don't modify original
                        var nowD = new Date();
                        var d = new Date(nowD.getFullYear(), nowD.getMonth(), nowD.getDate());
                        // Set to nearest Thursday: current date + 4 - current day number
                        // Make Sunday's day number 7
                        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
                        // Get first day of year
                        var yearStart = new Date(d.getFullYear(), 0, 1);
                        // Calculate full weeks to nearest Thursday
                        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1) / 7);
                        // Return array of year and week number
                        var getFullYear = d.getFullYear();
                        var getWeekNo = weekNo;
                        return [getFullYear, getWeekNo];
                    },

                    //判断某年某月某日是星期几
                    getWeekDay: function (month, day, year) {
                        var arr = ["日", "一", "二", "三", "四", "五", "六"], weekDay;
                        today = new Date();
                        year = year || today.getFullYear();
                        today.setFullYear(year, month - 1, day);
                        weekDay = today.getDay();
                        return arr[weekDay];
                    },

                    getDateStrBefore: function (time_curr, num) {

                        var str = time_curr.replace(/-/g, "/");
                        var date = new Date(str);
                        var milliseconds1 = date.getTime() - 1000 * 60 * 60 * 24 * num;
                        var newdata1 = new Date();
                        newdata1.setTime(milliseconds1);
                        var strYear1 = newdata1.getFullYear();
                        var strDay1 = newdata1.getDate();
                        var strMonth1 = newdata1.getMonth() + 1;
                        if (strMonth1 < 10) {
                            strMonth1 = "0" + strMonth1;
                        }
                        if (strDay1 < 10) {
                            strDay1 = "0" + strDay1;
                        }
                        return strYear1 + "-" + strMonth1 + "-" + strDay1 + " 00:00";
                    },

                    getDateStrAfter: function (time_curr, num) {
                        var str = time_curr.replace(/-/g, "/");
                        var date = new Date(str);
                        var milliseconds = date.getTime() + 1000 * 60 * 60 * 24 * num;
                        var newdata = new Date();
                        newdata.setTime(milliseconds);
                        var strYear = newdata.getFullYear();
                        var strDay = newdata.getDate();
                        var strMonth = newdata.getMonth() + 1;
                        if (strMonth < 10) {
                            strMonth = "0" + strMonth;
                        }
                        if (strDay < 10) {
                            strDay = "0" + strDay;
                        }
                        return strYear + "-" + strMonth + "-" + strDay + " 23:59";
                    },

                    //日期格式化成yyyy-mm-dd
                    dateToString: function (date) {
                        if (date instanceof Date) {
                            var month = date.getMonth() + 1;
                            var day = date.getDate();
                            if (month < 10)
                                month = "0" + month;//获取当前分钟数(0-59)
                            if (day < 10)
                                day = "0" + day;
                            return date.getFullYear() + "-" + month + "-" + day;
                        } else {
                            return date;
                        }
                    },

                    //格式验证
                    validate: {
                        isNoEmpty: function (obj) {
                            if (obj == "") {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    },

                    getTrueDate: function (type) {
                        var oDate = new Date();
                        var y = oDate.getFullYear();
                        var m = oDate.getMonth() + 1;
                        var d = oDate.getDate();
                        var str = '';
                        if (type == undefined || type == 'day') {
                            str = y + '/' + vlm.Utils.format_add_zero(m) + '/' + vlm.Utils.format_add_zero(d);
                        } else if (type == 'month') {
                            str = y + '/' + vlm.Utils.format_add_zero(m);
                        } else if (type == 'year') {
                            str = y;
                        }
                        return str;
                    },

                    //根据某一数值排序
                    sortArr: function (arr, sortType, val) { //数组 排序类型1,2  排序字符串
                        if (arr && arr.length > 0) {
                            if (sortType == 1) {
                                for (var i = 0; i < arr.length - 1; i++) {
                                    var index = i;
                                    for (var j = i + 1; j < arr.length; j++) {
                                        var temVal = arr[index][val];
                                        var curVal = arr[j][val];
                                        if (($.isNumeric(temVal) && $.isNumeric(curVal) && curVal > temVal) || (!$.isNumeric(temVal)) && $.isNumeric(curVal)) {
                                            index = j;
                                        }
                                    }
                                    var tem = arr[index];
                                    arr[index] = arr[i];
                                    arr[i] = tem;
                                }
                            } else {
                                for (var i = 0; i < arr.length - 1; i++) {
                                    var index = i;
                                    for (var j = i + 1; j < arr.length; j++) {
                                        var temVal = arr[index][val];
                                        var curVal = arr[j][val];
                                        if (($.isNumeric(temVal) && $.isNumeric(curVal) && curVal < temVal) || (($.isNumeric(temVal)) && !$.isNumeric(curVal))) {
                                            index = j;
                                        }
                                    }
                                    var tem = arr[index];
                                    arr[index] = arr[i];
                                    arr[i] = tem;
                                }
                            }
                        }
                        return arr;
                    },

                    //分页
                    pagination: function (containerId, pageObj, searchObj) {
                        var totalCount = pageObj.totalCount;
                        var perPageCount = pageObj.perPageCount ? pageObj.perPageCount : 10;
                        var callback = pageObj.callback;
                        var currentPage = pageObj.currentPage;
                        $("#" + containerId).pagination(totalCount, {
                            items_per_page: perPageCount,
                            num_display_entries: 6,
                            current_page: currentPage,
                            num_edge_entries: 1,
                            callback: pageselectCallback
                        });

                        function pageselectCallback(page_id, jq) {
                            $.extend(searchObj, {
                                "page": page_id + 1,
                                "rows": perPageCount
                            });
                            callback(searchObj, false);
                        }

                    },

                    //前端静态分页
                    Jpage: function (containerId, pageObj) {
                        var totalCount = pageObj.totalCount;
                        var perPageCount = pageObj.perPageCount ? pageObj.perPageCount : 10;
                        var callback = pageObj.callback;
                        $("#" + containerId).pagination(totalCount, {
                            items_per_page: perPageCount,
                            num_display_entries: 6,
                            current_page: 0,
                            num_edge_entries: 1,
                            callback: pageselectCallback
                        });

                        function pageselectCallback(page_id, jq) {
                            callback(page_id);
                        }

                    },
                    //数据数量级和单位匹配处理
                    computeNumberLength (n) {
                        try {
                            var avgLth = parseInt(Math.abs(n)).toString().length;
                            if (avgLth < 4) return {number: n.toFixed(2), unit: '万kwh', full: n.toFixed(2) + '万kwh'};
                            if (avgLth < 8) return {number: (n / 10000).toFixed(2), unit: '亿kwh', full: (n / 10000).toFixed(2) + '亿kwh'};
                            // if (avgLth < 12) return {number: (n / 100000000).toFixed(2), unit: '亿kwh', full: (n / 100000000).toFixed(2) + '亿kwh'};
                            // if (avgLth < 16) return {number: (n / 1000000000000).toFixed(2), unit: '万亿kwh', full: (n / 1000000000000).toFixed(2) + '万亿元'}
                        } catch (err) {
                            console.log('计算单位出错,错误信息:', err)
                        }
                    },
                },
                loadJson = function (url, data, mycallback, async, encryption, isShowLoading) {

                    data = JSON.parse(data);
                    data = JSON.stringify(data);

                    function isObject(value) {
                        var type = typeof value;
                        return !!value && (type == 'object' || type == 'function');
                    }

                    /**
                     * mycallback
                     * 1. 必传success<function>，服务器返回调用success
                     * 2. 可选{success, error}<object>，服务器返回调用mycallback，服务器失败调用mycallback.error
                     */
                    if (isObject(mycallback)) {
                        var error = mycallback.error;
                    }

                    /**
                     * 默认传入undefined，全屏显示loading
                     * 传入true，不全屏显示loading
                     * 传入'nothing'，什么也不显示自由控制
                     *
                     * ajaxStop结束后，$(window).off('ajaxStart')结束全局ajax
                     *
                     * @param {boolean|null|undefinde|'nothing'} isShowLoading
                     */
                    if (isShowLoading === true) {
                        $(t).ajaxStart(function () {
                            $("#preloader").hide();
                            $('#status').hide();
                        }).ajaxStop(function () {
                            $("#preloader").hide();
                            $('#status').show();
                            $(t).off('ajaxStart');
                            $(t).off('ajaxStop');
                        });

                    } else if (isShowLoading === undefined || isShowLoading === null || isShowLoading === false) {
                        // 1.8以后，ajaxStart要绑定到document
                        $(t).ajaxStart(function () {
                            $("#preloader").show();
                            $('#status').show();
                        }).ajaxStop(function () {
                            $("#preloader").hide();
                            $('#status').show();
                            $(t).off('ajaxStart');
                            $(t).off('ajaxStop');
                        });

                    } else if (isShowLoading === 'nothing') {
                    }
                    if (async != undefined && async == true) {
                        $.ajaxSetup({
                            async: false
                        });
                    }
                    ;
                    var apiUrl = url == "" ? _api : url;
                    $.ajax({
                        type: "post",
                        dataType: 'json',
                        // type: "get",
                        url: apiUrl + '?rnd=' + Math.random(),
                        timeout: 1000 * 60 * 5,
                        data: data,
                        contentType: 'application/json;charset=utf-8',
                        beforeSend: function (xhr) {
                            //xhr.setRequestHeader("Accept-Encoding", "gzip");
                            //xhr.setRequestHeader('Content-Type','application/json');

                        },
                        success: function (jsondata) {
                            mycallback(jsondata);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            /**
                             * @param {Object} XMLHttpRequest
                             * @param {String} textStatus
                             * @param {String} errorThrown
                             *
                             * error = mycallback.error
                             */
                            if (textStatus == 'timeout') {
                                alert("网络不给力，刷新重试！");
                                window.location.reload();
                            } else if (textStatus == 'error') {
                                error && error(arguments);
                            }
                        }
                    });
                    $.ajaxSetup({
                        async: true
                    });
                },
                _checklogin = function (c) {
                    if (!sStorage.userid || sStorage.userid == '' || sStorage.login != 1) { //need login
                        window.location.href = c;
                        return false;
                    } else {
                        return true;
                    }

                },
                // 获取并网电站列表
                getConnectedStations = function (callback) {
                    var stationList = []
                    $.ajax({
                    url: serverAddr + "stationbaseinfo/getPsList",    //请求地址
                    dataType: "json",
                    type : "GET",
                    success:function(res){
                            callback(res)
                        }
                    });
                };
            //out api
            return {
                api: _api,
                serverAddr: serverAddr,
                loadJson: loadJson,
                checkLogin: _checklogin,
                getConnectedStations: getConnectedStations,
                Utils: _Utils
            };
        })();
    if (typeof module !== "undefined" && module.exports) {
        module.exports = n;
    }
    if (typeof ender === "undefined") {
        this.vlm = n;
    }
    if (typeof define === "function" && define.amd) {
        define("vlm", ['jquery'], function ($) {
            return n;
        });
    }
}).call(this, window, document);












