const START_BTN = document.querySelector('#start-btn')
const CAR = document.querySelector('#car')
const CAR_IMG = 'car.jpg'
const CAR_HEIGHT = 165
const STEP_X = 127
//const STEP_Y = CAR_HEIGHT / 4
const GAME_AREA = document.querySelector('#game-area')
const SCORE_ELEM = document.querySelector('#score')
const SCORE_COVER_RESULT_ELEM = document.querySelector('#score-cover-result')
const SCORE_COVER_ELEM = document.querySelector('#score-cover')
let score = 0
let speed = 1
let level = 0
let step = 4

const createEnemies = () => {
  const startPositions = [`0px`, `${STEP_X}px`, `${STEP_X * 2}px`]

  for (let i = 0; i <= Math.round(Math.random()); i++) {
    const enemy = document.createElement('img')
    enemy.classList.add('enemy')
    enemy.src = CAR_IMG
    GAME_AREA.append(enemy)

    const index = i === 0 ? Math.round(Math.random() * 2) : Math.round(Math.random())
    enemy.style.left = startPositions.splice(index, 1)
  }
}

const gameOver = () => {
  console.log('Game over')
  const enemies = document.querySelectorAll('.enemy')
  enemies.forEach((el) => {
    el.remove()
  })
  clearInterval(intervalID)
  CAR.removeEventListener('keydown', turn)

  SCORE_COVER_RESULT_ELEM.innerText = score
  SCORE_COVER_ELEM.classList.remove('hidden')
}

const animateEnemies = () => {
  const enemies = document.querySelectorAll('.enemy')

  const currentBottomPosition = +getComputedStyle(enemies[0]).bottom.split('px')[0]
  if (currentBottomPosition <= -CAR_HEIGHT) {
    enemies.forEach((el) => {
      score++
      el.remove()
    })

    if (level >= 1) {
      if (speed < 0.08) {
        step /= 1.2
        console.log('update step: ', step)
      } else {
        speed *= 0.8
        console.log('update interval: ', 200*speed, ' speed: ', speed)
        clearInterval(intervalID)
        intervalID = setInterval(animateEnemies, 200 * speed)
        level = 0
      }
    } else {
      level++
    }

    SCORE_ELEM.innerText = score
    createEnemies()
  } else {
    enemies.forEach((el) => {
      if (currentBottomPosition <= CAR_HEIGHT) {
        const currentLeftPosition = +getComputedStyle(el).left.split('px')[0]
        const currentPosition = +getComputedStyle(CAR).left.split('px')[0]
        if (currentPosition === currentLeftPosition) {
          gameOver()
          return
        }
      }
      const currentTopPosition = +getComputedStyle(el).top.split('px')[0]
      el.style.top = `${currentTopPosition + CAR_HEIGHT / step}px`
    })
  }
}

let intervalID = 0
const startEnemies = () => {
  createEnemies()
  intervalID = setInterval(animateEnemies, 200 * speed)
}

const turn = (event) => {
  const enemies = document.querySelectorAll('.enemy')
  const currentPosition = +getComputedStyle(CAR).left.split('px')[0]

  if (event.keyCode === 37 && currentPosition > 0) { //left
    CAR.style.left = `${currentPosition - STEP_X}px`
    enemies.forEach((el) => {
      const currentBottomPosition = +getComputedStyle(el).bottom.split('px')[0]
      if (currentBottomPosition < CAR_HEIGHT) {
        const currentLeftPosition = +getComputedStyle(el).left.split('px')[0]
        if (currentPosition === currentLeftPosition) {
          gameOver()
        }
      }
    })
  } 
  
  if (event.keyCode === 39 && currentPosition < STEP_X*2) { //right
    CAR.style.left = `${currentPosition + STEP_X}px`
    enemies.forEach((el) => {
      const currentBottomPosition = +getComputedStyle(el).bottom.split('px')[0]
      if (currentBottomPosition < CAR_HEIGHT) {
        const currentLeftPosition = +getComputedStyle(el).left.split('px')[0]
        if (currentPosition === currentLeftPosition) {
          gameOver()
        }
      }
    })
  }
}

const resetGame = () => {
  score = 0
  speed = 1
  level = 0
  step = 4
  SCORE_ELEM.innerText = score
  SCORE_COVER_ELEM.classList.add('hidden')
}

START_BTN.addEventListener('click', () => {
  console.log('The Game is started!')
  resetGame()
  CAR.addEventListener('keydown', turn)
  CAR.focus()
  startEnemies()
})