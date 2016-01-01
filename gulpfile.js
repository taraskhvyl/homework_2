var gulp = require('gulp'),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	notify = require("gulp-notify"),
	uncss = require('gulp-uncss'),
	minify = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	jade = require("gulp-jade"),
	imagemin = require("gulp-imagemin"),
	pngquant = require('imagemin-pngquant'),
	jpegtran = require('imagemin-jpegtran'),
	spritesmith = require("gulp.spritesmith"),
	browserSync = require('browser-sync'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    mainBowerFiles  = require('gulp-main-bower-files'),
    gulpFilter = require('gulp-filter');

/*
# ===============================================
# Пути
# ===============================================
*/
input = {
    'sassAll': 'app/scss/**/*.scss',
    'sassIndex': 'app/scss/main.scss',
    'jsCustom': 'app/js/custom/*.js',
    'jsVendor' : 'app/js/vendor/*.js',
    'jsAll' : 'app/js/**/*.js',
    'images' : 'app/img/**/*.*',
    'jade' : 'app/jade/**/*.jade',
    'jadeIndex' : 'app/jade/index.jade',
    'index' : 'app/',
    'imgPNG' : 'app/img/**/*.png',
    'imgJPG' : 'app/img/**/*.jpg',
    'imgSprites' : 'app/img/sprites/*.*',
    'mainBower' : 'app/mainBower/'
},
    
middle = {
    'html' : 'app/',
    'css' : 'app/css/*.css',
    'images' : 'app/img',
    'jslibs' : 'app/js',
    'csslibs' : 'app/css'
},    

output = {
    'index' : 'dist/',
    'css' : 'dist/css',
    'maincss' : 'dist/css/main.css',
    'js' : 'dist/js',
    'images' : 'dist/img',
    'html' : 'dist/*.html'
};

/*
# ===============================================
# Компиляция Jade в HTML
# ===============================================
*/
gulp.task('jade', function () {
    gulp.src(input.jadeIndex)
	.pipe(plumber())
    .pipe(jade({pretty: true,cache: false}))
    .pipe(gulp.dest(middle.html))
	.pipe(notify("Jade Compiled"))
    .pipe(browserSync.reload({stream:true}))
});		
/*
# ===============================================
# Компиляция SASS в CSS
# ===============================================
*/	
gulp.task('compass', function () {
    gulp.src(input.sassIndex)
        .pipe(plumber())
        .pipe(compass({
            config_file: 'app/config.rb',
            css: 'app/css',
            sass: 'app/scss'
        }))
        .pipe(browserSync.reload({stream:true}))
});

/*
# ===============================================
# Перезагрузка страницы
# ===============================================
*/
gulp.task("browser-sync", function() {
    browserSync({
        port: 80,
        server: {
            baseDir: input.index
        }
    });
  });

gulp.task("bs-reload", function () {
    browserSync.reload();
});
/*
# ===============================================
# Сжатие картинок
# ===============================================
*/
gulp.task('pngopt', function () {
    return gulp.src(input.imgPNG)
		.pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(output.images))
		.pipe(notify("PNG optimized"));
});
gulp.task('jpgopt', function () {
    return gulp.src(input.imgJPG)
        .pipe(jpegtran({ progressive: true })())
        .pipe(gulp.dest(output.images))
        .pipe(notify("JPG optimized"));
});  
/*    
# ==============================================================
# !!!Самостоятельно запускаемые таски!!!
# ==============================================================
*/
/*    
# ===============================================
# Спрайты 
# ===============================================
*/
gulp.task('sprites', function() {
    var spriteData = 
        gulp.src(input.imgSprites)     // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: '_sprite.scss',
                imgPath: './img/sprite.png',//Путь прописаный в CSS как Background-image
                cssFormat: 'sass',
                padding: 4,
                algorithm: 'binary-tree',
                cssVarMap: function(sprite) {
                    sprite.name = 'icon-' + sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest(middle.images)); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('app/scss')); // путь, куда сохраняем стили
});


/*
# ==============================================
# Собирает все главные файлы с bower
# ==============================================
*/
gulp.task('mainbowerjs', function () {
    var filterJS = gulpFilter('**/*.js', { restore: true });
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(filterJS)
        .pipe(concat('lib.min.js'))
        .pipe(uglify())
        //.pipe(filterJS.restore) // закинуть файлы, которые обработались в папку
        .pipe(gulp.dest(middle.jslibs));
});
gulp.task('mainbowercss', function () {
    var filterCSS = gulpFilter('**/*.css', { restore: true });
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(filterCSS)
        .pipe(concat('lib.min.css'))
        .pipe(minify())
        //.pipe(filterCSS.restore) // закинуть файлы, которые обработались в папку
        .pipe(gulp.dest(middle.csslibs));
});

gulp.task('mainbower', ['mainbowerjs','mainbowercss']);
/*    
# ===============================================
# Убираем лишний код CSS
# ===============================================
*/
gulp.task('uncss', function() {
    return gulp.src(middle.css)
        .pipe(uncss({
            html: [output.html]
        }))
        .pipe(minify())
		.pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(output.css));
    ;
});
/*
# ===============================================
# Отслеживание изменения файлов
# ===============================================
*/
gulp.task('watch', function() {
	gulp.watch(input.jade, ['jade']);
    gulp.watch(input.sassAll, ['compass']);
    gulp.watch(input.imgSprites, ['sprites']);
});

gulp.task('default', ['jade','compass','sprites','browser-sync', 'watch']);
gulp.task('prod', ['pngopt','jpgopt','uncss']);