'use strict'

$(document).ready(function(){
  fetch(chrome.runtime.getURL('/modal.html')).then(r => r.text()).then(html => {             
    document.body.insertAdjacentHTML('beforeend', html);
  });
})

//div 태그 생성
let txt = document.createTextNode('');
let html = '';

//dblclick - 더블클릭 mouseup - 마우스떼기
document.addEventListener('dblclick',async (event)=>{  
  let check = true
  for(let path in event.path) {
    if(event.path[path].id == 'modal') {
      check = false
    }
  }    
  if(check) { // 모달창 더블클릭 제외    
    let x = event.clientX + 10
    let y = event.clientY - 10    

    console.log('x '+x+' y '+y) // 좌표

    txt = document.createTextNode(selectText())    
    console.log('txt ',txt.nodeValue) // 드래그된 값
    
    // API호출
    let user = await getApi(txt.nodeValue.trim(' ')).catch(e =>{console.log('이상한값')})
    console.log('user ',user)
    try{
    $('.avatar').attr("src",`https://web1.fasoo.com/Fasoo_Human_Resource_Management/photo/${user.sno}.jpg`)
    $('.title--name').html('<b>'+user.kname+'</b>'+' / '+user.sno)
    $('.title--gnmu').html('근무 중')
    $('.info--name').html('<i class="far fa-user"></i>'+user.kname+' / '+user.ename)
    if(user.hero_code == 1){ // 일반사원
      $('.info--dept').html('<i class="far fa-building"></i>'+user.dept_name+'ㆍ'+user.jikchk+'ㆍ'+user.jikgub)
    }else if(user.hero_code == 0){ // 히어로
      $('.info--dept').html('<i class="far fa-building"></i>'+user.dept_name+'ㆍ'+user.jikchk+'ㆍ'+user.jikgub+'<img src="/hero.png" alt="hero"></img>')
    }
    $('.info--tel').html('<i class="fas fa-phone-alt"></i>'+user.tel_no)
    $('.info--email').html(`<i class="far fa-envelope"></i>`+`<a href="mailto:${user.emailaddr}">${user.emailaddr}</a>`)

    $('#modal').css('left', x)
    $('#modal').css('top', y)
    $('#modal').css('display', 'flex')
    } catch(e){
      console.log('error : ', e)
    }
  }
})
$(document).on()(
window.addEventListener('click', (e)=> {  
  let check = true
  for(let path in e.path) {
    if(e.path[path].id == 'modal') {
      check = false
    }
  }  
  if(check) { // 모달이 아닌곳을 클릭하면 닫힌다
    $('#modal').hide()
  }
  

  chrome.runtime.sendMessage({action: "FINISH"}, function(response) {
    console.log('content_script ',response.farewell);
});
})
)

function selectText() {
  var selectionText = ""
  
  if (document.getSelection) {
      selectionText = document.getSelection()
  } else if (document.selection) {
      selectionText = document.selection.createRange().text
  }
  return selectionText
}

getSelectedText = function() {
  return window.getSelection().toString().trim();
};

async function getApi(userName) {
  let response = await fetch('https://web2.fasoo.com/FiresideAPI/api/user/'+userName)
  let arr = await response.json()
  let data = arr.items[0]
  console.log('data ',data)
  console.log('dataName ',data.kname)
  console.log('dataEname',data.ename)
  
  return data
}