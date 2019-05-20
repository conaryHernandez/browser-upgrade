//require modulos

	var gulp= require('gulp'),
		uglify= require('gulp-uglify') ,
		gutil= require('gulp-util'),
		rename= require('gulp-rename'),
		browsersync= require('browser-sync'),
		sass= require('gulp-sass'),
		notify= require('gulp-notify'),
		beep= require('beepbeep'),
		dependents= require('gulp-dependents'),
		flatten= require('gulp-flatten'),
		reload= browsersync.reload;

var paths = {};
	paths.sassThemes	= 	'dev/sass/**/*.scss'
// error function
var onError = function (err) {
    notify({
         title: 'Gulp Task Error',
         message: 'Check the console for details.'
     }).write(err.messageFormatted);
    beep(3,500);
	console.log(err.messageFormatted.toString()); 
	this.emit('end');
}	
// script task minify js
gulp.task('scripts',function(){
	gulp.src(['dev/js/**/*.js'])
	.pipe(rename({suffix:'.min'}))
	.pipe(uglify())
	.on('error',gutil.log)
	.pipe(gulp.dest('build/js'))
	.pipe(reload({stream:true}));
});
// WATCH task
gulp.task('watch',function(){
	gulp.watch('dev/js/**/*.js',['scripts']);
	gulp.watch('dev/sass/**/*.scss',['sass']);
	gulp.watch('**/*.html',['html']);
});
// browsersync 
gulp.task('browsersync',function(){
	browsersync({
		server:{
			baseDir:"./"
		}
	});
});

gulp.task('html',function(){
	gulp.src('**/*.html')
	.pipe(reload({stream:true}));
});

// COMPASS SASS task
gulp.task('sass',function(){
	return gulp.src([paths.sassThemes])	
	.pipe(dependents())	
	.pipe(sass({outputStyle: 'compressed'}).on('error', onError))
	.pipe(flatten({ includeParents: 1 }))
	.pipe(gulp.dest('build/css'))
	.pipe(reload({stream:true}));
});	

// default task 
gulp.task('default',['scripts','watch','sass','html','browsersync']);