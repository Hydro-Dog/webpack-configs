const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

//TerserPlugin - оптимизация js
//OptimizeCssPlugin - оптимизация css

const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin') 

//пишем функцию, чтобы конфигурировать оптимизацию по логике
const optimization = () => {
    const config = {
        //вебпак выносит общий код в файл vendor.js
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new TerserPlugin(),
            new OptimizeCssPlugin()
        ]
    }

    return config
}

//берем из глобального объекта НОДЫ process параметры env,
//process доступен придложению на НОДЕ во время собственного выполнения
//можно задавать через пакет cross-env (1:51:50), вставлем строчку в скрипт в package.json
const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
console.log('isDev: ', isDev)
console.log('isProd: ', isProd)

module.exports = {
    //режим: dev/prod
    mode: 'development',
    //точки входа: массив/объект/строка с путём
    entry: {
        //babel polyfill подключается здесь
        main: ['@babel/polyfill', './src/index.js'],
        notmain: './src/index2.ts' 
    },
    resolve: {
        //массив автоматически подставляемых в поиск import from файловых расширений 
        //лучше не указывать и оставлять по умолчинию
        extensions: ['.js', '.json', '.png', '.jsx', '.scss'],
        //алиас по умолчанию - @. указывает на корень проекта
        alias: {
            '@models': path.resolve(__dirname, 'src/models')
        } 
    },
    //используем чтобы не грузить одни и те же библиотеки 
    //несколько раз, даже если они повторяются в точках входа 
    optimization: optimization(),
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            //разрешает импорты формата import style.css и url('.src/url) 
            {
                test: /\.(jpg|png|svg)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-typescript'],
                         //чтобы работали слассы TS
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            
        ]
    },
    plugins: [
        //передаем в качестве аргумена исходны index.html
        //получаем результирующий index.html с подключенными outputs-скриптами
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhiteSpace: isProd
            }
        }),
        //очиаем dist при каждой сборке 
        new CleanWebpackPlugin(),
        //копируем статические файлы и папки
        //альтернатива - MiniCssExtractPlugin, почитать
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname,'src/favimages.png'),
                    to: path.resolve(__dirname,'dist')
                },
                {
                    from: path.resolve(__dirname,'src/styles'),
                    to: path.resolve(__dirname,'dist/styles')
                }
            ]
        })
    ],
    output: {
        //name - патерн для копирования имени исходника
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    //дев-сервер также собирает папку dist, но кладет ее в оперативную память
    devServer: {
        port: 7004,
        //hot module replacement
        hot: isDev
    }
}