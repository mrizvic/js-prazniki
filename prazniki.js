var myAppName=__filename;

var app_host = process.env.APP_HOST;
var app_port = process.env.APP_PORT;

// if environment variables are not present then assume its development mode
var host = app_host ? app_host : '127.0.0.1';
var port = app_port ? app_port : 8007;

var myURL = 'http://' + host + ':' + port;

// counters
var apiRequests=0;
var counterGet=0;
var counterPutPost=0;
var counterDelete=0;

// set to 1 to enable debug messages
var debug = 1;

require("console-stamp")(console, "yyyy-mm-dd HH:MM:ss.l");
console.info('PID: ' + process.pid)
console.info('Application name: ' + myAppName)


var express = require('express');
var app = express();


// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', myURL);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// Log request and populate counters
app.use(function (req, res, next) {
    apiRequests++;
    if (req.method == 'GET') {
        counterGet++;
    } else if ( (req.method == 'POST') || (req.method == 'PUT') ) {
        counterPutPost++;
    } else if ( req.method == 'DELETE' ) {
        counterDelete++;
    }
    req.mylogger = req.method + ' ' + req.url + ' ' + JSON.stringify(req.params) + ' ' + JSON.stringify(req.signedCookies);
    console.log(req.mylogger);
    next();
});


var mydebug = function(message) {
    if (debug) {
        console.debug(message);
    }
};

var getEasterDate = function(year) {
  var a = year % 19;
  var b = Math.floor(year / 100);
  var c = year % 100;
  var d = Math.floor(b / 4); 
  var e = b % 4;
  var f = Math.floor((b + 8) / 25);
  var g = Math.floor((b - f + 1) / 3); 
  var h = (19 * a + b - d - g + 15) % 30;
  var i = Math.floor(c / 4);
  var k = c % 4;
  var l = (32 + 2 * e + 2 * i - h - k) % 7;
  var m = Math.floor((a + 11 * h + 22 * l) / 451);
  var n0 = (h + l + 7 * m + 114)
  var n = Math.floor(n0 / 31) - 1;
  var p = n0 % 31 + 1;
  var date = new Date(year,n,p);
  return date; 
}

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

var getDateInfo = function(dateInput) {
    var resp = {};
    var date = new Date(dateInput);

    if (date == "Invalid Date") {
      resp['error']=date;
      return resp;
    }

    if (date.getFullYear() < 2013) {
      resp['error'] = "Samo datumi od 1.1.2013 dalje";
      return resp;
    }

    var isHoliday=false;
    var holidayString = "";

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var weekday = date.getDay();
    if (weekday == 0) { weekday = 7; }

    // SUNDAY OR SATURDAY
    var isWeekend = (weekday > 5);
    var isBusinessDay = ! isWeekend;

    // EASTER SUNDAY
    var easterDate = getEasterDate(year);
    var ed1 = easterDate.getDate();
    var em1 = easterDate.getMonth() + 1;

    // EASTER MONDAY
    var easterMonday = easterDate.addDays(1);
    var ed2 = easterMonday.getDate();
    var em2 = easterMonday.getMonth() + 1;

    // BINKOSTNA NEDELJA = (EASTER SUNDAY + 49) - 50 DAN PO VELIKI NOCI
    var binkost1 = easterDate.addDays(49);
    var bd1 = binkost1.getDate();
    var bm1 = binkost1.getMonth() + 1;

    // BINKOSTNI PONEDELJEK
    var binkost2 = easterDate.addDays(50);
    var bd2 = binkost2.getDate();
    var bm2 = binkost2.getMonth() + 1;

    var isLeapYear = new Date(year, 1, 29).getMonth() == 1

         if ( (month==1)   && (day==1)   ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Novo leto"; }
    else if ( (month==1)   && (day==2)   ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Novo leto"; }
    else if ( (month==2)   && (day==8)   ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Prešernov dan"; }
    else if ( (month==em1) && (day==ed1) ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Velika noč"; }
    else if ( (month==em2) && (day==ed2) ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Velikončni ponedeljek"; }
    else if ( (month==4)   && (day==27)  ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Dan boja proti okupatorju"; }
    else if ( (month==5)   && (day==1)   ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Praznik dela"; }
    else if ( (month==5)   && (day==2)   ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Praznik dela"; }
    else if ( (month==bm1) && (day==bd1) ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Binkoštna nedelja"; }
    else if ( (month==bm2) && (day==bd2) ) { isHoliday=true; isBusinessDay=isBusinessDay && true;  holidayString = "Binkoštni ponedeljek"; }
    else if ( (month==6)   && (day==8)   ) { isHoliday=true; isBusinessDay=isBusinessDay && true;  holidayString = "Dan Primoža Trubarja";}
    else if ( (month==6)   && (day==25)  ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Dan državnosti"; }
    else if ( (month==8)   && (day==15)  ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Marijino vnebovzetje"; }
    else if ( (month==8)   && (day==17)  ) { isHoliday=true; isBusinessDay=isBusinessDay && true;  holidayString = "združitev prekmurskih Slovencev z matičnim narodom";}
    else if ( (month==9)   && (day==15)  ) { isHoliday=true; isBusinessDay=isBusinessDay && true;  holidayString = "vrnitev Primorske k matični domovini";}
    else if ( (month==10)  && (day==25)  ) { isHoliday=true; isBusinessDay=isBusinessDay && true;  holidayString = "Dan suverenosti"; }
    else if ( (month==10)  && (day==31)  ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Dan reformacije"; }
    else if ( (month==11)  && (day==1)   ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Dan spomina na mrtve"; }
    else if ( (month==11)  && (day==23)  ) { isHoliday=true; isBusinessDay=isBusinessDay && true;  holidayString = "Dan Rudolfa Maistra"; }
    else if ( (month==12)  && (day==25)  ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Božič"; }
    else if ( (month==12)  && (day==26)  ) { isHoliday=true; isBusinessDay=isBusinessDay && false; holidayString = "Dan samostojnosti in enotnosti"; }


    resp['datum']=date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
    resp['holiday']=isHoliday;
    resp['businessday']=isBusinessDay;
    resp['weekend']=isWeekend;
    resp['weekday']=weekday;
    resp['leapyear']=isLeapYear;
    if (holidayString.length > 0) {
      resp['holiday_name']=holidayString;
    }

    return resp;
};

app.get('/infonow', function(req, res) {
    var resp = {};
    var date = new Date();

    resp = getDateInfo(date);

    res.send(resp);
});

app.get('/getTime/:cmd', function(req, res) {
    var resp = {};
    var date = new Date();
    var cmd = req.params.cmd;

    if (cmd == 'epoch') { resp = date.getTime() / 1000; }
    else if (cmd == 'local') { resp = date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + ' ' + date.toTimeString(); }
    else if (cmd == 'utc') { resp = date.toUTCString(); }

    res.send('' + resp);
    return;
});

app.get('/:cmd/now', function(req, res) {
    var cmd = req.params.cmd;
    var resp={};
    var date = new Date();

    resp = getDateInfo(date);

    if (cmd == 'info') {
      res.send(resp);
    } else if (cmd == 'tariff') {
        resp[cmd] = 'MT';
        // VT every business day between 6:00 and 22:00
        if ( ( resp['businessday'] == true ) && ( (date.getHours() > 5) || (date.getHours() < 22) ) ) {
                resp[cmd] = 'VT';
        }
        res.send(resp[cmd]);
        return;
    } else {
      if (typeof resp[cmd] === 'undefined') {
        res.send('ERROR: ' + cmd + ' undefined');
        return;
      }
      res.send('' + resp[cmd]);
      return;
    }

});

app.get('/:cmd/:year(\\d+)/:month(\\d+)/:day(\\d+)', function(req, res) {
    var year = req.params.year;
    var month = req.params.month;
    var day = req.params.day;
    var cmd = req.params.cmd;
    var resp = {};

    var date = new Date(year, month-1, day);
    resp = getDateInfo(date);

    if (cmd == 'info') {
      res.send(resp);
    } else {
      if (typeof resp[cmd] === 'undefined') {
        res.send('ERROR: ' + cmd + ' undefined');
        return;
      }
      res.send('' + resp[cmd]);
      return;
    }

});

/*
app.get('/businessday/:year(\\d+)/:month(\\d+)/:day(\\d+)', function(req, res) {
    var year = req.params.year;
    var month = req.params.month;
    var day = req.params.day;
    var resp = {};

    var date = new Date(year, month-1, day);
    resp = getDateInfo(date);

    res.send(resp['businessday']);
});
*/


// get some stats
var printStatistics = function() {
    console.info('API requests: ' + apiRequests);
    console.info('GET requests: ' + counterGet);
    console.info('PUT/POST requests: ' + counterPutPost);
    console.info('DELETE requests: ' + counterDelete);
};

var signalHandler = function() {
    console.log('We-should-cleanup signal catched.. shutting down');

    console.log('closing application socket');
    try {
        server.close();
    }
    catch(e) {
        console.error('server.close() error: ' + e);
    }

    console.log('Statistics');
    printStatistics();

}


var server = app.listen(port, host, function() {
    console.log('Listening at http://%s:%s', host, port)
});



// catch some signals
//process.on('exit', signalHandler);
process.on('SIGINT', signalHandler);
process.on('SIGHUP', signalHandler);
process.on('SIGTERM', signalHandler);
// process.on('SIGUSR2', printStatistics);
// uncomment this if you use nodemon
process.on('SIGUSR2', signalHandler);

process.on('uncaughtException', function(err) {
    if (err.code == 'EADDRINUSE') {
        console.error('unable to listen on %s:%s , %s', host, port, err);
    } else {
        console.error(err); 
    }
});

