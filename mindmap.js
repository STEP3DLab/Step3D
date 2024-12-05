// mindmap.js

// Инициализация сцены, камеры и рендерера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('mindmapCanvas').appendChild(renderer.domElement);

// Добавление освещения
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Загрузка шрифта для объемного текста "Step3D"
const fontLoader = new THREE.FontLoader();
let step3DText;

fontLoader.load('fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new THREE.TextGeometry('Step3D', {
        font: font,
        size: 1,
        height: 0.3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 5
    });

    const textMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff, // Белый цвет для контраста
        shininess: 100
    });
    step3DText = new THREE.Mesh(textGeometry, textMaterial);

    // Центрирование текста
    textGeometry.computeBoundingBox();
    const centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
    step3DText.position.x = centerOffset;
    step3DText.position.y = 0;
    step3DText.position.z = 1.1; // Немного перед сферой

    scene.add(step3DText);
});

// Создание центральной сферы
const centralGeometry = new THREE.SphereGeometry(2, 64, 64);

// Создание градиентного материала для центральной сферы
const centralMaterial = new THREE.MeshPhongMaterial({
    color: 0x00D084, // Начальный цвет
    emissive: 0x009688, // Для эффекта переливания
    emissiveIntensity: 0.2,
    shininess: 100,
    // Добавление текстуры градиента (опционально)
});

// Создание центральной сферы
const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
centralSphere.position.set(0, 0, 0);
scene.add(centralSphere);

// Создание эффекта искр
const sparkleGeometry = new THREE.BufferGeometry();
const sparkleCount = 100;
const sparklePositions = [];

for (let i = 0; i < sparkleCount; i++) {
    const x = (Math.random() - 0.5) * 4;
    const y = (Math.random() - 0.5) * 4;
    const z = (Math.random() - 0.5) * 4;
    sparklePositions.push(x, y, z);
}

sparkleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sparklePositions, 3));

const sparkleMaterial = new THREE.PointsMaterial({
    color: 0x00D084,
    size: 0.05,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});

const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
centralSphere.add(sparkles);

// Создание интеллектуальной карты (разделы)

// Создание группы для разделов, чтобы легко вращать их вокруг сферы
const sectionsGroup = new THREE.Group();
scene.add(sectionsGroup);

// Информация об узлах интеллект-карты
const nodesData = [
    // Ваши данные узлов
    {
        name: '3D-сообщества',
        color: 0x00D084,
        position: { x: 6, y: 3, z: 0 },
        icon: 'assets/icons/3d_communities.png',
        link: '#3d-communities',
        children: [
            {
                name: 'О нас',
                color: 0x00D084,
                position: { x: 8, y: 4, z: 1 },
                icon: 'assets/icons/about_us.png',
                link: '#3d-communities'
            },
            {
                name: 'Эксперты',
                color: 0x00D084,
                position: { x: 8, y: 3, z: -1 },
                icon: 'assets/icons/experts.png',
                link: '#3d-communities'
            },
            {
                name: 'Контакты',
                color: 0x00D084,
                position: { x: 6, y: 2, z: -3 },
                icon: 'assets/icons/contacts.png',
                link: '#contacts',
                children: [
                    {
                        name: 'Телеграм',
                        color: 0x00D084,
                        position: { x: 5, y: 1, z: -5 },
                        icon: 'assets/icons/telegram.png',
                        link: '#contacts'
                    },
                    {
                        name: 'Телефон',
                        color: 0x00D084,
                        position: { x: 6, y: 0, z: -5 },
                        icon: 'assets/icons/phone.png',
                        link: '#contacts'
                    },
                    {
                        name: 'Почта',
                        color: 0x00D084,
                        position: { x: 7, y: 1, z: -5 },
                        icon: 'assets/icons/email.png',
                        link: '#contacts'
                    }
                ]
            }
        ]
    },
    {
        name: 'Обучение',
        color: 0x0059FF,
        position: { x: -6, y: 3, z: 0 },
        icon: 'assets/icons/education.png',
        link: '#education',
        children: [
            {
                name: 'Реверсивный инжиниринг и аддитивное производство',
                color: 0x0059FF,
                position: { x: -8, y: 4, z: 1 },
                icon: 'assets/icons/reverse_engineering.png',
                link: '#education'
            },
            {
                name: 'Искусственный интеллект для целей обучения',
                color: 0x0059FF,
                position: { x: -8, y: 3, z: -1 },
                icon: 'assets/icons/ai_education.png',
                link: '#education'
            }
        ]
    },
    {
        name: 'Блог',
        color: 0x00D084,
        position: { x: 0, y: 6, z: 0 },
        icon: 'assets/icons/blog.png',
        link: '#blog',
        children: [
            {
                name: 'Телеграм-канал',
                color: 0x00D084,
                position: { x: 0, y: 8, z: 1 },
                icon: 'assets/icons/telegram_channel.png',
                link: '#blog'
            },
            {
                name: 'Статьи на Дзен',
                color: 0x00D084,
                position: { x: 0, y: 8, z: -1 },
                icon: 'assets/icons/zen_articles.png',
                link: '#blog'
            },
            {
                name: 'Дневник Никиты Шахтера',
                color: 0x00D084,
                position: { x: 0, y: 8, z: -3 },
                icon: 'assets/icons/nikita_diary.png',
                link: '#blog'
            }
        ]
    },
    {
        name: 'Документы',
        color: 0x0059FF,
        position: { x: 0, y: -6, z: 0 },
        icon: 'assets/icons/documents.png',
        link: '#documents',
        children: [
            {
                name: 'Политика',
                color: 0x0059FF,
                position: { x: 0, y: -8, z: 1 },
                icon: 'assets/icons/policy.png',
                link: '#documents'
            },
            {
                name: 'Оферты',
                color: 0x0059FF,
                position: { x: 0, y: -8, z: -1 },
                icon: 'assets/icons/offers.png',
                link: '#documents'
            },
            {
                name: 'Полезные материалы',
                color: 0x0059FF,
                position: { x: 0, y: -8, z: -3 },
                icon: 'assets/icons/useful_materials.png',
                link: '#documents'
            }
        ]
    },
    {
        name: 'Проекты',
        color: 0x00D084,
        position: { x: 6, y: -3, z: 0 },
        icon: 'assets/icons/projects.png',
        link: '#projects',
        children: [
            {
                name: 'StepAI',
                color: 0x00D084,
                position: { x: 8, y: -4, z: 0 },
                icon: 'assets/icons/stepai.png',
                link: '#projects'
            }
        ]
    }
];

// Создание узлов и линий
const nodes = [];
const lines = [];

const textureLoader = new THREE.TextureLoader();

// Функция для создания узла
function createNode(data, index) {
    // Конечная позиция относительно группы разделов
    const endPosition = new THREE.Vector3(data.position.x, data.position.y, data.position.z);

    // Создание материала узла с градиентом
    const nodeMaterial = new THREE.MeshPhongMaterial({
        color: data.color,
        emissive: 0x333333,
        shininess: 100
    });

    // Создание геометрии узла
    const nodeGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.copy(endPosition);
    node.userData = { link: data.link };
    sectionsGroup.add(node);
    nodes.push(node);

    // Создание линии от центральной сферы к узлу
    const points = [];
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(endPosition.clone());
    const geometryLine = new THREE.BufferGeometry().setFromPoints(points);
    const materialLine = new THREE.LineBasicMaterial({ color: data.color });
    const line = new THREE.Line(geometryLine, materialLine);
    scene.add(line);
    lines.push(line);

    // Если есть дочерние узлы, рекурсивно их создаем
    if (data.children && data.children.length > 0) {
        data.children.forEach((child, childIndex) => {
            createNode(child, index * 10 + childIndex); // Увеличиваем индекс для дочерних узлов
        });
    }
}

// Создание всех узлов
nodesData.forEach((data, index) => {
    createNode(data, index);
});

// Позиционирование камеры
camera.position.set(0, 0, 20);

// Инициализация OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Плавное движение
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 50;

// Добавление Raycaster для интерактивности
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Функция для обработки кликов
function onClick(event) {
    // Получение позиции мыши
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Определение пересечений
    const intersects = raycaster.intersectObjects(nodes);

    if (intersects.length > 0) {
        const clickedNode = intersects[0].object;
        const link = clickedNode.userData.link;
        if (link) {
            // Плавная прокрутка к секции
            document.querySelector(link).scrollIntoView({ behavior: 'smooth' });
        }
    }
}

window.addEventListener('click', onClick, false);

// Загрузка 3D-телевизора
function loadTVModel() {
    const objLoader = new THREE.OBJLoader();
    objLoader.load(
        'assets/tv/tv_model.obj', // Путь к вашей 3D-модели телевизора
        function (object) {
            // Назначение имени объекту для дальнейшего доступа
            object.name = 'TV';

            // Настройка масштаба и позиции телевизора
            object.scale.set(1, 1, 1);
            object.position.set(0, 2, -5); // Расположение телевизора над вводом

            // Применение текстуры
            const texture = textureLoader.load('assets/tv/tv_texture.jpg');
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = texture;
                }
            });

            scene.add(object);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% загружено');
        },
        function (error) {
            console.error('Ошибка при загрузке модели телевизора:', error);
        }
    );
}

loadTVModel();

// Анимация бегущей строки на телевизоре
function addScrollingText() {
    const loader = new THREE.TextureLoader();
    const textTexture = loader.load('assets/tv/scrolling_text.png'); // Создайте изображение с бегущей строкой

    const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true
    });

    const textGeometry = new THREE.PlaneGeometry(4, 0.5);
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 1, 0); // Расположите текст внутри телевизора

    const tv = scene.getObjectByName('TV');
    if (tv) {
        tv.add(textMesh);
    }

    // Анимация движения текста
    function animateText() {
        textMesh.position.x += 0.01;
        if (textMesh.position.x > 2) {
            textMesh.position.x = -2;
        }
        requestAnimationFrame(animateText);
        renderer.render(scene, camera);
    }

    animateText();
}

// Вызов функции после загрузки телевизора
setTimeout(addScrollingText, 2000); // Задержка, чтобы телевизор успел загрузиться

// Анимация
function animate() {
    requestAnimationFrame(animate);

    // Обновление Tween.js
    TWEEN.update();

    // Вращение центральной сферы вокруг своей оси
    centralSphere.rotation.y += 0.005;

    // Вращение группы разделов вокруг центральной сферы как мельница
    sectionsGroup.rotation.y += 0.002;

    // Вращение объемного текста
    if (step3DText) {
        step3DText.rotation.y += 0.005;
    }

    // Вращение искр
    sparkles.rotation.y += 0.01;

    // Шевеление телевизора
    const tv = scene.getObjectByName('TV');
    if (tv) {
        tv.rotation.y += 0.001; // Плавное вращение
        tv.position.y += Math.sin(Date.now() * 0.001) * 0.001; // Небольшие вертикальные колебания
    }

    // Обновление контролов
    controls.update();

    renderer.render(scene, camera);
}

animate();

// Обработка изменения размера окна
function onWindowResize() {
    const container = document.getElementById('mindmapCanvas');
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

window.addEventListener('resize', onWindowResize, false);
onWindowResize(); // Вызов при загрузке

// Обработчик бургер-меню
const burger = document.getElementById('burgerMenu');
const menu = document.getElementById('menu');

burger.addEventListener('click', () => {
    menu.classList.toggle('active');
    burger.classList.toggle('active'); // Для анимации бургер-меню
});

// Получение элементов модального окна
const aiModal = document.getElementById('aiModal');
const aiButton = document.getElementById('aiAssistant');
const closeAI = document.getElementById('closeAI');

// Открытие модального окна при клике на кнопку AI-ассистента
aiButton.addEventListener('click', () => {
    aiModal.style.display = 'block';
});

// Закрытие модального окна при клике на кнопку закрытия
closeAI.addEventListener('click', () => {
    aiModal.style.display = 'none';
});

// Закрытие модального окна при клике вне его содержимого
window.addEventListener('click', (event) => {
    if (event.target == aiModal) {
        aiModal.style.display = 'none';
    }
});

// Функция для фокусировки камеры на узел по имени
function focusOnNode(nodeName) {
    const node = nodes.find(n => n.userData.link === `#${nodeName.toLowerCase().replace(/\s+/g, '-')}`);
    if (node) {
        // Плавное перемещение камеры к узлу
        new TWEEN.Tween(camera.position)
            .to({
                x: node.position.x,
                y: node.position.y,
                z: node.position.z + 5 // Расстояние от узла
            }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();

        // Поворот камеры к узлу
        new TWEEN.Tween(controls.target)
            .to({
                x: node.position.x,
                y: node.position.y,
                z: node.position.z
            }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    }
}

// Обработка кликов на хэштеги
const hashtags = document.querySelectorAll('.hashtag');

hashtags.forEach(hashtag => {
    hashtag.addEventListener('click', () => {
        const query = hashtag.textContent.substring(1); // Удаляем символ #
        // Пример фокусировки камеры на соответствующем узле
        focusOnNode(query);
    });
});

// Обработка ввода в строку AI-ассистента
const aiInput = document.querySelector('.ai-input');
const goButton = document.getElementById('goButton');

goButton.addEventListener('click', () => {
    const query = aiInput.value.trim();
    if (query) {
        initiateAIProcess(query);
    }
});

// Функция для инициирования процесса AI
function initiateAIProcess(query) {
    const inputContainer = document.querySelector('.ai-input-container');
    const inputWrapper = document.querySelector('.input-wrapper');

    // Анимация сворачивания поля ввода и перемещения кнопки Go в круг
    inputWrapper.classList.add('animate-collapse');

    // Создаем сферу с использованием Three.js после сворачивания
    setTimeout(() => {
        // Создаем сферу
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x0059FF,
            emissive: 0x009688,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, -10); // Позиционируем сферу перед камерой
        scene.add(sphere);

        // Анимация превращения круга в сферу с деформацией и переливами
        new TWEEN.Tween(sphere.scale)
            .to({ x: 5, y: 5, z: 5 }, 2000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(() => {
                // Добавление деформации (используем шум)
                const time = Date.now() * 0.001;
                sphere.geometry.vertices.forEach((vertex) => {
                    const offset = sphere.geometry.parameters.radius * 0.1;
                    vertex.x += Math.sin(time + vertex.x) * 0.05;
                    vertex.y += Math.sin(time + vertex.y) * 0.05;
                    vertex.z += Math.sin(time + vertex.z) * 0.05;
                });
                sphere.geometry.verticesNeedUpdate = true;

                // Перелив цветов
                sphere.material.color.setHSL((time % 1), 0.7, 0.5);
            })
            .onComplete(() => {
                // После завершения анимации запускаем обратный процесс
                displayAIAnswer(query, sphere);
            })
            .start();
    }, 500); // Задержка для завершения сворачивания
}

// Функция для отображения ответа AI
function displayAIAnswer(query, sphere) {
    // Удаляем сферу с сцены
    scene.remove(sphere);

    // Возвращаем input-wrapper в исходное состояние
    const inputWrapper = document.querySelector('.input-wrapper');
    inputWrapper.classList.remove('animate-collapse');

    // Анимация возвращения поля ввода и кнопки Go
    setTimeout(() => {
        inputWrapper.classList.add('animate-expand');
    }, 500);

    // Отображение текста ответа
    // Обновляем поле ввода с сообщением о обработке запроса и блокируем его
    aiInput.value = "Обрабатывается ваш запрос...";
    aiInput.disabled = true;

    // Симуляция получения ответа AI через задержку
    setTimeout(() => {
        // Здесь можно интегрировать реальный AI-ассистент
        const aiAnswer = `Ваш запрос "${query}" был успешно обработан. Вот ответ от AI-ассистента.`;

        // Отображение ответа в поле ввода
        aiInput.value = aiAnswer;
        aiInput.disabled = false;

        // Анимация деформации поля ввода для отображения ответа
        const inputWrapper = document.querySelector('.input-wrapper');
        inputWrapper.classList.add('animate-expand-answer');

        // Удаление класса после анимации
        setTimeout(() => {
            inputWrapper.classList.remove('animate-expand-answer');
        }, 2000);
    }, 3000); // Задержка для симуляции обработки
}

// Примерная функция для отправки запроса к AI-ассистенту
function sendAIRequest(query) {
    // Реализуйте интеграцию с вашим AI-ассистентом здесь
    // Например, используя Fetch API для отправки запроса на сервер
    fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: query })
    })
    .then(response => response.json())
    .then(data => {
        // Обработка ответа от AI
        alert(`AI-ассистент: ${data.answer}`);
    })
    .catch(error => {
        console.error('Ошибка при запросе к AI:', error);
    });
}
const intellectMapButton = document.getElementById('intellectMapButton');

intellectMapButton.addEventListener('click', () => {
    // Логика открытия или показа интеллект-карты
    const mindmapSection = document.getElementById('mindmap');
    mindmapSection.scrollIntoView({ behavior: 'smooth' });
});
document.querySelectorAll('.story').forEach((story, index) => {
    story.addEventListener('click', () => {
        alert(`Сторис ${index + 1} выбран!`); // Здесь можно добавить логику показа сторис.
    });
});
