console.log("script running");

fetch('./Image_List.json')
  .then(response => response.json())
  .then(data => {
    const gallery = document.getElementById('workGallery');

    for (const imgName of data) {
      fetch('./imageButton.html')
        .then(response => response.text())
        .then(imgBtn => {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = imgBtn;

          const imgBtnElement = wrapper.querySelector('.imageGalleryButtonImgs');
          if (imgBtnElement) {
            imgBtnElement.addEventListener("click", clickButton)
            imgBtnElement.src = `./imgs/previews/${imgName}`;
          }

          gallery.appendChild(wrapper.firstElementChild);
        });
    }
  })
  .catch(console.error);

function clickButton() {
    console.log("uh wtf");
}