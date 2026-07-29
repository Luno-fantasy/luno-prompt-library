
let current = null, currentGender = "female";
function openPrompt(data){
  current = data; currentGender = data.male ? "female" : "single";
  const modal = document.getElementById("promptModal");
  document.getElementById("modalTitle").textContent = data.title;
  document.getElementById("modalSub").textContent = data.tag || "Prompt Archive";
  const img = document.getElementById("modalImage");
  if(data.image){ img.src=data.image; img.style.display="block"; } else { img.style.display="none"; }
  const tabs = document.getElementById("genderTabs");
  if(data.male){
    tabs.style.display="flex";
    tabs.innerHTML='<button class="active" onclick="setGender(\\'female\\',this)">Female</button><button onclick="setGender(\\'male\\',this)">Male</button>';
  }else tabs.style.display="none";
  updatePrompt();
  modal.classList.add("open"); document.body.classList.add("lock");
}
function setGender(g,btn){
  currentGender=g;
  document.querySelectorAll("#genderTabs button").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active"); updatePrompt();
}
function updatePrompt(){
  document.getElementById("promptText").textContent =
    currentGender==="male" ? current.male : (current.female || current.prompt);
}
function closePrompt(){
  document.getElementById("promptModal").classList.remove("open");
  document.body.classList.remove("lock");
}
async function copyPrompt(){
  const text=document.getElementById("promptText").textContent;
  const btn=document.getElementById("copyBtn");
  try{await navigator.clipboard.writeText(text);btn.textContent="Copied ✓";}
  catch(e){const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();btn.textContent="Copied ✓";}
  setTimeout(()=>btn.textContent="Promptをコピー",1300);
}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePrompt()});
