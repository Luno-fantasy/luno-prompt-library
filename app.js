let currentItem = null;
let currentGender = "single";
let promptTrigger = null;
let savedScrollY = 0;

function openPrompt(button){
  promptTrigger = button;
  savedScrollY = window.scrollY;
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
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.querySelector("main").inert = true;
  document.getElementById("promptModal").setAttribute("aria-hidden", "false");
  document.querySelector(".modal-sheet").scrollTop = 0;
  document.querySelector(".modal-close").focus();
  syncGenderTabs();
}

function setGender(gender, button){
  currentGender = gender;
  document.querySelectorAll("#genderTabs button").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  updateModal();
  syncGenderTabs();
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

function syncGenderTabs(){
  document.querySelectorAll("#genderTabs button").forEach((button, index) => {
    button.setAttribute("aria-pressed", String((index === 0 ? "female" : "male") === currentGender));
  });
}

function closePrompt(){
  const modal = document.getElementById("promptModal");
  if(!modal || !modal.classList.contains("open")) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.querySelector("main").inert = false;
  document.body.classList.remove("lock");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo({top: savedScrollY, behavior: "instant"});
  promptTrigger?.focus({preventScroll: true});
}

async function writeClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
  }catch(error){
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("aria-label", "コピー用テキスト");
    area.style.cssText = "position:fixed;left:0;top:0;opacity:0;font-size:16px";
    document.querySelector(".modal-sheet").appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    const copied = document.execCommand("copy");
    area.remove();
    if(!copied) throw new Error("Clipboard unavailable");
  }
}

async function copyText(textId, buttonId){
  const button = document.getElementById(buttonId);
  const original = button.dataset.label || button.textContent;
  button.dataset.label = original;
  try{
    await writeClipboard(document.getElementById(textId).textContent);
    button.textContent = "Copied ✓";
    announce.textContent = "コピーしました。";
  }catch(error){
    button.textContent = "コピーできませんでした。再試行";
    announce.textContent = "コピーできませんでした。本文を選択してコピーしてください。";
  }
  clearTimeout(button.copyTimer);
  button.copyTimer = setTimeout(() => {button.textContent = original; announce.textContent = "";}, 1600);
}
function copyPrompt(){return copyText("promptText", "copyButton");}
function copyQualityTags(){return copyText("qualityText", "qualityCopyButton");}
function copyNegativeTags(){return copyText("negativeText", "negativeCopyButton");}

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

const announce = document.createElement("div");
announce.className = "sr-only";
announce.setAttribute("role", "status");
document.querySelector(".modal-sheet").appendChild(announce);

document.addEventListener("keydown", event => {
  if(!document.getElementById("promptModal").classList.contains("open")) return;
  if(event.key === "Escape") {event.preventDefault(); closePrompt();}
  if(event.key === "Tab"){
    const focusable = Array.from(document.querySelectorAll(".modal-sheet button, .modal-sheet [tabindex='0']")).filter(el => el.getClientRects().length);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if(event.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement))){event.preventDefault(); last.focus();}
    else if(!event.shiftKey && (document.activeElement === last || !focusable.includes(document.activeElement))){event.preventDefault(); first.focus();}
  }
});
