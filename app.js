let currentItem = null;
let currentGender = "single";

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
  const prompt = currentGender === "male"
    ? currentItem.male
    : (currentItem.female || currentItem.prompt);

  const image = currentGender === "male"
    ? currentItem.maleImage
    : (currentItem.femaleImage || currentItem.image);

  document.getElementById("promptText").textContent = prompt || "";

  const img = document.getElementById("modalImage");
  if(image){
    img.src = image;
    img.alt = currentItem.title || "";
    img.style.display = "block";
  }else{
    img.removeAttribute("src");
    img.style.display = "none";
  }

  const qualitySection = document.getElementById("qualitySection");
  const qualityText = document.getElementById("qualityText");
  if(qualitySection && qualityText){
    if(currentItem.qualityTags){
      qualityText.textContent = currentItem.qualityTags;
      qualitySection.style.display = "block";
    }else{
      qualityText.textContent = "";
      qualitySection.style.display = "none";
    }
  }

  const negativeSection = document.getElementById("negativeSection");
  const negativeText = document.getElementById("negativeText");
  if(negativeSection && negativeText){
    if(currentItem.negativeTags){
      negativeText.textContent = currentItem.negativeTags;
      negativeSection.style.display = "block";
    }else{
      negativeText.textContent = "";
      negativeSection.style.display = "none";
    }
  }
}

function closePrompt(){
  document.getElementById("promptModal").classList.remove("open");
  document.body.classList.remove("lock");
}

async function writeClipboard(text){
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
}

async function copyPrompt(){
  const text = document.getElementById("promptText").textContent;
  const button = document.getElementById("copyButton");
  await writeClipboard(text);
  button.textContent = "Copied ✓";
  setTimeout(() => button.textContent = "Promptをコピー", 1400);
}

async function copyQualityTags(){
  const text = document.getElementById("qualityText").textContent;
  const button = document.getElementById("qualityCopyButton");
  await writeClipboard(text);
  button.textContent = "Copied ✓";
  setTimeout(() => button.textContent = "品質タグをコピー", 1400);
}

function filterTiles(input){
  const query = input.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll(".prompt-tile").forEach(tile => {
    const match = tile.dataset.search.toLowerCase().includes(query);
    tile.style.display = match ? "" : "none";
    if(match) visible++;
  });
  const emptyState = document.getElementById("emptyState");
  if(emptyState) emptyState.style.display = visible ? "none" : "block";
}

document.addEventListener("keydown", event => {
  if(event.key === "Escape") closePrompt();
});

async function copyNegativeTags(){
  const text = document.getElementById("negativeText").textContent;
  const button = document.getElementById("negativeCopyButton");
  await writeClipboard(text);
  button.textContent = "Copied ✓";
  setTimeout(() => button.textContent = "ネガティブをコピー", 1400);
}
