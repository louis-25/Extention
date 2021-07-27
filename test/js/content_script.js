// // content_script.js
function onWindowLoad() {
  console.log("팝업 페이지의 DOM 접근 : ");  
  // 위 결과는 위 html 파일에서 product_name 아이디의 태그 값인 Injecting Product Name.... 이 된다.  
}

window.onload = onWindowLoad;

// const modal = document.getElementById("modal")
// var newDIV = document.createElement("div");​
// newDIV.innerHTML = "새로 생성된 DIV입니다.";
let div = document.createElement('div')  
let txt = document.createTextNode('');
div.style.width= "100px"
// div.style.height= "100px"


window.addEventListener('mouseup',(event)=>{
  // modal.style.display="flex"  
  div.innerHTML= ""
  txt.nodeValue = ""
  let x = event.pageX + 10
  let y = event.pageY - 10      
  div.style.left = `${x}px`;
  div.style.top = `${y}px`; 
  div.style.display = "inline-block";
  div.style.position = "absolute";
  div.style.float = "true";
  div.style.backgroundColor="tomato";
  div.style.borderRadius = "10px";
  div.style.padding = "5px";

  txt = document.createTextNode(selectText());
  console.log('txt ',txt.nodeValue)
  console.log('type ',typeof(txt.nodeValue))
  if(txt.nodeValue != "") { // 드래그된 값이 있을때
    div.appendChild(txt)    
    document.body.appendChild(div)
  }else {
    div.remove()
  }
  
  // alert(selectText())
})

function selectText() {
  var selectionText = "";
  if (document.getSelection) {
      selectionText = document.getSelection();
  } else if (document.selection) {
      selectionText = document.selection.createRange().text;
  }
  return selectionText;
}

// chrome.tabs.executeScript({
//   code:'document.querySelector("body").innerText'
// }, function(result) {
//   alert(result[0])
// });

// let selectedObj = window.getSelection();
// let selected = selectedObj.getRangeAt(0).toString();

// console.log(selected);
// document.addEventListener('click',(a)=>{
//   alert(a)
// })