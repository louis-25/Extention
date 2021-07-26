// // content_script.js
function onWindowLoad() {
  console.log("팝업 페이지의 DOM 접근 : ");
  // 위 결과는 위 html 파일에서 product_name 아이디의 태그 값인 Injecting Product Name.... 이 된다.  
}

window.onload = onWindowLoad;

window.addEventListener('mouseup',()=>{
  alert(selectText())
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