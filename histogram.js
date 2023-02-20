//отступы слева и сверху
let offsetBot = 20
let offsetLeft = 20

//ширина колонки и расстояние между колонками
let barWidth = 30
let barSpacing = 10

//высота колонок
let rectHeight = []

//элемент где будет отрисовываться диаграмма
let canvas = document.getElementById('histogram')

//инфа о прямоугольнике
let infoBox = document.getElementById('info-box')

//контекст для рисования на холсте
let ctx = canvas.getContext('2d')

//разница значений для отрисовки боковых линий
let offsetForPaintBackLines = 5

//массив
let dArray = []

//функция для получения чисел
function getNumbers(){
    let dataInput = document.getElementById('dataInput')
    let data = dataInput.value.split(',')
    dArray = data
    for (let i = 0; i < data.length; i++) {
        data[i] = parseFloat(data[i])
    }
    return data
}

//установка размера холста, если холст больше размеров экрана то мы катапультируемся
function setSizeHistogram(data){
    canvas.width = data.length * 41 + barWidth + offsetBot
    canvas.height = 600

    if (canvas.width > window.innerWidth){
        canvas.width = window.innerWidth
    }
    return canvas.width < window.innerWidth
}

//отрисовка столбца гистограммы
function drawRectangle(data, maxValue){
    ctx.fillStyle = 'MidnightBlue'
    ctx.font = "bold 10px Times New Roman"

    for (let i = 0; i < data.length; i++) {
        let barHeight = data[i] / maxValue * (canvas.height - offsetBot)
        rectHeight[i] = barHeight
        ctx.fillRect(i * (barWidth + barSpacing) + offsetLeft, canvas.height - barHeight - offsetBot, barWidth,
            barHeight)
    }
}

//отрисовка задней линии
function drawBackLines(maxValue){
    ctx.fillStyle = "#000000"
    ctx.textBaseline="bottom"
    ctx.font = "bold 12px Times New Roman"
    let gridValue = 0

    for ( ; gridValue <= maxValue; gridValue += offsetForPaintBackLines) {
        let gridY = (canvas.height - offsetBot) * (1 - gridValue / maxValue)
        ctx.moveTo(0, gridY)
        ctx.lineTo(canvas.width, gridY)
        ctx.stroke()
        ctx.fillText(gridValue.toString(), 0,gridY + offsetBot)
    }
}

//добаление описания снизу гистограммы
function setSignature(){
    ctx.font = "bold 16px Times New Roman"
    let sig = document.getElementById("sig").value
    ctx.fillText(sig,canvas.width / 2 - sig.length * 2, canvas.height - 2)
}

//отрисвока задней линии
function drawBackVerticalLines() {
    ctx.fillStyle = "#000000"
    ctx.font = "bold 12px Times New Roman"

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
    if (!setSizeHistogram(data)){
        return
    }
    let maxValue = Math.max(...data)
    offsetForPaintBackLines = Math.round(maxValue / 5)
    drawRectangle(data, maxValue)
    drawBackLines(maxValue)
    drawBackVerticalLines()
    setSignature()
}

//если юзер нажал enter то вызыввается функция для построения гистограммы
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
    console.log(dataUrl)
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

    let barIndex = Math.floor(x / (barWidth + barSpacing) - 0.3)
    let barValue = dArray[barIndex]

    if (barValue !== undefined &&
        (canvas.height - y) <= rectHeight[barIndex]){
        infoBox.innerHTML = `Value: ${barValue}`
    } else {
        infoBox.innerHTML = `Value: `
    }
}