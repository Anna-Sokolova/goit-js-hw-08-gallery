import images from "./gallery-items.js";
// console.log(images); - это мой массив картинок!

// ---1--- Создание и рендер разметки по массиву данных и предоставленному шаблону.

//3 Получение доступов к узлам DOM
const galleryRef = document.querySelector(".js-gallery");
const lagreImage = document.querySelector("img.lightbox__image");
const openModalImage = document.querySelector("div.lightbox");
const closeModalImageOnOverlay = document.querySelector(
  "div.lightbox__overlay"
);
const closeBtnRef = document.querySelector(
  'button[data-action="close-lightbox"]'
);
const imagesMarkup = createGalleryItemsMarkup(images);
let indexImage = 0; // задаем начальное значение индекса в глобальной переменной

//1 Функция для создания одного элемента изображения
function createGalleryItemsMarkup(images) {
  return images
    .map(({ preview, original, description }, index) => {
      return `
        <li class="gallery__item">
        <a
        class="gallery__link"
        href="${original}"
        >
        <img
        class="gallery__image"
        src="${preview}"
        data-source="${original}"
        data-index="${index}"
        alt="${description}"
        />
        </a>
        </li>
        `;
    })
    .join("");
}
//2 Добавление шаблона в разметку
galleryRef.insertAdjacentHTML("beforeend", imagesMarkup);

// ---2--- Реализация делегирования на галерее ul.js-gallery и модальное окно

//1 Вешаем слушателя событий на клик на общий ul галлереи
galleryRef.addEventListener("click", onGalleryClick);

//Закрытие модального окна по клику на кнопку
closeBtnRef.addEventListener("click", closeModalImage);

//Закрытие модального окна по клику на div.lightbox__overlay
closeModalImageOnOverlay.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) {
    closeModalImage();
  }
});

//2 Создаем функцию для открытия и закрытия модального окна
function onGalleryClick(event) {
  event.preventDefault();

  if (!event.target.classList.contains("gallery__image")) {
    return;
  }
  // получение url большого изображения
  const largeImageUrl = event.target.dataset.source;

  //подмена src с превью на большое изображение вариант 1
  //   lagreImage.setAttribute("src", largeImageUrl);
  // ИЛИ вариант 2
  //вынесли в отдельную функцию подмену src image и вызываем эту функцию
  setLargeImageSrc(largeImageUrl);

  //получение индекса большого изображения при открытии модального окна
  indexImage = Number(event.target.dataset.index);

  // Открытие модального окна по клику на элементе галереи.
  openModalImage.classList.add("is-open");

  // Закрытие модального окна по нажатию клавиши ESC
  window.addEventListener("keydown", onPressEscape);
  //Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".
  window.addEventListener("keydown", flippingImages);
}

// функция для подмены src с превью на большое изображение
function setLargeImageSrc(url) {
  lagreImage.src = url;
}

//Функция для закрытия модального окна с очисткой значения атрибута src
function closeModalImage() {
  openModalImage.classList.remove("is-open");
  lagreImage.src = "";
  window.removeEventListener("keydown", onPressEscape);
  window.removeEventListener("keydown", flippingImages);
}

//Функция для закрытия модального окна по ESC
function onPressEscape(event) {
  if (event.code === "Escape") {
    closeModalImage();
  }
}

//Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".
function flippingImages(event) {
  if (event.code === "ArrowRight") {
    indexImage += 1;
    if (indexImage >= images.length) {
      indexImage = 0;
    }
    lagreImage.src = images[indexImage].original;
  } else if (event.code === "ArrowLeft") {
    indexImage -= 1;
    if (indexImage < 0) {
      indexImage = images.length - 1;
    }
    lagreImage.src = images[indexImage].original;
  }
}
