var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')();

var pkg = require('./package.json');

gulp.task('jscheck', function() {
	return gulp.src(['src/*.js'])
		.pipe(plugins.plumber())
		.pipe(plugins.jshint({'esversion': 6}))
		.pipe(plugins.jshint.reporter('jshint-stylish'))
		.pipe(plugins.jshint.reporter('fail'));
});

gulp.task('clean', function() {
	return gulp.src(['dist'], {read: false})
		.pipe(plugins.clean());
});

gulp.task('build', ['jscheck'], function() {
	return gulp.src(['lib/*.js', 'src/*.js'])
		.pipe(plugins.webpack({
			output: {library:'JingtumSDK'},
			target: 'node',
			module: {
				loaders: [{
					test: /\.js$/, exclude: '(node_modules/|lib/)', loader: 'babel-loader', query: {presets: ['es2015']}
				}, {
					test: /\.json$/, loader: 'json-loader'
				}],
				noParse: ['ws']
			},
			externals: ['ws']
		}))
		.pipe(plugins.rename('jingtum-sdk.js'))
		.pipe(gulp.dest('dist'))
		.pipe(plugins.uglify())
		.pipe(plugins.rename('jingtum-sdk.min.js'))
		.pipe(gulp.dest('dist'));
})

gulp.task('default', ['clean', 'build']);

