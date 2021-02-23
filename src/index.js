import {ChakraProvider} from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import {extendTheme} from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    useSystemColorMode: true,
    initialColorMode: 'dark',
  },
  components: {Button: {baseStyle: {_focus: {boxShadow: 'none'}}}},
})
// 3. extend the theme

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
