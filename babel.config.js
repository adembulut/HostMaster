module.exports = {
    presets: [
        '@babel/preset-env'
    ],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    '@src': './src',
                    '@static': './src/static',
                    '@pages': './pages',
                    '@root': '.'
                }
            }
        ]
    ]
};
