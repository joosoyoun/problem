// 그림판(캔버스) 드로잉 기능
function setupDrawpad(canvas, clearBtn) {
  let drawing = false;
  let ctx = canvas.getContext('2d');
  let last = {x:0, y:0};

  function getPos(e) {
    if (e.touches) {
      let rect = canvas.getBoundingClientRect();
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      let rect = canvas.getBoundingClientRect();
      return {
        x: e.offsetX,
        y: e.offsetY
      };
    }
  }

  function start(e) {
    drawing = true;
    let pos = getPos(e);
    last = pos;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
  }
  function move(e) {
    if (!drawing) return;
    let pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#d63384';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    last = pos;
    e.preventDefault();
  }
  function end(e) {
    drawing = false;
    ctx.closePath();
    e.preventDefault();
  }

  // Mouse
  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', end);
  canvas.addEventListener('mouseleave', end);
  // Touch
  canvas.addEventListener('touchstart', start);
  canvas.addEventListener('touchmove', move);
  canvas.addEventListener('touchend', end);
  canvas.addEventListener('touchcancel', end);

  clearBtn.addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

function showSavePopup(msg) {
  let popup = document.createElement('div');
  popup.className = 'save-popup';
  popup.textContent = msg;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.classList.add('show');
  }, 10);
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => document.body.removeChild(popup), 300);
  }, 2000);
}

// EmailJS 초기화
emailjs.init('wLE5l2YjXRubD8MjC');

function sendEmail(name, answers) {
  emailjs.send('problem', 'template_0gt3wi4', {
    student_name: name,
    answers: JSON.stringify(answers, null, 2)
  }).then(function(response) {
    console.log('이메일 전송 성공!', response.status, response.text);
  }, function(error) {
    console.error('이메일 전송 실패...', error);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // 모든 문제별 그림판 세팅
  document.querySelectorAll('.problem').forEach(problem => {
    let canvas = problem.querySelector('.drawpad');
    let clearBtn = problem.querySelector('.clear-pad');
    setupDrawpad(canvas, clearBtn);
  });

  // 저장 버튼 클릭 시 (submit 아님)
  document.getElementById('saveBtn').addEventListener('click', function() {
    const name = document.getElementById('studentName').value.trim();
    if (!name) {
      // document.getElementById('saveStatus').textContent = '이름을 입력하세요!';
      return;
    }
    let answers = [];
    document.querySelectorAll('.problem').forEach((problem, idx) => {
      let answer = problem.querySelector('.answer').value;
      let canvas = problem.querySelector('.drawpad');
      let image = canvas.toDataURL('image/png');
      answers.push({ answer, image });
    });
    // 로컬 저장
    localStorage.setItem('homework_name', name);
    localStorage.setItem('homework_answers', JSON.stringify(answers));
    // 버튼 글씨 변경
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.textContent = '저장되었습니다.';
    setTimeout(() => {
      saveBtn.textContent = '저장하기';
    }, 2000);
    document.getElementById('saveStatus').textContent = '저장되었습니다.';
  });

  // 제출(폼 submit) 기존대로 동작
  document.getElementById('problemsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('studentName').value.trim();
    let answers = [];
    document.querySelectorAll('.problem').forEach((problem, idx) => {
      let answer = problem.querySelector('.answer').value;
      let canvas = problem.querySelector('.drawpad');
      let image = canvas.toDataURL('image/png');
      answers.push({ answer, image });
    });
    sendEmail(name, answers);
    document.getElementById('saveStatus').textContent = '제출되었습니다!';
  });
}); 