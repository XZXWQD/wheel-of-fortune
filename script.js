const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spin-button");
const resultContainer = document.getElementById("result-container");
const resultText = document.getElementById("result-text");

canvas.width = 400;
canvas.height = 400;

let rotation = 0;
let spinning = false;

// Призы с шансами
const segments = [
    { name: "Промокод", chance: 50 },
    { name: "Пусто", chance: 40 },
    { name: "М9", chance: 0 },
    { name: "5000 голды", chance: 0 },
    { name: "100 голды", chance: 0 },
    { name: "200 голды", chance: 0 }
];

// Цвета для сегментов (каждый цвет для одного сегмента)
const colors = [
    "#FFC107", "#FF5722", "#4CAF50", "#3F51B5", "#9C27B0", "#FF9800"
];

// Фильтруем только те сегменты, которые имеют шанс больше 0 (Промокод и Пусто)
const validSegments = segments.filter(segment => segment.chance > 0);

function drawWheel() {
    const anglePerSegment = (2 * Math.PI) / segments.length; // одинаковые углы для всех сегментов

    let angleOffset = 0;

    // Рисуем каждый сегмент колеса
    segments.forEach((segment, i) => {
        const angle = anglePerSegment; // угол для текущего сегмента
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, angleOffset, angleOffset + angle);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        // Пишем название сегмента
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(angleOffset + angle / 2);
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(segment.name, 120, 10);
        ctx.restore();

        angleOffset += angle;
    });
}

function spinWheel() {
    if (spinning) return;

    // Проверка, был ли уже клик по кнопке (покрутил ли пользователь колесо)
    if (localStorage.getItem("hasSpun") === "true") {
        alert("Вы уже покрутили колесо!");
        return;
    }

    spinning = true;
    resultContainer.style.display = "none";
    let currentSpeed = 50; // начальная скорость
    const deceleration = 0.98; // замедление
    const totalRotation = Math.random() * 360 + 720; // общая ротация (2+ оборота)

    // Выбираем случайный приз среди "Промокод" и "Пусто"
    const stopAt = validSegments[Math.floor(Math.random() * validSegments.length)];

    // Находим индекс выбранного приза
    const stopAngle = (segments.findIndex(segment => segment.name === stopAt.name)) * (360 / segments.length);

    // Вычисляем угол остановки на выбранном призе
    const targetRotation = stopAngle + totalRotation;

    // Интервал для анимации вращения колеса
    const interval = setInterval(() => {
        rotation += currentSpeed;
        currentSpeed *= deceleration;

        if (currentSpeed < 0.5) {
            clearInterval(interval);
            spinning = false;
            rotation = targetRotation; // Устанавливаем точный угол остановки на выбранный приз
            showResult(stopAt); // Отображаем результат
            // Помечаем, что пользователь покрутил колесо
            localStorage.setItem("hasSpun", "true");
        }

        rotation %= 360;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-200, -200);
        drawWheel();
        ctx.restore();
    }, 16); // 60 FPS
}

function showResult(prize) {
    resultContainer.style.display = "block";
    resultText.innerHTML = `
        <p>Вы выиграли: <strong>${prize.name}</strong></p>
        <p>Отправьте скриншот продавцу: XZXWQD STORE</p>
    `;
}

// Инициализация
drawWheel();

// Проверка, если пользователь уже крутил колесо, блокируем кнопку
if (localStorage.getItem("hasSpun") === "true") {
    spinButton.disabled = true;
    spinButton.innerText = "Вы уже покрутили колесо";
}

spinButton.addEventListener("click", spinWheel);
