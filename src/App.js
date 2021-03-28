import {Button} from '@chakra-ui/button'
import {ChevronDownIcon} from '@chakra-ui/icons'
import {Box, Divider, Flex, Spacer} from '@chakra-ui/layout'
import {
  Collapse,
  Input,
  InputGroup,
  InputLeftAddon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {AiFillPlayCircle, AiFillSetting} from 'react-icons/ai'
import {FaStopCircle} from 'react-icons/fa'
import {ImLocation} from 'react-icons/im'
import {IoMdRefresh} from 'react-icons/io'
import {cartStates, destination} from './destinations'
import fs from 'fs'



function App() {
  const {isOpen, onToggle} = useDisclosure()

  const [server, setServer] = useState(localStorage.getItem('server'))
  const [ui, setUI] = useState(localStorage.getItem('ui'))
  const [ros, setRos] = useState(localStorage.getItem('ros'))
  const [pose, setPose] = useState(localStorage.getItem('pose'))
  const [localPort, setLocalPort] = useState(localStorage.getItem('localPort'))
  const [uiPort, setUIPort] = useState(localStorage.getItem('uiPort'))
  const [posePort, setPosePort] = useState(localStorage.getItem('posePort'))
  const [dest, setDestination] = useState('')
  const [cartState, setCartState] = useState('')
  const [isEnabled, setIsEnabled] = useState(false);
  const [destButton, setDestButton] = useState('Destination')
  const [stateButton, setStateButton] = useState('Cart State')

  useEffect(()=>{
    if(window.ipcRenderer){
      window.ipcRenderer.on('state-change',(ev,arg)=>{
        console.log(arg);
      setIsEnabled(arg.pullover);
      setDestination(arg.destination);
      setCartState(arg.state);

    })
  }
  },[])

  useEffect(()=>{
    console.log(isEnabled + '   enabled usefx');
  },[isEnabled])


  const setSwitchState = (state) => {
    console.log('setting switch state to ' + state)
  }
 
  const createPanel = (name, port, onRestart, onStop) => {
    return (
      <Flex direction="column" w="100%">
        <Flex align="center">
          {/* <Icon as={} /> */}
          <Text color="gray.400">{name}</Text>
          <Spacer />

          <Text
            color="blue.300"
            fontSize="xs"
            mr={3}
            bg="gray.900"
            rounded={8}
            px={2}
            py={1}
          >
            {port}
          </Text>

          <Button
            leftIcon={<IoMdRefresh />}
            colorScheme="green"
            variant="outline"
            size="sm"
            mr={3}
            onClick={onRestart}
          >
            Restart
          </Button>
          <Button
            leftIcon={<FaStopCircle />}
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={onStop}
          >
            Stop
          </Button>
        </Flex>
        <Divider my={3} />
      </Flex>
    )
  }

  return (
    <Box w="100vw" h="100vh" p={4}>
      <Flex direction="column">
        <Flex direction="column" w="100%">
          <Flex align="center">
            <Button
              leftIcon={<AiFillSetting />}
              colorScheme="blue"
              variant="outline"
              size="sm"
              onClick={onToggle}
            >
              Config
            </Button>
          </Flex>
          <Collapse in={isOpen} animateOpacity>
            <InputGroup size="sm" mt={2}>
              <InputLeftAddon children="local-server" w="100px" />
              <Input
                placeholder="path to local-server folder"
                value={server}
                onChange={(e) => {
                  localStorage.setItem('server', e.target.value)
                  setServer(e.target.value)
                }}
              />
            </InputGroup>
            <InputGroup size="sm" mt={2}>
              <InputLeftAddon children="ui-server" w="100px" />
              <Input
                placeholder="path to cart-ui folder"
                value={ui}
                onChange={(e) => {
                  localStorage.setItem('ui', e.target.value)
                  setUI(e.target.value)
                }}
              />
            </InputGroup>
            <InputGroup size="sm" mt={2}>
              <InputLeftAddon children="run.sh" w="100px" />
              <Input
                placeholder="path to run.sh file"
                value={ros}
                onChange={(e) => {
                  localStorage.setItem('ros', e.target.value)
                  setRos(e.target.value)
                }}
              />
            </InputGroup>
            <InputGroup size="sm" mt={2}>
              <InputLeftAddon children="pose-server" w="100px" />
              <Input
                placeholder="path to pose-tracking server"
                value={pose}
                onChange={(e) => {
                  localStorage.setItem('pose', e.target.value)
                  setPose(e.target.value)
                }}
              />
            </InputGroup>
          </Collapse>
          <Divider my={3} />
        </Flex>
        <Flex align="center">
          <Button
            leftIcon={<AiFillPlayCircle />}
            colorScheme="blue"
            variant="outline"
            size="sm"
            onClick={() => {
              window.ipcRenderer.send('start-all-servers', 
              {
                ros_path: ros, ui_path: {path: ui, port: uiPort}, pose_path: {path: pose, port: posePort}, local_path: {path: server, port: localPort}
              }) // send this to electron
            }}
          >
            Start all servers
          </Button>
          <Text
            color="gray.400"
            fontSize="sm"
            ml={3}
            bg="gray.900"
            rounded={8}
            px={2}
          >
            Will launch the ROS run.sh
          </Text>
        </Flex>
        <Divider my={3} />
        {createPanel(
          'Local Server',
          (<InputGroup size="xs" w="90px" h="=4px"><InputLeftAddon children="port" bg="gray.900"  border="gray.900" w="40px" /><Input
            placeholder="port"
            value={localPort}
            onChange={(e) => {
              localStorage.setItem('localPort', e.target.value)
              setLocalPort(e.target.value)
            }}
          /></InputGroup>),
          () => {
            console.log('local-server-restart')
            window.ipcRenderer.send('local-server-restart', {
              path: server,
              port: localPort
            }) // send this to electron
          },
          () => {
            console.log('local server clicked stop')
            window.ipcRenderer.send('local-server-stop', server)
          }
        )}
        {createPanel('UI Server', (<InputGroup size="xs" w="90px" h="=4px"><InputLeftAddon children="port" bg="gray.900"  border="gray.900" w="40px" /><Input
            placeholder="port"
            value={uiPort}
            onChange={(e) => {
              localStorage.setItem('uiPort', e.target.value)
              setUIPort(e.target.value)
            }}
          /></InputGroup>), () => {
            window.ipcRenderer.send('ui-server-restart', {path: ui, port: uiPort}) // send this to electron
          }, () => {
            window.ipcRenderer.send('ui-server-stop', ui) // send this to electron
          })}
        {createPanel(
          'Pose Tracking',
          (<InputGroup size="xs" w="90px" h="=4px"><InputLeftAddon children="port" bg="gray.900"  border="gray.900" w="40px" /><Input
            placeholder="port"
            value={posePort}
            onChange={(e) => {
              localStorage.setItem('posePort', e.target.value)
              setPosePort(e.target.value)
            }}
          /></InputGroup>),
          () => {
            window.ipcRenderer.send('pose-server-restart', {path: pose, port: posePort}) // send this to electron
          },
          () => {
            window.ipcRenderer.send('pose-server-stop', pose) // send this to electron
          },
        )}
        <Flex>
          <Text color="gray.400">Modify State</Text>
          <Spacer />
          <Button
            leftIcon={<IoMdRefresh />}
            colorScheme="blue"
            variant="outline"
            size="sm"
          >
            Reset to idle
          </Button>
        </Flex>
        <Flex mt={3} align="center">
          <Menu>
            <MenuButton
              size="sm"
              as={Button}
              colorScheme="gray"
              variant="outline"
              leftIcon={<ImLocation />}
              rightIcon={<ChevronDownIcon />}
              
            >
              {destButton}
            </MenuButton>
          <Button
            leftIcon={<AiFillSetting />}
            colorScheme="orange"
            variant="outline"
            size="sm"
            onClick={
            (e) => {
              window.ipcRenderer.send('save-dest', {destination: destButton, path: server})
              setDestButton('Destination')
            }}
          >
            Save Dest
          </Button>
            <MenuList minW="120px">
              {Object.keys(destination).map((x) => {
                return (
                  <MenuItem key={x} onClick={() => {
                    setDestButton(x)
                  }}
                  >
                    {x}
                  </MenuItem>
                )
              })}
            </MenuList>
            
          </Menu>
          
          <Spacer />
          {dest !== '' && (
            <>
              <Text
                color="gray.400"
                fontSize="sm"
                bg="gray.900"
                rounded={8}
                px={2}
              >
                {dest}
              </Text>
              <Text
                color="gray.400"
                fontSize="sm"
                ml={2}
                bg="gray.900"
                rounded={8}
                px={2}
              >
                {destination[dest].latitude}, {destination[dest].longitude}
              </Text>
            </>
          )}
        </Flex>
        

        <Flex mt={2} align="center">
          <Menu>
            <MenuButton
              size="sm"
              as={Button}
              colorScheme="gray"
              variant="outline"
              leftIcon={<ImLocation />}
              rightIcon={<ChevronDownIcon />}
              pr="21px"
            >
              {stateButton}
            </MenuButton>
            <Button
            leftIcon={<AiFillSetting />}
            colorScheme="orange"
            variant="outline"
            size="sm"
            onClick={
            (e) => {
              window.ipcRenderer.send('save-state', {state: stateButton, path: server})
              setStateButton('Cart State')
            }}
          >
            Save State
          </Button>
            <MenuList minW="120px">
              {cartStates.map((x) => {
                return (
                  <MenuItem key={x} onClick={() => {
                    setStateButton(x)
                    }}>
                    {x}
                  </MenuItem>
                )
              })}
            </MenuList>
          </Menu>
          <Spacer />
          {dest !== '' && (
            <>
              <Text
                color="gray.400"
                fontSize="sm"
                bg="gray.900"
                rounded={8}
                px={2}
              >
                {cartState}
              </Text>
            </>
          )}
        </Flex>

        <Flex mt={2}>
          <Text fontSize="sm" color="gray.400">
            Pullover
          </Text>
          <Switch id="pullover" ml={2} 
              onChange={e=>{
                console.log(e.target.checked + '  switch val');
                setIsEnabled(e.target.checked)
                window.ipcRenderer.send('pullover', e.target.checked)
              }}

              isChecked={isEnabled}
          />
        </Flex>
        <Flex mt={3} justify="center">
          <Button
            leftIcon={<AiFillSetting />}
            colorScheme="orange"
            variant="outline"
            size="sm"
            onClick={
            (e) => {
              window.ipcRenderer.send('restart')
            }}
          >
            Restart UI
          </Button>
        </Flex>
        <Flex mt={3} justify="center">
          <Button
            leftIcon={<AiFillSetting />}
            colorScheme="orange"
            variant="outline"
            size="sm"
            onClick={
            (e) => {
              window.ipcRenderer.send('save-and-restart', {destination: '', state: 'summon-finish', path: server})
            }}
          >
            DEMO: Reset UI
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
  
}

export default App
