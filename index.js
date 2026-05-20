console.log("script running");

const imageViewerXButton = document.getElementById("XOutImageViewer");
const imageViewer = document.querySelector(".imageViewer");
const imageViewerPicFrame = document.getElementById("imageViewerPicFrame");
const contactUsBtn = document.getElementById("contactButton");
const locationInfoDiv = document.querySelector(".locationInfo");

const fadeDuration = 100; // Duration of the fade effect in milliseconds
const fadeInterval = 25; // Interval for changing opacity in ms
const step = fadeInterval / fadeDuration;

const lerpColorDuration = 325;
const lerpColorInterval = 25;
const lerpColorStep = lerpColorInterval / lerpColorDuration;
const color1 = "#ffffff";
const color2 = "#fbfab6";

if (imageViewerXButton) {
    imageViewerXButton.addEventListener("click", closeImageViewer)
}   else {
    console.error("Could not find the image viewer X button");
}

if (contactUsBtn) {
    contactUsBtn.addEventListener("click", highlightContactSection)
}  else {
    console.error("Could not find the contact us button");
}

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
                imgBtnElement.addEventListener("click", () => {
                    openViewer(imgName);
                });
                imgBtnElement.src = `./imgs/previews/${imgName}`;
            }

            gallery.appendChild(wrapper.firstElementChild);
        });
    }
  })
    .catch(console.error);

function clamp(number, lower, upper) {
  return Math.min(Math.max(number, lower), upper)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function interpolateClr(color1, color2, percent) {
    // Convert the hex colors to RGB values
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    // Interpolate the RGB values
    const r = Math.round(r1 + (r2 - r1) * percent);
    const g = Math.round(g1 + (g2 - g1) * percent);
    const b = Math.round(b1 + (b2 - b1) * percent);

    // Convert the interpolated RGB values back to a hex color
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


function openViewer(imageName) {
    imageViewer.style.display = "flex";
    imageViewerPicFrame.src = "./imgs/" + imageName;

    let currentOpacity = parseFloat(imageViewer.style.opacity) || 0;
    const fading = setInterval(function () {
        newOpacity = clamp(currentOpacity += step, 0, 1);
        imageViewer.style.opacity = newOpacity;

        if (newOpacity >= 1) {
          clearInterval(fading);
        }
    }, fadeInterval);
}

function closeImageViewer() {
    let currentOpacity = parseFloat(imageViewer.style.opacity) || 1;
    let newOpacity = 0;

    const fading = setInterval(function() {
        newOpacity = clamp(currentOpacity -= step, 0, 1);
        imageViewer.style.opacity = newOpacity;

        if (newOpacity <= 0) {
            imageViewer.style.opacity = 0;
            imageViewer.style.display = "none";
            imageViewerPicFrame.src = "";
            clearInterval(fading);
        }
    }, fadeInterval);
}

function fadeLocationInfoWhite() {
    let currentAlpha = 0;
    let newAlpha = 0;

    const fadeBackWhite = setInterval(function() {
      console.log("Fading back to white");
      newAlpha = clamp(currentAlpha += lerpColorStep, 0, 1);
      locationInfoDiv.style.background = interpolateClr(color2, color1, newAlpha)

      if (newAlpha >= 1) {
        clearInterval(fadeBackWhite);
      }
    }, lerpColorInterval)
}

async function highlightContactSection() {
    if (!locationInfoDiv) {
      console.error("Tried to scroll to location info but the div was not found.");
      return
    }

    locationInfoDiv.scrollIntoView({
      behavior: "smooth",
    })

    await sleep(750);

    let currentAlpha = 0;
    let newAlpha = 0;

    const fadeToTint = setInterval(function() {
      console.log("Fading to yellow?")
      newAlpha = clamp(currentAlpha += lerpColorStep, 0, 1);
      locationInfoDiv.style.background = interpolateClr(color1, color2, newAlpha);

      if (newAlpha >= 1) {
        clearInterval(fadeToTint);

        fadeLocationInfoWhite();
      }
    }, lerpColorInterval);
}