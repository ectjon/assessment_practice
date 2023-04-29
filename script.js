const serverEvents = new EventSource('http://localhost:3000/events');
serverEvents.addEventListener('message', function(event){
    refreshPage();
}); 
  

//do some DOM stuff
console.log("script loaded");
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  main();
  getDB();
});
function editClick (event) {
  //find parent node
  //replace span and edit/delete buttons with input field and save button.
  //connect save button.
}
async function deleteClick (event) {
  // event.target.parentNode.parentNode.remove();
  console.log('data id', event.target.dataset['id']);
  await deleteDB({id: event.target.dataset['id']});
  refreshPage();
}

function refreshPage () {
    list = document.querySelector('ul')
    list.remove();
    list = addEl('ul', document.getElementById('div1'))
    getDB();
}

async function getDB () {
  try {
    const data = await fetch('db');
    const dbList = await data.json();
    //for every item
    //append to list
    //console.log(list);
    const listNode = document.querySelector('ul')
    listNode.style.listStyle = 'none';

    for(const dbItem of dbList){
        /* for REAL programmers only v */
      const button = addEl('button', addEl('span', addEl('li', listNode)))
      //button.parentNode.insertBefore(document.createTextNode(dbItem.content), button);
      const editButton = addEl('button', button.parentNode)
      editButton.innerText = 'edit';
      editButton.onclick = editClick;
      button.parentNode.append(dbItem.content)
      button.setAttribute('data-id', dbItem.id);
      button.onclick = deleteClick;
      button.innerText = 'x'
      button.style.margin = '10px';
      button.style.color = 'red';
      document.querySelectorAll('li').forEach(node => {
        node.style.border = 'black 1px solid';
        node.style.borderRadius = '3px';
        node.style.margin = '5px';
      })
    }
  } catch(err) {
    console.log(err);
  }
}

async function postDB(text){
  try{
     await fetch('/db',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(text)
    });
  }catch(err){
    console.log(err);
  }
}

async function deleteDB(id){
  try{
     await fetch('/db',{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(id)
    });
  }catch(err){
    console.log(err);
  }
}


function addEl (type, target) {
  const item = document.createElement(type);
  target.appendChild(item);
  return item;
}

function main(){

  const body = document.querySelector('body');
  const h1 = addEl('h1', body);
  h1.innerText = 'EricGPT';
  const textField = addEl('input', body);
  const submitButton = addEl('button', body)
  submitButton.innerText = 'Submit';
  submitButton.onclick = submitItem;
  // submitButton.addEventListener('click', submitItem)
  const div1 = addEl('div', body)
  div1.id = 'div1';
  let list = addEl('ul', div1)

  //on submit button click
  async function submitItem(event) {
    const text = textField.value;
    const textEl = addEl('li',list);
    textEl.innerText = text;
    await postDB({ text });
    textField.value = '';
    refreshPage();
  }
}



