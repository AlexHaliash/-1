// Основные переменные
let scene, camera, renderer;
let letterG;

// Инициализация сцены, камеры и рендерера
function init() {
    // Сцена
    scene = new THREE.Scene();
    
    // Камера (поля зрения, аспекта, дальний и ближний клиппинг)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Рендерер
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Создание каркасной модели буквы Г
    createLetterG();
    
    // Установка камеры
    camera.position.z = 10;
    
    // Запуск анимации
    animate();
}

// Функция создания каркасной модели буквы Г
function createLetterG() {
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    
    // Геометрия буквы Г
    const points = [];

    // Внешняя рамка буквы Г
    points.push(new THREE.Vector3(-5, 5, 0)); // Верхняя линия
    points.push(new THREE.Vector3(5, 5, 0));
    const topLine = new THREE.BufferGeometry().setFromPoints(points);
    const topLineObject = new THREE.Line(topLine, material);
    scene.add(topLineObject);
    points.length = 0;

    points.push(new THREE.Vector3(-5, 5, 0)); // Линия слева
    points.push(new THREE.Vector3(-5, -5, 0));
    const leftLine = new THREE.BufferGeometry().setFromPoints(points);
    const leftLineObject = new THREE.Line(leftLine, material);
    scene.add(leftLineObject);
    points.length = 0;

    points.push(new THREE.Vector3(-5, -5, 0)); // Нижняя линия
    points.push(new THREE.Vector3(0, -5, 0));
    const bottomLine = new THREE.BufferGeometry().setFromPoints(points);
    const bottomLineObject = new THREE.Line(bottomLine, material);
    scene.add(bottomLineObject);
    }

// Функция анимации
function animate() {
    requestAnimationFrame(animate);

    // Анимация вращения
    scene.rotation.x += 0.01;
    scene.rotation.y += 0.01;

    // Отображаем сцену
    renderer.render(scene, camera);
}

// Обработчик события изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Инициализация
init();
