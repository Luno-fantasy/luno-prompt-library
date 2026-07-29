/* LUNO PROMPT ARCHIVE
   画像の見切れ調整は IMAGE_POSITIONS の数値だけ変更してください。
   書式: "画像パス": "横位置% 縦位置%"
   例: "images/sweet_11_female.jpg": "50% 20%"
*/

const IMAGE_POSITIONS = {
  "images/sweet_01_female.jpg": "50% 35%",
  "images/sweet_01_male.jpg": "50% 30%",
  "images/sweet_04_female.jpg": "50% 28%",
  "images/sweet_07_female.jpg": "50% 30%",
  "images/sweet_07_male.jpg": "50% 28%",
  "images/sweet_11_female.jpg": "50% 18%", // 金平糖：顔・羽を上寄りに表示
  "images/sweet_11_male.jpg": "50% 22%",
  "images/sweet_13_female.jpg": "50% 28%",
  "images/sweet_13_male.jpg": "50% 28%",
  "images/sweet_14_female.jpg": "50% 30%",
  "images/sweet_18_female.jpg": "50% 28%",
  "images/sweet_18_male.jpg": "50% 28%"
};

let currentItem = null;
let currentGender = "single";

function normalizeImagePath(path){
  if(!path) return "";
  try{
    return decodeURIComponent(path).replace(/^.*\/(images\/)/, "$1");
  }catch(error){
    return path.replace(/^.*\/(images\/)/, "$1");
  }
}

function getImagePosition(path){
  return IMAGE_POSITIONS[normalizeImagePath(path)] || "50% 50%";
}

function applyGalleryImagePositions(){
  document.querySelectorAll(".tile-visual img").forEach(img => {
    const path = img.getAttribute("src") || "";
    img.style.objectPosition = getImagePosition(path);
  });
}

function openPrompt(button){
  currentItem = JSON.parse(button.dataset.prompt);
  currentGender = currentItem.male ? "female" : "single";
  document.getElementById("modalTitle").textContent = currentItem.title;
  document.getElementById("modalSub").textContent = currentItem.tag || "Prompt Archive";

  const tabs = document.getElementById("genderTabs");
  if(currentItem.male){
    tabs.style.display = "flex";
    tabs.innerHTML = '<button class="active" onclick="setGender(\'female\',this)">Female</button><button onclick="setGender(\'male\',this)">Male</button>';
  }else{
    tabs.style.display = "none";
  }
  updateModal();
  document.getElementById("promptModal").classList.add("open");
  document.body.classList.add("lock");
}

function setGender(gender, button){
  currentGender = gender;
  document.querySelectorAll("#genderTabs button").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  updateModal();
}

function updateModal(){
  const prompt = currentGender === "male" ? currentItem.male : (currentItem.female || currentItem.prompt);
  const image = currentGender === "male" ? currentItem.maleImage : (currentItem.femaleImage || currentItem.image);
  document.getElementById("promptText").textContent = prompt || "";

  const img = document.getElementById("modalImage");
  if(image){
    img.src = image;
    img.style.objectPosition = getImagePosition(image);
    img.style.display = "block";
  }else{
    img.removeAttribute("src");
    img.style.removeProperty("object-position");
    img.style.display = "none";
  }
}

function closePrompt(){
  document.getElementById("promptModal").classList.remove("open");
  document.body.classList.remove("lock");
}

async function copyPrompt(){
  const text = document.getElementById("promptText").textContent;
  const button = document.getElementById("copyButton");
  try{
    await navigator.clipboard.writeText(text);
  }catch(error){
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  button.textContent = "Copied ✓";
  setTimeout(() => button.textContent = "Promptをコピー", 1400);
}

function filterTiles(input){
  const query = input.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll(".prompt-tile").forEach(tile => {
    const match = tile.dataset.search.toLowerCase().includes(query);
    tile.style.display = match ? "" : "none";
    if(match) visible++;
  });
  document.getElementById("emptyState").style.display = visible ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", applyGalleryImagePositions);

document.addEventListener("keydown", event => {
  if(event.key === "Escape") closePrompt();
});
