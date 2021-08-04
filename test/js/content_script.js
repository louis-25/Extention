'use strict'

$(document).ready(function(){
  fetch(chrome.runtime.getURL('/modal.html')).then(r => r.text()).then(html => {             
    document.body.insertAdjacentHTML('beforeend', html);
  });
})

// 더블클릭
$(document).on('dblclick',async (event)=>{
  let check = true
  for(let path in event.path) {
    if(event.path[path].id == 'modal') {
      check = false //모달창이 더블클릭된 경우
    }
  }
  if(check) { // 모달창 더블클릭 제외
    let x = event.clientX + 10
    let y = event.clientY - 10

    console.log('x '+x+' y '+y) // 좌표

    let txt = document.createTextNode(selectText())
    console.log('txt ',txt.nodeValue) // 드래그된 값
    
    // API호출
    let user = await getApi(txt.nodeValue.trim()).catch(e =>{console.log('이상한값')})
    console.log('user ',user)

    // 모달창 세팅
    try{
      /* 공통 */
      $('.avatar').attr("src",`https://web1.fasoo.com/Fasoo_Human_Resource_Management/photo/${user.sno}.jpg`)
      $('.title--name').html('<b>'+user.kname+'</b>'+' / '+user.sno)    
      $('.info--name').html(user.kname+' / '+user.ename)
      $('.info--dept').html(user.dept_name+'ㆍ'+user.jikchk+'ㆍ'+user.jikgub)
      $('.info--tel').html(user.tel_no)
      $('.info--email').html(`<a href="mailto:${user.emailaddr}">${user.emailaddr}</a>`)
      // icon
      $('.user_icon').attr('src',`${chrome.runtime.getURL("../images/user.png")}`)
      $('.building_icon').attr('src',`${chrome.runtime.getURL("../images/building.png")}`)
      $('.phone_icon').attr('src',`${chrome.runtime.getURL("../images/phone.png")}`)
      $('.email_icon').attr('src',`${chrome.runtime.getURL("../images/email.png")}`)

      /* Hero 구분 */
      setHeroState(user.hero_code)

      /* 근무상태 구분 */
      setGunState(user.gun_code)

      /* 모달창 보이기 */
      $('#modal').css('left', x)
      $('#modal').css('top', y)
      $('#modal').css('display', 'flex')
    }catch(e){
      console.log('error : ', e)
    }
  }
})

// 클릭
$(document).on('click', (e)=> {  
  console.log('click ',e)
  let check = true
  for(let path in e.path) { // 클릭요소가 모달창인지 구분
    if(e.path[path].id == 'modal') {
      check = false
    }
  }
  if(check) { // 모달이 아닌곳을 클릭하면 닫힌다
    $('#modal').css('display','none')
  }
})

function setHeroState(hero_code){
  if(hero_code == 0){ // 일반사원
    $('#hero').css('display','none')
  }
  else if(hero_code == 1){ // 히어로
    $('.hero_icon').attr('src',`${chrome.runtime.getURL("../images/hero_icon.png")}`)
    $('.hero_img').attr('src',`${chrome.runtime.getURL("../images/hero.png")}`)
    $('#hero').css('display','flex')
  }
}

function setGunState(gun_code) {
  if(gun_code == 0){ // 초록
    $('.title--gnmu').css('color','#25C16F')
    $('.gunmu').css('background-color','#05C072')
  }else { // 빨강
    $('.title--gnmu').css('color','#F6705E')
    $('.gunmu').css('background-color','#EF5350')
  }
  switch((gun_code).toString()){
    case '0':
      $('.title--gnmu').html('근무 중')
      break; 
    case '1':
      $('.title--gnmu').html('연차휴가')          
      break;
    case '2':
      $('.title--gnmu').html('오전반차')          
      break;
    case '3':
      $('.title--gnmu').html('오후반차')          
      break;
    case '4':
      $('.title--gnmu').html('경조휴가')          
      break;
    case '5':
      $('.title--gnmu').html('리프레쉬')          
      break;        
    case '6':
      $('.title--gnmu').html('대체휴가')          
      break;
    case '7':
      $('.title--gnmu').html('공가오전+반차')
      break;
    case '10':
      $('.title--gnmu').html('공가')          
      break;
    case '11':
      $('.title--gnmu').html('공가(오전)')          
      break;
    case '12':
      $('.title--gnmu').html('공가(오후)')          
      break;
  }
}

function selectText() {
  var selectionText = ""
  
  if (window.getSelection) {
      selectionText = window.getSelection().toString().trim()
  } else if (window.selection) {
      selectionText = window.selection.createRange().text
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