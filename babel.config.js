module.exports = {
    presets: [
        '@babel/preset-env',
        [
            '@babel/preset-react',
            ( process.env.REACT_Version === '15' ? {
                'pragma': 'ZzqReact.createElement'
            } : {} )
        ]
    ]
}

console.log(process.env.REACT_Version, 'process.env');