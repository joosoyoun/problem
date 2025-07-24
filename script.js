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

document.addEventListener('DOMContentLoaded', function() {
  // 모든 문제별 그림판 세팅
  document.querySelectorAll('.problem').forEach(problem => {
    let canvas = problem.querySelector('.drawpad');
    let clearBtn = problem.querySelector('.clear-pad');
    setupDrawpad(canvas, clearBtn);
  });

  // 저장 버튼 클릭 시 데이터 수집
  document.getElementById('problemsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('studentName').value.trim();
    if (!name) {
      document.getElementById('saveStatus').textContent = '이름을 입력하세요!';
      return;
    }
    let answers = [];
    document.querySelectorAll('.problem').forEach((problem, idx) => {
      let answer = problem.querySelector('.answer').value;
      let solution = problem.querySelector('.solution').value;
      let canvas = problem.querySelector('.drawpad');
      let image = canvas.toDataURL('image/png');
      answers.push({
        problem: idx+1,
        answer,
        solution,
        image
      });
    });
    // TODO: 수파베이스 연동 (여기서 name, answers 배열 저장)
    document.getElementById('saveStatus').textContent = '저장 기능은 곧 연결됩니다!';
    // console.log({name, answers});
  });
}); 