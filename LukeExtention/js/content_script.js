'use strict'

$(document).ready(function () {
  fetch(chrome.runtime.getURL('/modal.html')).then(r => r.text()).then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
  });
})
let userId = ""
// 더블클릭
$(document).on('dblclick', async (event) => {
  let check = true
  let sameName = ""
  console.log('dblclick ',event)
  // console.log('screen.width ',screen.availWidth)
  // console.log('screen.height ',screen.availHeight)
  // console.log('window.outerWidth ',window.outerWidth)
  // console.log('window.outerHeight ',window.outerHeight)
  
  for (let path in event.path) {
    if (event.path[path].id == 'modal') {
      check = false //모달창이 더블클릭된 경우
    }
  }
  if (check) { // 모달창 더블클릭 제외
    let x = event.clientX + 10
    let y = event.clientY - 10
    let windowX = window.innerWidth
    let windowY = window.innerHeight
    let directionX = false // true - 왼쪽방향
    let directionY = false // true - 위쪽방향
    if((x + 270) > windowX){
      directionX = true
    }
    if((y + 250) > windowY ){
      directionY = true
    }
    console.log('window.innerWidth ', windowX)
    console.log('window.innerHeight ',windowY)
    
    console.log('x ' + x + ' y ' + y) // 좌표
    

    let txt = ""

    try{
    sameName = selectText()
    txt = (document.createTextNode(sameName[0])).nodeValue //선택된 부분의 글자추출
    console.log('txt ',txt)
    console.log('sameName ',sameName[1].charAt(sameName[1].length-1)) // 이름의 마지막 문자
    }
    catch(e){
      console.log(e)
    }
    // API호출
    let arr = ['A','B','C'] // 이름에 포함돼있으면 동명이인
    let user = await getUser(txt.trim()).catch(e => { console.log(e) })    
    
    if(sameName[1] && user && arr.includes(sameName[1].charAt(sameName[1].length-1))) {
      console.log('동명이인 발견!!')
      user = await getUser(sameName[1]).catch(e => { console.log(e) })
    }
    this.userId = (user.emailaddr).split('@')[0]
    
    console.log('user ', user)
    console.log('userId ',userId)

    // 모달창 세팅
    try {
      /* 공통 */
      $('.avatar').attr("src", `https://web1.fasoo.com/Fasoo_Human_Resource_Management/photo/${user.sno}.jpg`)
      $('.title--name').html('<b>' + user.kname + '</b>' + ' / ' + user.sno)
      $('.info--name').html(user.kname + ' / ' + user.ename)
      $('.info--dept').html(user.dept_name + 'ㆍ' + user.jikchk + 'ㆍ' + user.jikgub)
      $('.info--tel').html(user.tel_no)
      $('.info--email').html(`<a href="mailto:${user.emailaddr}">${user.emailaddr}</a>`)
      // icon
      $('.user_icon').attr('src', `${chrome.runtime.getURL("../images/user.png")}`)
      $('.building_icon').attr('src', `${chrome.runtime.getURL("../images/building.png")}`)
      $('.phone_icon').attr('src', `${chrome.runtime.getURL("../images/phone.png")}`)
      $('.email_icon').attr('src', `${chrome.runtime.getURL("../images/email.png")}`)

      /* Hero 구분 */
      setHeroState(user.hero_code)

      /* 근무상태 구분 */
      setGunState(user.gun_code)

      /* 모달창 보이기 */
      if(directionX){
        $('#modal').css('left', x - 285)
      }else{
        $('#modal').css('left', x)
      }

      if(directionY) {
        $('#modal').css('top', y - 230)
      }else{
        $('#modal').css('top', y)
      }
      
      
      $('#modal').css('display', 'flex')
    } catch (e) {
      console.log('error : ', e)
    }
  }
})

// 클릭
$(document).on('click', (e) => {
  console.log('click ', e)
  let check = true
  for (let path in e.path) { // 클릭요소가 모달창인지 구분
    if (e.path[path].id == 'modal') {
      check = false
    }
  }
  if (check) { // 모달이 아닌곳을 클릭하면 닫힌다
    $('#modal').css('display', 'none')
  }
  if (e.target.className == 'chatBtn') {
    getChat(this.userId)
    // console.log('chat!! ',this.userId)
  }
})

function setHeroState(hero_code) {
  if (hero_code == 0) { // 일반사원
    $('#hero').css('display', 'none')
  }
  else if (hero_code == 1) { // 히어로
    $('.hero_icon').attr('src', `${chrome.runtime.getURL("../images/hero_icon.png")}`)
    $('.hero_img').attr('src', `${chrome.runtime.getURL("../images/hero.png")}`)
    $('#hero').css('display', 'flex')
  }
}

function setGunState(gun_code) {
  if (gun_code == 0) { // 초록
    $('.title--gnmu').css('color', '#25C16F')
    $('.gunmu').css('background-color', '#05C072')
  } else { // 빨강
    $('.title--gnmu').css('color', '#F6705E')
    $('.gunmu').css('background-color', '#EF5350')
  }
  switch ((gun_code).toString()) {
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
  let selectionText = "" // 선택영역
  let sameName = "" // 동명이인 구분용 변수

  if (window.getSelection) {
    selectionText = window.getSelection().toString().trim()
    sameName = window.getSelection().baseNode.nodeValue    
    console.log('window.getSelection ',window.getSelection())
    // console.log('selectname ',sameName)
    
  } else if (window.selection) {
    console.log('window.selection ',window.selection)
    selectionText = window.selection.createRange().text
  }
  return [selectionText, sameName]
}

async function getUser(userName) {
  let response = await fetch('https://web2.fasoo.com/FiresideAPI/api/user/' + userName)
  let arr = await response.json()
  let data = arr.items[0]
  console.log('data ', data)

  return data
}

function getChat(userId) {
  let url = `http://ecm.dev.fasoo.com:9400/wrapmsgr/view/extension/convoPopup?userId2=${userId}`

  let w = 800,
      h = 650,
      t = window.top.outerHeight / 2 + window.top.screenY - (h / 2),
      l = window.top.outerWidth / 2 + window.top.screenX - (w / 2);

  let popupOption = "left=" + l + ",top=" + t + ",width=" + w + ",height=" + h + ",status=no,menubar=no,toolbar=no,resizable=yes";

  window.open(url, 'chatBtn', popupOption);
}
