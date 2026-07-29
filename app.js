
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
  const prompt = currentGender === "male" ? currentItem.male : (currentItem.female || currentItem.prompt);
  const image = currentGender === "male" ? currentItem.maleImage : (currentItem.femaleImage || currentItem.image);
  document.getElementById("promptText").textContent = prompt || "";

  const img = document.getElementById("modalImage");
  if(image){
    img.src = image;
    img.style.display = "block";
  }else{
    img.removeAttribute("src");
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

document.addEventListener("keydown", event => {
  if(event.key === "Escape") closePrompt();
});
