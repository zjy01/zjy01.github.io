var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('default', function () {
	livereload.listen();
    // app/**/*.*的意思是 app文件夹下的 任何文件夹 的 任何文件
    gulp.watch('source/_posts/*.md', function (file) {
    	console.log("refresh");
        livereload.changed(file.path);
    });
});