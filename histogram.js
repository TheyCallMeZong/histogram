//отступы слева и сверху
const offsetBot = 20
const offsetLeft = 20
const minOffset = 5
const widthOffset = 41

//ширина колонки и расстояние между колонками
const barWidth = 30
let barSpacing = 11

//элемент где будет отрисовываться диаграмма
const canvas = document.getElementById('histogram')

//инфа о прямоугольнике
const infoBox = document.getElementById('info-box')

document.getElementById("sig").addEventListener("input", () => setSignature())

//контекст для рисования на холсте
const ctx = canvas.getContext('2d')

//колор пикер
document.getElementById('color-picker-rect')
    .addEventListener('change', setRectColor)
document.getElementById('color-picker')
    .addEventListener('change', setColor)
document.getElementById('color-picker-canvas')
    .addEventListener('change', setCanvasColor)

//ошикба при наведении на элемент гистограммы
const error = 0.3

//цвет задней линий и подписей
let color = "#000000"

//цвет прямоугольников
let colorRect = 'MidnightBlue'

//цвет канваса
let canvasColor = "#DCDCDC"

//разница значений для отрисовки боковых линий
let offsetForPaintBackLines = 5

//массив
let dArray = []

//высота колонок
let rectHeight = []

//функция для получения чисел
function getNumbers(){
    let dataInput = document.getElementById('dataInput')
    let data = dataInput.value.split(' ')
    for (let i = 0; i < data.length; i++){
        if (!isNaN(data[i])){
            dArray[i] = parseFloat(data[i])
            if (dArray[i] < 0){
                alert("Числа не могут быть отрицательными")
                return 0
            }
            if (isNaN(dArray[i])) {
                alert("Неверно указаны входные данные")
                return 0
            }
        } else{
            alert("Укажите число")
            return 0
        }
    }

    return data
}

//установка размера холста, если холст больше размеров экрана то мы катапультируемся
function setSizeHistogram(data){
    canvas.width = data.length * widthOffset + barWidth
    canvas.height = 600
}

//отрисовка столбца гистограммы
function drawRectangle(data, maxValue){
    ctx.font = "bold 16px Times New Roman"

    for (let i = 0; i < data.length; i++) {
        let barHeight = data[i] / maxValue * (canvas.height - offsetBot)
        rectHeight[i] = barHeight
        ctx.fillRect(i * (barWidth + barSpacing) + offsetLeft, canvas.height - barHeight - offsetBot, barWidth,
            barHeight)
        ctx.fillText(i.toString(), i * (barWidth + barSpacing) + offsetLeft + 10, canvas.height - 5)
    }
}

//отрисовка задней линии
function drawBackLines(maxValue){
    ctx.textBaseline="bottom"
    ctx.font = "bold 12px Times New Roman"

    let gridValue = 0
    for ( ; gridValue <= maxValue; gridValue += offsetForPaintBackLines) {
        let gridY = (canvas.height - offsetBot) * (1 - gridValue / maxValue)
        ctx.moveTo(0, gridY)
        ctx.lineTo(canvas.width, gridY)
        ctx.fillText(gridValue.toString(), 0,gridY + offsetBot)
    }
}

//добаление описания снизу гистограммы
function setSignature(){
    ctx.font = "bold 16px Times New Roman"
    //ctx.fillText(sig,canvas.width / 2 - sig.length * 2, 20)
    document.getElementById("series").innerHTML = document.getElementById("sig").value;
}

//отрисвока задней линии
function drawBackVerticalLines() {
    ctx.font = "bold 16px Times New Roman"

    let previous = 0
    for (let i = 0; i <= dArray.length; i++){
        if (i <= 1) {
            previous = (offsetLeft + barWidth + barSpacing / 2) * i
            ctx.moveTo((offsetLeft + barWidth + barSpacing / 2) * i, 0)
            ctx.lineTo((offsetLeft + barWidth + barSpacing / 2) * i, canvas.height - offsetBot)
        } else {
            ctx.moveTo(previous + barWidth + barSpacing, 0)
            ctx.lineTo(previous + barWidth + barSpacing, canvas.height - offsetBot)
            previous += barWidth + barSpacing
        }

        ctx.stroke()
    }
}

//творим гистограмму по сути главный метод
function makeHistogram(){
    let data = getNumbers()
    if (data === 0){
        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        return
    }

    setSizeHistogram(data)

    ctx.fillStyle = canvasColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    let maxValue = Math.max(...data)
    offsetForPaintBackLines = Math.round(maxValue / minOffset)

    ctx.fillStyle = colorRect
    drawRectangle(data, maxValue)

    ctx.fillStyle = color
    drawBackLines(maxValue)
    drawBackVerticalLines()
}



//если юзер нажал enter, то вызыввается функция для построения гистограммы
document.addEventListener( 'keyup', event => {
    if (event.code === 'Enter') {
        makeHistogram()
    }
});

//событие при наведении мышки на канвас
canvas.addEventListener('mousemove', displayInfo)

//скачивание канвас изображения в формате jpeg
document.getElementById('download').addEventListener('click', _ => {
    let dataUrl = canvas.toDataURL()
    let name = 'histogram.jpg'
    let link = document.createElement('a')
    link.href = dataUrl
    link.download = name
    link.click()
})

//отобржаение значения элемента гистограммы
function displayInfo(event) {
    let rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    let barIndex = Math.floor(x / (barWidth + barSpacing) - error)
    let barValue = dArray[barIndex]

    if (barValue !== undefined &&
        (canvas.height - y - offsetBot) <= rectHeight[barIndex]){
        infoBox.innerHTML = `Значение: ${barValue}`
    } else {
        infoBox.innerHTML = `Значение: `
    }
}

function setColor(colorHash){
    color = colorHash.target.value
    check()
}

function setRectColor(colorHash) {
    colorRect = colorHash.target.value
    check()
}

function setCanvasColor(colorHash){
    canvasColor = colorHash.target.value
    check()
}

function check(){
    if (dArray.length !== 0) {
        setSizeHistogram(dArray)

        ctx.fillStyle = canvasColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        let maxValue = Math.max(...dArray)
        offsetForPaintBackLines = Math.round(maxValue / minOffset)

        ctx.fillStyle = colorRect
        drawRectangle(dArray, maxValue)

        ctx.fillStyle = color
        drawBackLines(maxValue)
        drawBackVerticalLines()
    }
}