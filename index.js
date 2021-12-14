
const DEFAULT_RATE = 0.15 // 雪花頻率
const SIZE = '3rem'

const IMAGE_URLS = []

function loadImage(url) {
  const imageElement = new Image()
  imageElement.src = url
  imageElement.style.width = SIZE
  imageElement.style.height = SIZE

  return imageElement
}

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function setImageAnimation(imageElement, container) {
  imageElement.style.transform = `translate(
    ${(0.4 * Math.random() - 0.2) * container.clientHeight}px,
    ${(0.4 * Math.random() + 0.4) * container.clientHeight}px) scale(0.1) rotate(${1080 * Math.random() - 540}deg)`
  imageElement.style.opacity = 0

  return imageElement
}

function getRelativePosition(position, container) {
  const rect = container.getBoundingClientRect()
  const x = position.x - rect.left
  const y = position.y - rect.top
  return { x, y }
}
function getImage(imageElements, startingPosition, container) {
  const displayImageElement = getRandomItem(imageElements).cloneNode(true)
  const relativePosition = getRelativePosition(startingPosition, container)
  displayImageElement.style.position = 'absolute'
  displayImageElement.style.left = `${relativePosition.x}px`
  displayImageElement.style.top = `${relativePosition.y}px`
  displayImageElement.style.transition = `transform ${1 * Math.random() + 2}s linear,
  opacity ${1 * Math.random() + 1.5}s linear`
  displayImageElement.style.pointerEvents = 'none'
  displayImageElement.addEventListener('transitionend', () => {
    if (displayImageElement.parentNode) {
      displayImageElement.parentNode.removeChild(displayImageElement)
    }
  })
  return displayImageElement
}


function CursorTrail(options) {
  const container = (options && options.container) || document.body
  const rate = (options && options.rate) || DEFAULT_RATE
  const images = options.images || IMAGE_URLS
  const imageElements = images.map(loadImage)

  if (!imageElements || !imageElements.length) {
    throw new Error('No image elements provided')
  }

  function addTrails(x, y) {
    const image = getImage(imageElements, { x, y }, container)
    container.appendChild(image)
    setImageAnimation(image, container)
  }


  function onTouchMove(e) {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i += 1) {
        if (rate > Math.random()) {
          requestAnimationFrame(() => {
            addTrails(
              e.touches[i].clientX,
              e.touches[i].clientY,
            )
          })
        }
      }
    }
  }
  function onTouchStart(e) {
    if (e.touches.length > 0) {
      requestAnimationFrame(() => {
        addTrails(
          e.touches[0].clientX,
          e.touches[0].clientY,
        )
      })
    }
  }

  function onMouseMove(e) {
    if (rate > Math.random()) {
      requestAnimationFrame(() => {
        addTrails(
          e.clientX,
          e.clientY,
        )
      })
    }
  }

  // Bind events that are needed
  function bindEvents() {
    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('touchmove', onTouchMove)
    container.addEventListener('touchstart', onTouchStart)
  }

  bindEvents()
}

export default CursorTrail
