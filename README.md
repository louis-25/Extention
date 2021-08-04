# Extention

menifest.json

## browser_action
"default_popup" : "popup.html" -> 익스텐션 아이콘을 클릭하면 popup.html을 팝업으로 띄워준다
"default_icon" : "icon.png" -> 익스텐션의 대표 아이콘 설정

## background
"persistent" : true -> 사용자 화면에서 발생하는 request들을 핸들링 하기위한 조건
"scripts":["js/background.js"] -> background 에서 실행시킬 js코드

## content_scripts
"matches":["<all_urls>"] -> content_scripts가 동작할 수 있는 url을 설정
`<all_urls>`는 모든 url에 접근할 수 있다
"js":["js/jquery-3.6.0.min.js", "js/content_script.js"] -> DOM요소에 접근할 수 있는 js코드

## web_accessible_resourses
- js코드에서 접근해 사용할 수 있는 자원들을 넣는 공간

## permissions
