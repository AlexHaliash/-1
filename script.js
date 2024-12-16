// Основные переменные
let scene, camera, renderer;
let letterG;

// Инициализация сцены, камеры и рендерера
function init() {
    // Сцена
    scene = new THREE.Scene();
    
    // Камера
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    
    // Рендерер
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Создание буквы Г
    createLetterG();
    
    // Запуск анимации
    animate();
}

// Создание каркасной модели буквы Г
function createLetterG() {
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const points = [];

    // Верхняя линия
    points.push(new THREE.Vector3(-5, 5, 0), new THREE.Vector3(5, 5, 0));
    const topLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
    scene.add(topLine);

    // Левая линия
    points.length = 0;
    points.push(new THREE.Vector3(-5, 5, 0), new THREE.Vector3(-5, -5, 0));
    const leftLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
    scene.add(leftLine);

    // Нижняя линия
    points.length = 0;
    points.push(new THREE.Vector3(-5, -5, 0), new THREE.Vector3(0, -5, 0));
    const bottomLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
    scene.add(bottomLine);

    // Объединение линий
    letterG = new THREE.Group();
    letterG.add(topLine, leftLine, bottomLine);
    scene.add(letterG);
}

// Анимация
function animate() {
    requestAnimationFrame(animate);

    // Отображение сцены
    renderer.render(scene, camera);
}

// Масштабирование объекта
function scaleObject(scaleFactor) {
    letterG.scale.multiplyScalar(scaleFactor);
}

// Перемещение объекта
function translateObject(x, y, z) {
    letterG.position.x += x;
    letterG.position.y += y;
    letterG.position.z += z;
}

// Вращение объекта вокруг произвольной оси
function rotateObject(angle, axis) {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis.normalize(), angle);
    letterG.quaternion.multiplyQuaternions(quaternion, letterG.quaternion);
}

// Обновление сцены при изменении размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Инициализация
init();
