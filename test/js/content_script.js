'use strict'

$(document).ready(function(){
  console.log('jquery')
})

//div 태그 생성
let div = document.createElement('div');
let txt = document.createTextNode('');

let nameText = document.createTextNode('');  // 이름
let dept_name = document.createTextNode(''); // 부서명
let jikgub = document.createTextNode(''); // 직급
let jikchk = document.createTextNode(''); // 직책
let tel_no = document.createTextNode(''); // 휴대폰번호
let emailaddr = document.createTextNode(''); // 이메일주소

let chatBtn = document.createElement('button');
chatBtn.setAttribute('id','chatBtn');
// style
div.setAttribute('id','modal')
div.style.width= "200px"
div.style.position = "absolute"
div.style.backgroundColor="tomato"
div.style.borderRadius = "10px"
div.style.padding = "8px"

chatBtn.innerText = "chat"
$("#chatBtn").hover(()=>{
  $(this).css("background-color", "yellow");
}, ()=>{
  $(this).css("background-color","white");
})

//dblclick - 더블클릭 mouseup - 마우스떼기
window.addEventListener('dblclick',async (event)=>{
  // modal.style.display="flex"
  div.innerHTML= ""  
  txt.nodeValue = ""
  nameText.nodeValue = ""
  let x = event.pageX + 10
  let y = event.pageY - 10
  div.style.left = `${x}px`
  div.style.top = `${y}px`
    
  txt = document.createTextNode(selectText())
  console.log('txt ',txt.nodeValue) // 드래그된 값

  // API호출
  
  let user = await getApi(txt.nodeValue.trim(' '))
  // let data = user.items
  console.log('user ',user)
  // console.log('data ',data)

  nameText = document.createTextNode('이름 : '+user.kname) // 이름
  dept_name = document.createTextNode('부서 : '+user.dept_name) // 부서명
  jikgub = document.createTextNode('직급 : '+user.jikgub) // 직급
  jikchk = document.createTextNode('직책 : '+user.jikchk) // 직책
  tel_no = document.createTextNode('번호 : '+user.tel_no)
  emailaddr = document.createTextNode('메일 : '+user.emailaddr)
  div.appendChild(nameText)
  div.appendChild(document.createElement('br'))
  div.appendChild(dept_name)
  div.appendChild(document.createElement('br'))
  div.appendChild(jikgub)
  div.appendChild(document.createElement('br'))
  div.appendChild(jikchk)
  div.appendChild(document.createElement('br'))
  div.appendChild(tel_no)
  div.appendChild(document.createElement('br'))
  div.appendChild(emailaddr)
  div.appendChild(document.createElement('br'))

  

  if(txt.nodeValue != "") { // 드래그된 값이 있을때    
    div.appendChild(txt)
    div.appendChild(document.createElement('br'))
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

async function getApi(userName) {  
  
  let response = await fetch('https://web2.fasoo.com/FiresideAPI/api/user/'+userName)
  let arr = await response.json()
  let data = arr.items[0]
  console.log('data ',data)
  console.log('dataName ',data.kname)
  console.log('dataEname',data.ename)
  
  return data
}