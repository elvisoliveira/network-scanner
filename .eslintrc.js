module.exports = {
    plugins: ['react-hooks'],
    extends: [
        'semistandard',
        'plugin:react/recommended'
    ],
    rules: {
        'react-hooks/exhaustive-deps': 0,
        indent: ['error', 4, { SwitchCase: 1 }],
        'prefer-arrow-callback': 'error',
        'operator-linebreak': 'off',
        'comma-style': 'off',
        'no-debugger': 'off',
        'no-proto': 'off',
        curly: ['error', 'multi'],
        'react/prop-types': 'off'
    },
    'globals': {
        'TCPSocket': true
    },
    'settings': {
        'react': {
            'version': 'detect'
        }
    }
};