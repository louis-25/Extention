$(document).ready(function(){
  console.log('jquery')
})

//div 태그 생성
let div = document.createElement('div');
let txt = document.createTextNode('');
let nameText = document.createTextNode('');
let chatBtn = document.createElement('button');
let br = document.createElement('br');
let br2 = document.createElement('br');

// style
div.setAttribute('id','modal')
div.style.width= "200px"
div.style.position = "absolute"
div.style.backgroundColor="tomato"
div.style.borderRadius = "10px"
div.style.padding = "5px"

chatBtn.innerText = "chat"

//dblclick - 더블클릭 mouseup - 마우스떼기
window.addEventListener('dblclick',(event)=>{
  // modal.style.display="flex"
  div.innerHTML= ""  
  txt.nodeValue = ""
  nameText.nodeValue = ""
  let x = event.pageX + 10
  let y = event.pageY - 10
  div.style.left = `${x}px`
  div.style.top = `${y}px`
  
  // const headers = new Headers({
  //   'Access-Control-Allow-Origin': '*'
  // });

  getApi()
  // console.log('Fireside ',Fireside)

  nameText = document.createTextNode('정동현 (jung dong hyeon)') // 이름
  div.appendChild(nameText);
  div.appendChild(br);
  
  txt = document.createTextNode(selectText())
  console.log('txt ',txt.nodeValue) // 드래그된 값

  if(txt.nodeValue != "") { // 드래그된 값이 있을때    
    div.appendChild(txt)
    div.appendChild(br2)
    div.appendChild(chatBtn)
    document.body.appendChild(div) // DOM에 추가    

  }else {
    div.remove()
  }
})

window.addEventListener('click', (e)=> {  
  console.log('click: ',e.target.id)
  if(e.target.id != 'modal') {
    div.remove() // 모달이 아닌곳을 클릭하면 닫힌다
  }
  chrome.runtime.sendMessage({action: "FINISH"}, function(response) {
    console.log('content_script ',response.farewell);
});
})


function selectText() {
  var selectionText = ""

  if (document.getSelection) {
      selectionText = document.getSelection()
  } else if (document.selection) {
      selectionText = document.selection.createRange().text
  }
  return selectionText
}

async function getApi() {
  const headers = new Headers({    
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  });

  await fetch('https://web2.fasoo.com/FiresideAPI/api/user/정동현',{headers})
  .then(res => {
    console.log('fireside ',res)
  })
  .catch(err => {
    console.log('error ',err)
  })
}