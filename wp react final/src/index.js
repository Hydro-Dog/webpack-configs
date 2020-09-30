import {styles} from './styles/styles.scss'
import img from './assets/images/gdfsg.png'
import ReactDOM from 'react-dom'
import React from 'react'
import App from './components/AppComponent/AppComponent.jsx'

console.log('Hello World', img, styles)

async function foo() {
    let a = await Promise.resolve(1000)
    console.log('a: ', a)
}

foo()

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('app')
)