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
import {useState} from 'react'
import {AiFillPlayCircle, AiFillSetting} from 'react-icons/ai'
import {FaStopCircle} from 'react-icons/fa'
import {ImLocation} from 'react-icons/im'
import {IoMdRefresh} from 'react-icons/io'
import {cartStates, destination} from './destinations'

function App() {
  const {isOpen, onToggle} = useDisclosure()

  const [server, setServer] = useState(localStorage.getItem('server'))
  const [ui, setUI] = useState(localStorage.getItem('ui'))
  const [ros, setRos] = useState(localStorage.getItem('ros'))
  const [pose, setPose] = useState(localStorage.getItem('ros'))
  const [dest, setDestination] = useState('')
  const [cartState, setCartState] = useState('')
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
            <Text as="span" color="gray.400">
              {' '}
              port
            </Text>{' '}
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
                value={ros}
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
              window.ipcRenderer.send('start-all-servers', {
                path: ros,
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
          8020,
          () => {
            console.log('hey')
            window.ipcRenderer.send('local-server-restart', {
              path: server,
              port: 8020,
            }) // send this to electron
          },
          () => {
            console.log('clicked stop')
            window.ipcRenderer.send('local-server-stop', null)
          }
        )}
        {createPanel('UI Server', 3000, null, null)}
        {createPanel(
          'Pose Tracking',
          3001,
          () => {
            window.ipcRenderer.send('pose-server-start', server) // send this to electron
          },
          null
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
              Destination
            </MenuButton>
            <MenuList minW="120px">
              {Object.keys(destination).map((x) => {
                return (
                  <MenuItem key={x} onClick={() => setDestination(x)}>
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
              Cart State
            </MenuButton>
            <MenuList minW="120px">
              {cartStates.map((x) => {
                return (
                  <MenuItem key={x} onClick={() => setCartState(x)}>
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
          <Switch id="email-alerts" ml={2} />
        </Flex>
        <Flex mt={3} justify="center">
          <Button
            leftIcon={<AiFillSetting />}
            colorScheme="orange"
            variant="outline"
            size="sm"
            onClick={onToggle}
          >
            Save and restart
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default App
