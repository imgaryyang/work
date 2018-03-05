// var patt_min =  /\.min\.css$/;
// var result1 = patt_min.test("bootstrap.min.css");
// console.info(result1);
// var result2 = patt_min.test("bootstrap.css");
// console.info(result2);

//var patt_css =  /[^(\.min)]\.css$/;
//var patt_css = /(?!.*\.min\.css)\.css$/;
// var patt_css =  /[^(\.min\.)]\.css$/;

// var result3 = patt_css.test("BootStrap.css");
// console.info(result3);
// var result4 = patt_css.test("bootstrap.min.css");
// console.info(result4);
// var result5 = patt_css.test("bootstrap.min.a.css");
// console.info(result5);
// var result6 = patt_css.test("bootstrap.mina.css");
// console.info(result6);
// var result7 = patt_css.test("bootstrapmin.css");
// console.info(result7);

// var result7 = patt_css.test("AppointMain.css");
// console.info(result7);

// var patt_test = /^((?!min).)*$/;

// console.info("bootstrap.min.css ", patt_test.test("bootstrap.min.css"));
// console.info("bootstrapmin.css ", patt_test.test("bootstrapmin.css"));
// console.info("AppointMain.css ", patt_test.test("AppointMain.css"));


// var pattern = /\/[^\.\/]+\.css$/;
// var url = 'http://www.xxx.com/a.css';
// var url2 = 'http://www.xxx.com/a.min.css';
// console.log(pattern.test(url));
// console.log(pattern.test(url2));
// console.info("bootstrapmin.css ",pattern.test("bootstrapmin.css"));

var regx = /^(?!.*\.min).*\.css/;
console.info('bootstrapmin.css ',regx.test('bootstrapmin.css'));
console.info('bootstrap.min.css ',regx.test('bootstrap.min.css'));
console.info('AppointMain.css ',regx.test('./AppointMain.css'));