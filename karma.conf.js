module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'src/test.ts'
        ],
        browsers: ['Chrome'],
        singleRun: true
    });
};