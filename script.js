from pathlib import Path

# Supabase + Canvas 기능 통합된 JS 코드 생성
js_code = """
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://gthpeppdugkodczaszbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0aHBlcHBkdWdrb2RjemFzemJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MTY3NTgsImV4cCI6MjA2NjQ5Mjc1OH0.tlXK4q9GHrdrs59X474iftcRyQqQWfVWd48W25lbI0A';
const supabase = createClient(supabaseUrl, supabaseKey);

// 그림판 기능
const canvases = document.querySelectorAll('.drawpad');

canvases.forEach((canvas) => {
  const ctx = canvas.getContext('2d');
  let painting = false;

  canvas.addEventListener('mousedown', () => painting = true);
  canvas.addEventListener('mouseup', () => {
    painting = false;
    ctx.beginPath();
  });
  canvas.addEventListener('mouseleave', () => {
    painting = false;
    ctx.beginPath();
  });
  canvas.addEventListener('mousemove', draw);

  function draw(e) {
    if (!painting) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }
});

// 지우기 기능
const clearButtons = document.querySelectorAll('.clear-pad');
clearButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const ctx = canvases[index].getContext('2d');
    ctx.clearRect(0, 0, canvases[index].width, canvases[index].height);
  });
});

// Supabase 저장 함수
async function saveToSupabase() {
  const studentName = document.getElementById("studentName").value.trim();
  const answerText = document.getElementById("answerTextarea").value.trim();

  if (!studentName || !answerText) {
    alert("이름과 답안을 모두 입력해주세요.");
    return;
  }

  const { data, error } = await supabase
    .from("problem")
    .insert([{ name: studentName, answer: answerText }]);

  if (error) {
    alert("❌ 저장 실패: " + error.message);
  } else {
    alert("✅ 저장 완료!");
    document.getElementById("studentName").value = '';
    document.getElementById("answerTextarea").value = '';
  }
}

// 버튼 클릭 이벤트 연결
document.getElementById("submitButton").addEventListener("click", (e) => {
  e.preventDefault();
  saveToSupabase();
});
"""

# 파일로 저장
js_path = Path("/mnt/data/script_full.js")
js_path.write_text(js_code.strip(), encoding="utf-8")
js_path.name
