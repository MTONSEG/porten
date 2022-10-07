// Подключение модулей
const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const size = require('gulp-size');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const fileinclude = require('gulp-file-include');
const replace = require('gulp-replace');
const webpack = require('webpack-stream');

//Пути к файлам
const paths = {
	html: {
		src: 'src/**/*.html',
		dest: 'dist/'
	},
	styles: {
		src: 'src/scss/*.scss',
		dest: 'dist/css/'
	},
	scripts: {
		src: 'src/js/app.js',
		watch: 'src/js/**/*.js',
		dest: 'dist/js'
	},
	images: {
		src: 'src/img/**/*.{jpg,jpeg,png,gif,webp,svg}',
		dest: 'dist/img'
	},
	fonts: {
		src: 'src/fonts/*',
		dest: 'dist/fonts/'
	}
}
// Очистка не нужных файлов
function clean() {
	return del(['dist/*', '!dist/img', '!dist/fonts']);
}

// Сибираем HTML
function buildHTML() {
	return src(paths.html.src)
		.pipe(fileinclude())
		.pipe(replace(/@img\//g, 'img/'))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest(paths.html.dest))
		.pipe(browserSync.stream());
}

//Компилируем стили
function buildStyles() {
	return src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(rename({
			basename: 'style',
			extname: '.min.css'
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(dest(paths.styles.dest))
		.pipe(browserSync.stream());
}

//Собираем файлы JS
function buildJS() {
	return src(paths.scripts.src)
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(webpack({
			mode: 'development',
			output: {
				filename: 'app.min.js'
			}
		}
		))
		.pipe(sourcemaps.write('./'))
		.pipe(dest(paths.scripts.dest))
		.pipe(browserSync.stream());
}

//Оптимизируем изображения
function img() {
	return src(paths.images.src)
		.pipe(newer(paths.images.dest))
		.pipe(imagemin({
			progressive: true,
			optimizationLevel: 3,
			svgoPlugins: [{ removeViewBox: false }],
			interlaced: true
		}))
		.pipe(size({
			showFiles: true
		}))
		.pipe(dest(paths.images.dest))
}

// Переносим Шрифты
function buildFonts() {
	return src(paths.fonts.src)
		.pipe(newer(paths.fonts.dest))
		.pipe(dest(paths.fonts.dest))
}

// Наблюдаем за изменением
function watcher() {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	})
	watch(paths.html.dest).on('change', browserSync.reload);
	watch(paths.html.src, buildHTML);
	watch(paths.styles.src, buildStyles);
	watch(paths.scripts.watch, buildJS);
	watch(paths.images.src, img);
}

const build = series(clean, buildHTML, parallel(buildStyles, buildJS, img, buildFonts), watcher)

exports.buildHTML = buildHTML;
exports.buildJS = buildJS;
exports.buildStyles = buildStyles;
exports.clean = clean;
exports.watcher = watcher;
exports.img = img;
exports.default = build;