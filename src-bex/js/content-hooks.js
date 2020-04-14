// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.

const
  iFrame = document.createElement('iframe'),
  defaultFrameHeight = '0px',
  defaultFrameWidth = '0px'

/**
 * Set the height of our iFrame housing our BEX
 * @param height
 */
const setIFrameDimensions = (height, width) => {
  iFrame.height = height
  iFrame.width = width
  document.body.style.paddingLeft = width
}

/**
 * Reset the iFrame to it's default height e.g The height of the top bar.
 */
const resetIFrame = () => {
  setIFrameDimensions(defaultFrameHeight, defaultFrameWidth)
}

let Bridge = null
export default function attachContentHooks (bridge) {
  /**
   * When the drawer is toggled set the iFrame height to take the whole page.
   * Reset when the drawer is closed.
   */
  bridge.on('bex.toggle.iframe', event => {
    const payload = event.data
    if (payload.open) {
      setIFrameDimensions('100%', '300px')
    } else {
      resetIFrame()
    }
    bridge.send(event.eventResponseKey)
  })

  bridge.on('test.event', event => {
    console.log(event)
  })

  Bridge = bridge
}

function addElWithClass (tag, className, container) {
  const item = document.createElement(tag)
  item.className = className
  container.append(item)
  return item
}

/**
 * The code below will get everything going. Initialise the iFrame with defaults and add it to the page.
 * @type {string}
 */
iFrame.id = 'bex-app-iframe'
iFrame.width = '100%'
resetIFrame()

// Assign some styling so it looks seamless
Object.assign(iFrame.style, {
  position: 'fixed',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  border: '0',
  zIndex: '2147483001',
  overflow: 'visible'
})

;(function () {
  // When the page loads, insert our browser extension code.
  iFrame.src = chrome.runtime.getURL('www/index.html')
  document.body.prepend(iFrame)

  const elements = document.querySelectorAll('.rc')
  for (const element of elements) {
    const container = addElWithClass('div', 'bex-add-todo__container', element)
    const addTodo = addElWithClass('button', 'bex-btn', container)
    addTodo.innerHTML = '+ Todo'

    const clickFn = () => {
      Bridge.send('bex.add.todo', {
        text: element.querySelector('.r a h3').innerText,
        link: element.querySelector('.r a').href
      })
    }

    addTodo.addEventListener('click', clickFn)
  }
})()
