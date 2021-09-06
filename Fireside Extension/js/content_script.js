'use strict'

$(document).ready(function () {
  fetch(chrome.runtime.getURL('/modal.html')).then(r => r.text()).then(html => {
    document.body.insertAdjacentHTML('beforeend', html); // 모달창html 삽입    
  });
})

$(document).on('scroll', function(){ // 스크롤 시 모달창 제거
  $('#F_modal').css('display', 'none')
})

$('.modal-body').on('scroll', function(){ // 스크롤 시 모달창 제거
  $('#F_modal').css('display', 'none')
})

let userId = ""

// 더블클릭
$(document).on('dblclick', async (event) => {
  // console.log('dblclick ', event)
  let check = true
  let sameName = ""

  for (let path in event.originalEvent.path) {
    try{
    if (event.originalEvent.path[path].id == 'F_modal') {
      check = false //모달창이 더블클릭된 경우
    }
    }catch(e){
      console.log(e)
    }
  }
  if (check) { // 모달창 더블클릭 제외
    let x = event.clientX + 10
    let y = event.clientY - 10
    let screenY = event.screenY
    let windowX = window.innerWidth
    let windowY = window.innerHeight
    let directionX = false // true - 왼쪽방향
    let directionY = false // true - 위쪽방향
    if ((x + 270) > windowX) {
      directionX = true
    }
    if ((y + 250) > windowY) {
      directionY = true
    }

    let name = "" //선택된 이름 담을 변수
    let abc = "" //동명이인 구분용 변수
    try {
      sameName = selectText()            
      name = (document.createTextNode(sameName[0])).nodeValue //선택된 부분의 글자추출
      abc = sameName[1][sameName[1].indexOf(name)+name.length] // name다음에 오는 글자      
    }
    catch (e) {
      console.log(e)
    }
    // API호출
    let arr = ['A', 'B', 'C', 'D'] // 이름에 포함돼있으면 동명이인
    let user = await getUser(name.trim()).catch(e => {console.log(e)})
    if(arr.includes(abc)){
      user = await getUser(name+abc).catch(e => { console.log(e) })
    }
    else if (sameName[1] && user && arr.includes(sameName[1].charAt(sameName[1].length - 1))) {      
      user = await getUser(sameName[1]).catch(e => { console.log(e) })
    }
    
    this.userId = (user.emailaddr).split('@')[0] // 이메일ID 추출

    // 모달창 세팅
    try {
      let subX = 285
      let subY = 220
      if(user) {
      /* 공통 */      
      $('.F_title--avatar').attr("src", `https://web1.fasoo.com/Fasoo_Human_Resource_Management/photo/${user.sno}.jpg`)      
      $('.F_title--name').html('<b>' + user.kname + '</b>' + ' / ' + user.sno)
      $('.F_info--name').html(user.kname + ' / ' + user.ename)
      $('.F_info--dept').html(user.dept_name + 'ㆍ' + user.jikchk + 'ㆍ' + user.jikgub)
      if(user.tel_no) { $('.F_info--tel').html(user.tel_no) }
      else { $('.F_info--tel').html('번호없음') }
      $('.F_info--email').html(`<a href="mailto:${user.emailaddr}">${user.emailaddr}</a>`)
      // icon
      $('.F_user_icon').attr('src', `${chrome.runtime.getURL("../images/user.png")}`)
      $('.F_building_icon').attr('src', `${chrome.runtime.getURL("../images/building.png")}`)
      $('.F_phone_icon').attr('src', `${chrome.runtime.getURL("../images/phone.png")}`)
      $('.F_email_icon').attr('src', `${chrome.runtime.getURL("../images/email.png")}`)
      
      $('.F_modal--info').css('display','block')
      $('.F_avatarBox').css('display','block')    
      $('.F_title--gnmu').css('display','block')
      $('.F_gnmu').css('display','block')
      $('.F_modal--info').css('display','block')
      $('.F_chatBtn').css('display','block')
      /* Hero 구분 */
      setHeroState(user.hero_code)

      /* 근무상태 구분 */
      setGunState(user.gun_code)
      }
      

      /* 모달창 보이기 */
      if (directionX) {
        $('#F_modal').css('left', x - subX)
      } else {
        $('#F_modal').css('left', x)
      }

      if (directionY) {        
        $('#F_modal').css('top', y - subY)
      } else {
        if(y / 790 > 0){          
          if((screenY + 250) > 1055) {            
            $('#F_modal').css('top', y - subY)
          }
          else $('#F_modal').css('top', y)
        }
      }

      $('#F_modal').css('display', 'flex')
    } catch (e) {
      console.log('error : ', e)
    }
  }
})

// 클릭
$(document).on('click', (e) => {
  // console.log('click ', e)
  let check = true
  
  for (let path in e.originalEvent.path) { // 클릭요소가 모달창인지 구분
    try{
      if (e.originalEvent.path[path].id == 'F_modal') {
        check = false
      }
    }catch(e){
      console.log(e)
    }
  }

  if (check) { // 모달이 아닌곳을 클릭하면 닫힌다
    $('#F_modal').css('display', 'none')
  }
  if (e.target.className == 'F_chatBtn') {
    getChat(this.userId)    
  }
})

function setHeroState(hero_code) {
  if (hero_code == 0) { // 일반사원
    $('#F_hero').css('display', 'none')
  }
  else if (hero_code == 1) { // Valuemaker
    $('.F_hero_img').attr('src', `${chrome.runtime.getURL("../images/hero_valuemaker.png")}`)    
  }
  else if (hero_code == 2) { // Collective Creater
    $('.F_hero_img').attr('src', `${chrome.runtime.getURL("../images/hero_collective.png")}`)    
  }
  else if (hero_code == 3) { // Challenger
    $('.F_hero_img').attr('src', `${chrome.runtime.getURL("../images/hero_challenger.png")}`)    
  }
  if(hero_code > 0) {
    // $('.hero_icon').attr('src', `${chrome.runtime.getURL("../images/hero_icon.png")}`)
    $('#F_hero').css('display', 'flex')
  }
}

function setGunState(gun_code) {
  if (gun_code == 0) { // 초록
    $('.F_title--gnmu').css('color', '#25C16F')
    $('.F_gunmu').css('background-color', '#05C072')
  } else { // 빨강
    $('.F_title--gnmu').css('color', '#F6705E')
    $('.F_gunmu').css('background-color', '#EF5350')
  }
  switch ((gun_code).toString()) {
    case '0':
      $('.F_title--gnmu').html('근무 중')
      break;
    case '1':
      $('.F_title--gnmu').html('연차휴가')
      break;
    case '2':
      $('.F_title--gnmu').html('오전반차')
      break;
    case '3':
      $('.F_title--gnmu').html('오후반차')
      break;
    case '4':
      $('.F_title--gnmu').html('경조휴가')
      break;
    case '5':
      $('.F_title--gnmu').html('리프레쉬')
      break;
    case '6':
      $('.F_title--gnmu').html('대체휴가')
      break;
    case '7':
      $('.F_title--gnmu').html('공가오전+반차')
      break;
    case '8':
      $('.F_title--gnmu').html('반차+공가오후')
      break;
    case '10':
      $('.F_title--gnmu').html('공가')
      break;
    case '11':
      $('.F_title--gnmu').html('공가(오전)')
      break;
    case '12':
      $('.F_title--gnmu').html('공가(오후)')
      break;
    case '13':
      $('.F_title--gnmu').html('육아휴직')
      break;
    case '14':
      $('.F_title--gnmu').html('병가')
      break;
    case '15':
      $('.F_title--gnmu').html('휴직')
      break;
    case '16':
      $('.F_title--gnmu').html('고객사 상주')
      break;
  }
}

function selectText() {
  let selectionText = "" // 선택영역
  let sameName = "" // 동명이인 구분용 변수

  if (window.getSelection) {
    selectionText = window.getSelection().toString().trim()
    sameName = window.getSelection().baseNode.nodeValue
    // console.log('window.getSelection ', window.getSelection())
    // console.log('selectname ',sameName)

  } else if (window.selection) {
    // console.log('window.selection ', window.selection)
    selectionText = window.selection.createRange().text
  }
  return [selectionText, sameName]
}

async function getUser(userName) {
  let response = await fetch('https://web2.fasoo.com/FiresideAPI/api/user/' + userName)
  let arr = await response.json()
  let data = arr.items[0]
  // console.log('data ', data)

  return data
}

function getChat(userId) {    
  let url = `http://wrapsody.fasoo.com:9400/wrapmsgr/view/extension/convoPopup?userId2=${userId}`

  let w = 800,
      h = 650,
      t,l
  try{
  t = window.top.outerHeight / 2 + window.top.screenY - (h / 2),
  l = window.top.outerWidth / 2 + window.top.screenX - (w / 2);
  }catch(e){
    console.log('E ',e)
  }  
  let popupOption = "left=" + l + ",top=" + t + ",width=" + w + ",height=" + h + ",status=no,menubar=no,toolbar=no,resizable=yes";    
  window.open(url, userId, popupOption)
}