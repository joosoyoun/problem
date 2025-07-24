// 그림판(캔버스) robust 드로잉 기능
function setupDrawpad(canvas, clearBtn) {
  if (!canvas || !clearBtn) return;
  let drawing = false;
  let ctx = canvas.getContext('2d');
  let last = {x:0, y:0};

  function getPos(e) {
    let rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else if (typeof e.offsetX === 'number' && typeof e.offsetY === 'number') {
      return {
        x: e.offsetX,
        y: e.offsetY
      };
    } else {
      return {x:0, y:0};
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

  // Mouse events
  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', end);
  canvas.addEventListener('mouseleave', end);
  // Touch events
  canvas.addEventListener('touchstart', start, {passive: false});
  canvas.addEventListener('touchmove', move, {passive: false});
  canvas.addEventListener('touchend', end, {passive: false});
  canvas.addEventListener('touchcancel', end, {passive: false});

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

function sendEmail(studentName, answer) {
  emailjs.send('problem', 'template_65k6mg6', {
    studentName: name,
    answers: JSON.stringify(answers, null, 2)
  }).then(function(response) {
    console.log('이메일 전송 성공!', response.status, response.text);
  }, function(error) {
    console.error('이메일 전송 실패...', error);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // robust하게 모든 문제별 그림판 세팅
  document.querySelectorAll('.problem').forEach(problem => {
    let canvas = problem.querySelector('.drawpad');
    let clearBtn = problem.querySelector('.clear-pad');
    setupDrawpad(canvas, clearBtn);
  });

  // 제출(폼 submit) - EmailJS로 전송
  document.getElementById('problemsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('studentName').value.trim();
    const answers = [];
    document.querySelectorAll('.problem').forEach((problem, idx) => {
      let answer = problem.querySelector('.answer').value;
      let canvas = problem.querySelector('.drawpad');
      let image = canvas.toDataURL('image/png');
      answers.push({ answer, image });
    });
    sendEmail(name, answers);
    document.getElementById('saveStatus').textContent = '제출하였습니다.';
  });

  // 페이지 로드 시 복원
  const savedName = localStorage.getItem('homework_name');
  const savedAnswers = JSON.parse(localStorage.getItem('homework_answers') || '[]');
  if (savedName) document.getElementById('studentName').value = savedName;
  if (savedAnswers.length) {
    document.querySelectorAll('.problem').forEach((problem, idx) => {
      if (savedAnswers[idx]) {
        problem.querySelector('.answer').value = savedAnswers[idx].answer || '';
        // 그림판 복원
        let canvas = problem.querySelector('.drawpad');
        let ctx = canvas.getContext('2d');
        let img = new window.Image();
        img.onload = function() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        if (savedAnswers[idx].image) img.src = savedAnswers[idx].image;
      }
    });
  }
}); 
