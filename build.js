{
    appDir: 'public/javascripts',
    baseUrl: '.',
    mainConfigFile: 'public/javascripts/config.js',
    dir: 'public/dist',
    modules: [
        {
            name: 'config',
            include: ['jquery', 'bootstrap']
        },
        {
            name: 'home',
            exclude: ['config']
        },
        {
            name: 'about',
            exclude: ['config']
        },
        {
            name: 'register',
            exclude: ['config']
        }
    ],
    // findNestedDependencies: true,
    removeCombined: true
    //optimize: 'closure'
}
