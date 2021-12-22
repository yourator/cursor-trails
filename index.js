const IMAGE_URLS = [
  'https://i.imgur.com/ATIK70z.png',
  'https://i.imgur.com/j1Ji19r.png',
  'https://i.imgur.com/7OONoPN.png',
  'https://i.imgur.com/CVUTdtG.png',
  'https://i.imgur.com/YOxgfxw.png',
  'https://i.imgur.com/55Vsqji.png',
  'https://i.imgur.com/rP46Ovp.png',
  'https://i.imgur.com/KYoL6oi.png',
]


function loadImage(url) {
  return new Promise(((resolve) => {
    const img = new Image()

    img.onload = function onloadHandler() {
      resolve(img)
    }

    img.onerror = () => resolve(null)
    img.src = url
  }))
}

function getRelativePosition(position, canvas) {
  const rect = canvas.getBoundingClientRect()
  const x = position.x - rect.left
  const y = position.y - rect.top
  return { x, y }
}

function snowflakeCursor({
  container = document.body,
  images = IMAGE_URLS, // 圖片 url
  rate = 1, // 雪花出現頻率
  size = 30, // 雪花大小
  life = 2, // 雪花消失時間
  speed = 0.5, // 雪花移動速度
} = {}) {
  const hasWrapperEl = container !== document.body

  const particles = []
  let canvas
  let context
  let canvasImages = []


  function Particle(x, y, img) {
    const lifeSpan = Math.floor(Math.random() * 60 + 80) * life
    this.initialLifeSpan = lifeSpan //
    this.lifeSpan = lifeSpan // ms
    this.velocity = {
      x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2) * speed,
      y: (1 + Math.random()) * speed,
    }
    this.position = { x, y }
    img.width = size
    img.height = size
    this.trailImage = img

    this.update = (_context) => {
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
      this.lifeSpan--

      this.velocity.x += ((Math.random() < 0.5 ? -1 : 1) * 2) / 75

      const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0)

      const degrees = 2 * this.lifeSpan
      const radians = degrees * 0.0174533 // not perfect but close enough

      _context.save()
      _context.globalAlpha = this.lifeSpan / this.initialLifeSpan
      _context.translate(this.position.x, this.position.y)
      _context.rotate(radians)
      _context.drawImage(
        this.trailImage,
        (-this.trailImage.width / 2) * scale,
        -this.trailImage.height / 2,
        this.trailImage.width * scale,
        this.trailImage.height * scale,
      )

      _context.restore()
    }

    this.update(context)
  }
  function addParticle(x, y) {
    if (rate > Math.random()) {
      particles.push(new Particle(x, y, canvasImages[Math.floor(Math.random() * canvasImages.length)]))
    }
  }

  function updateParticles() {
    if (particles.length === 0) {
      return
    }
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Update
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(context)
    }

    // Remove dead particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].lifeSpan < 0) {
        particles.splice(i, 1)
      }
    }
  }
  function onWindowResize(e) {
    if (hasWrapperEl) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    } else {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i++) {
        const { x, y } = getRelativePosition({ x: e.touches[i].clientX, y: e.touches[i].clientY }, canvas)

        addParticle(x, y)
      }
    }
  }

  function onMouseMove(e) {
    const { x, y } = getRelativePosition({ x: e.clientX, y: e.clientY }, canvas)
    addParticle(x, y)
  }

  // Bind events that are needed
  function bindEvents() {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

    if (isTouchDevice) {
      container.addEventListener('touchmove', onTouchMove)
      container.addEventListener('touchstart', onTouchMove)
    } else {
      container.addEventListener('mousemove', onMouseMove)
    }
    window.addEventListener('resize', onWindowResize)
  }

  function loop() {
    updateParticles()
    requestAnimationFrame(loop)
  }
  function init() {
    canvas = document.createElement('canvas')
    context = canvas.getContext('2d')

    canvas.style.top = '0px'
    canvas.style.left = '0px'
    canvas.style.pointerEvents = 'none'

    if (hasWrapperEl) {
      canvas.style.position = 'absolute'
      container.appendChild(canvas)
      container.style.position = 'relative'
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    } else {
      canvas.style.position = 'fixed'
      document.body.appendChild(canvas)
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }


    bindEvents()
    loop()
  }

  Promise.all(images.map(url => loadImage(url))).then((results) => {
    canvasImages = results.filter(result => result !== null)

    if (results.length) {
      init()
    }
  })
}


export default snowflakeCursor
