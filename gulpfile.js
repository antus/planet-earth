/* eslint-disable no-undef */
//Current code source: https://github.com/muyao1987/web-dist

//Load the gulp package first in gulpfile, because this package provides some APIs
const gulp = require("gulp")
const babel = require("gulp-babel")
const plumber = require("gulp-plumber")
const babelCore = require("@babel/core")
const utf8Convert = require("gulp-utf8-convert")
const uglify = require("gulp-uglify")
const header = require("gulp-header")
const htmlmin = require("gulp-htmlmin")
const cheerio = require("gulp-cheerio")
const cssmin = require("gulp-clean-css")

const fs = require("fs")
const path = require("path")

////////////////////////////The following parameters can be adjusted according to the actual situation////////////////// ////
const copyright = "Copyright Mars Technology http://marsgis.cn"

//Files modified after this time will not be processed (used during incremental updates)
let lastTime

//Exclude file type suffixes that are not copied
const noCopyFileType = [".psd", ".doc", ".docx", ".txt", ".md", ".zip", ".rar"]

//Exclude directories that are not copied
const noCopyPathDef = [
  ".svn",
  ".git",
  "dist",
  "node_modules",
  ".eslintrc",
  ".editorconfig",
  ".eslintignore",
  ".prettierrc",
  ".vscode",
  "LICENSE",
  "gulpfile.js",
  "package.json",
  "package-lock.json",
  "-src."
]

//Define the directory to be copied directly without compression and obfuscation
const noPipePathDef = ["lib"]
/////////////////////Custom settings//////////////////////

//Need to compress the obfuscated root directory
let srcPath = "./"

//generated target directory
let distPath = "dist"

let noPipePath = []
let noCopyPath = ["example-dev", "example-test"]

// lastTime = new Date("2022-08-01 08:00:00")

/////////////////////Compression confusion//////////////////////

const fileList = []
gulp.task("build", (done) => {
  // console.log('--------Code compilation starts--------');

  console.log("Start processing directory: " + srcPath)
  console.log("Generate to directory: " + distPath)

  travel(srcPath)

  fileList.forEach((t) => {
    let srcFile = t.pathname
    const outFilePath = distPath
    // console.log('Read: ' + srcFile + '\nOutput: ' + outFilePath + '\n');

    let stat = fs.statSync(srcFile)
    if (lastTime != null && stat.mtime < lastTime) {
      return
    }

    let bannerData = { date: stat.mtime.format("yyyy-M-d HH:mm:ss") }
    let banner = "/* <%= date %> | " + copyright + " */\n"
    let bannerHtml = "<!-- <%= date %> | " + copyright + " -->\n"
    switch (t.fileType) {
      case ".js":
        gulp
          .src(srcFile, {
            base: srcPath
          })
          .pipe(
            plumber({
              errorHandler: function (err) {
                throwOnlyCopy(srcPath, srcFile, outFilePath, err)
              }
            })
          )
          .pipe(
            utf8Convert({
              encNotMatchHandle: function (file) {
                throwOnlyCopy(srcPath, srcFile, outFilePath, "The encoding may not be utf-8, please check to avoid garbled characters!")
              }
            })
          )
          .pipe(
            babel({
              presets: ["@babel/preset-env"],
              sourceType: "script",
              compact: false
            })
          )
          .pipe(
            uglify().on("error", function () {
              this.emit("end")
              throwOnlyCopy(srcPath, srcFile, outFilePath, err)
            })
          )
          .pipe(header(banner, bannerData))
          .pipe(gulp.dest(outFilePath))
        break
      case ".html":
        gulp
          .src(srcFile, {
            base: srcPath
          })
          .pipe(
            plumber({
              errorHandler: function (err) {
                throwOnlyCopy(srcPath, srcFile, outFilePath, err)
              }
            })
          )
          .pipe(
            utf8Convert({
              encNotMatchHandle: function (file) {
                throwOnlyCopy(srcPath, srcFile, outFilePath, "The encoding may not be utf-8, please check to avoid garbled characters!")
              }
            })
          )
          .pipe(
            cheerio({
              run: function ($, file) {
                $("script").each(function () {
                  // html inline js compilation
                  const script = $(this)
                  try {
                    if (!script.attr("src")) {
                      const scriptHtml = script.html()
                      const result = babelCore.transformSync(scriptHtml, {
                        presets: ["@babel/preset-env"],
                        sourceType: "script",
                        compact: false
                      })
                      script.text(result.code)
                    }
                  } catch (err) {
                    console.log("Error converting html", err)
                    throwOnlyCopy(srcPath, srcFile, outFilePath, "html inline js compilation error!")
                  }
                })
              }
            })
          )
          .pipe(
            htmlmin({
              collapseWhitespace: true, //Clear spaces and compress html, which has a relatively large effect and causes a large amount of compression changes.
              collapseBooleanAttributes: true, //Omit the value of the Boolean attribute, such as: <input checked="checked"/>, then after setting this attribute, it will become <input checked/>
              removeComments: true, //Clear comments in html
              removeEmptyAttributes: true, //Clear all empty attributes
              removeScriptTypeAttributes: true, //Clear the type="text/javascript" attribute in all script tags
              removeStyleLinkTypeAttributes: true, //Clear the type attribute on all Link tags
              minifyJS: true, //Compress javascript code in html
              minifyCSS: true //Compress the css code in html
            })
          )
          .pipe(header(bannerHtml, bannerData))
          .pipe(gulp.dest(outFilePath))
        break
      case ".css":
        gulp
          .src(srcFile, {
            base: srcPath
          })
          .pipe(
            plumber({
              errorHandler: function (err) {
                throwOnlyCopy(srcPath, srcFile, outFilePath, err)
              }
            })
          )
          .pipe(
            utf8Convert({
              encNotMatchHandle: function (file) {
                throwOnlyCopy(srcPath, srcFile, outFilePath, "The encoding may not be utf-8, please check to avoid garbled characters!")
              }
            })
          )
          .pipe(
            cssmin({
              advanced: false, //Type: Boolean Default: true [Whether to enable advanced optimization (merging selectors, etc.)]
              compatibility: "ie8", //Reserve ie7 and below compatibility writing type: String Default: ''or'*' [Enable compatibility mode; 'ie7': IE7 compatibility mode, 'ie8': IE8 compatibility mode, '*': IE9+ compatibility mode]
              keepSpecialComments: "*" //Keep all special prefixes when you use the browser prefix generated by autoprefixer. If you do not add this parameter, some of your prefixes may be deleted.
            })
          )
          .pipe(header(banner, bannerData))
          .pipe(gulp.dest(outFilePath))
        break
      default:
        gulp
          .src(srcFile, {
            base: srcPath
          })
          .pipe(gulp.dest(outFilePath))
        break
    }
  })
  done()

  // console.log('--------Code compilation completed--------');
})

//Traverse the directory to get the file list
function travel(dir) {
  fs.readdirSync(dir).forEach(function (file) {
    let pathname = path.join(dir, file)
    if (fs.statSync(pathname).isDirectory()) {
      //Exclude directories that are not copied, and the files will not be generated in the target directory.
      if (noCopyPathDef.some((t) => pathname.indexOf(t) !== -1)) {
        return
      }
      if (noCopyPath.some((t) => pathname.indexOf(t) !== -1)) {
        return
      }

      travel(pathname)
    } else {
      let fileType = path.parse(pathname).ext
      // console.log(pathname);

      //Exclude files that are not copied and the files will not be generated in the target directory.
      if (noCopyPathDef.some((t) => pathname.indexOf(t) !== -1)) {
        return
      }
      if (noCopyPath.some((t) => pathname.indexOf(t) !== -1)) {
        return
      }
      if (noCopyFileType.indexOf(fileType) !== -1) {
        return
      }

      //No compression, just copy it as it is
      if (
        noPipePath.some((t) => pathname.indexOf("\\Cesium\\") !== -1) || //Do not compress the Cesium directory
        noPipePathDef.some((t) => pathname.indexOf(t) !== -1) ||
        noPipePath.some((t) => pathname.indexOf(t) !== -1)
      ) {
        fileType = ""
      }

      fileList.push({
        pathname,
        fileType
      })
    }
  })
}

// Throw an error message and copy the file directly
function throwOnlyCopy(srcPath, pathname, outFilePath, message) {
  console.log(`[Conversion error] ${pathname}`, message)
  if (pathname && outFilePath) {
    gulp
      .src(pathname, {
        base: srcPath
      })
      .pipe(gulp.dest(outFilePath))
  }
}

// eslint-disable-next-line no-extend-native
Date.prototype.format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //日
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
    "H+": this.getHours(), //hours
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //Quarter
    S: this.getMilliseconds() //Milliseconds
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
    }
  }
  return fmt
}