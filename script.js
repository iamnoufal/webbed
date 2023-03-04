const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function generateDate() {
  const date = new Date(Math.floor(Math.random()*200+1900), Math.floor(Math.random()*12), Math.floor(Math.random()*30))
  return date
}

var inter

function shuffleOptions(options) {
  for (let i = 0; i < options.length; i++) {
    let j = Math.floor(Math.random()*i)
    let temp = options[i]
    options[i] = options[j]
    options[j] = temp
  }
  return options
}

function generateOptions(option) {
  let options = []
  options.push(option)
  const checkForDuplicates = (arr, a) => {
    for (i of arr) {
      if (i == a) {
        return 0
      }
    }
    return 1
  }
  for (let i=0; i<3; i++) {
    var randomDay = Math.floor(Math.random()*7)
    while (checkForDuplicates(options, randomDay) == 0) {
      randomDay = Math.floor(Math.random()*7)
    }
    options.push(randomDay)
  }
  let so = shuffleOptions(options) // shuffled options
  let finalOptions = [dayMap[so[0]], dayMap[so[1]], dayMap[so[2]], dayMap[so[3]]]
  return finalOptions
}

function generateQuestion() {
  const date = generateDate()
  const day = date.getDay()
  sessionStorage.ans = day
  sessionStorage.selected = ''
  const options = generateOptions(day)
  const res = {
    date: date, 
    options: options
  }
  return res
}

function setSelectedAns(a) {
  sessionStorage.selected = a
}

function calcScore() {
  let points = localStorage.points
  let hs = localStorage.hs
  let comp = ''
  if (points == undefined) {
    comp = '0 points'
  } else {
    comp = `${points} points`
  }
  if (hs == undefined) {
    comp+=`<br>High Score: ${hs} points`
  }
  const scoreCont = document.getElementById('score')
  scoreCont.innerHTML = comp
}

function checkAns() {
  if (sessionStorage.selected=='') {
    alert("Please select an answer")
  } else {
    let score = parseInt(localStorage.points) || 0
    if (sessionStorage.selected == dayMap[sessionStorage.ans]) {
      alert("Correct answer! Moving to next question")
      if (score == undefined) {
        score = 1
      } else {
        score = score + 1 
      }
    } else {
      alert("Wrong Answer! Moving to next question")
      if (score == undefined) {
        score = -1
      } else {
        score = score - 1
      }
    }
    localStorage.points = score
    populatePage()
    calcScore()
  }
}

function reset() {
  localStorage.clear()
  const points = localStorage.points
  sessionStorage.clear()
  localStorage.hs = points
  populatePage()
}

function renderComponent(date, options) {
  let comp = `<h4 class="text-white mt-3">${date.getDate()} ${monthMap[date.getMonth()]} ${date.getFullYear()}</h4>
  <div class="btn-group my-4">
    <input type="radio" class="btn-check" name="btnradio" id="${options[0]}" onClick="setSelectedAns('${options[0]}')" autocomplete="off">
    <label class="btn btn-outline-primary mx-2 rounded" for="${options[0]}">${options[0]}</label>
    <input type="radio" class="btn-check" name="btnradio" id="${options[1]}" onClick="setSelectedAns('${options[1]}')" autocomplete="off">
    <label class="btn btn-outline-primary mx-2 rounded" for="${options[1]}">${options[1]}</label>
    <input type="radio" class="btn-check" name="btnradio" id="${options[2]}" onClick="setSelectedAns('${options[2]}')" autocomplete="off">
    <label class="btn btn-outline-primary mx-2 rounded" for="${options[2]}">${options[2]}</label>
    <input type="radio" class="btn-check" name="btnradio" id="${options[3]}" onClick="setSelectedAns('${options[3]}')" autocomplete="off">
    <label class="btn btn-outline-primary mx-2 rounded" for="${options[3]}">${options[3]}</label>
  </div>
  <button type="button" class="btn btn-primary bg-yellow px-3 rounded text-dark fw-bold" onclick="checkAns()">Go!</button>
      <div id="score" class="text-center text-white"></div>
      <button type="button" class="btn btn-primary bg-yellow text-dark w-auto fw-bold px-3 rounded mt-4" onclick="reset()">Reset</button>
  `
  const container = document.getElementById("ques")
  container.innerHTML = comp
}

function populatePage() {
  const data = generateQuestion()
  const comp = renderComponent(data.date, data.options)
  timer()
  calcScore()
}

function timer() {
  let begin = 30
  var count = setInterval(() => {
    if (begin < 0) {
      clearInterval(count)
      alert("Times Up. Moving to next question")
      populatePage()
    } else {
      document.getElementById("timer").innerHTML = `${begin} seconds left`
      begin -= 1
    }
  }, 1000)
}