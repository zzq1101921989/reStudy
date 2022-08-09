module.exports = {
    presets: [
        '@babel/preset-env',
        [
            '@babel/preset-react',
            {
                'pragma': 'ZzqReact.createElement'
            }
        ]
    ]
}