import { questionsBank } from '../data/curriculum.js';

export function renderQuestion(questionData, container, onAnswerSubmit) {
  if (!questionData) {
    container.innerHTML = '<div style="text-align:center; padding: 20px;">Error loading question</div>';
    return;
  }

  if (questionData.type === 'multiple_choice') {
    let optionsHtml = '';
    questionData.options.forEach((opt, idx) => {
      const isObj = typeof opt === 'object' && opt !== null;
      const text = isObj ? opt.text : opt;
      const transliteration = isObj && opt.transliteration ? `<div style="font-size: 14px; color: var(--color-gray-400); font-weight: normal; margin-top: 4px;">${opt.transliteration}</div>` : '';

      optionsHtml += `
        <button class="btn btn-ghost question-option" data-idx="${idx}" style="margin-bottom: 12px; font-size: 18px; padding: 16px; border-width: 2px; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
          <div>${text}</div>
          ${transliteration}
        </button>
      `;
    });

    container.innerHTML = `
      <h2 style="font-size: 24px; margin-bottom: 32px;">${questionData.question}</h2>
      <div class="flex-col">
        ${optionsHtml}
      </div>
    `;

    const options = container.querySelectorAll('.question-option');
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        // Deselect all
        options.forEach(o => {
          o.style.borderColor = 'var(--color-gray-200)';
          o.style.backgroundColor = 'var(--color-bg)';
          o.style.color = 'var(--color-gray-400)';
        });

        // Select current
        const selected = e.currentTarget;
        selected.style.borderColor = 'var(--color-secondary)';
        selected.style.backgroundColor = '#e1f5fe';
        selected.style.color = 'var(--color-secondary)';

        const selectedIdx = parseInt(selected.dataset.idx, 10);
        onAnswerSubmit(selectedIdx === questionData.answer);
      });
    });
  } else {
    container.innerHTML = '<div>Unsupported question type</div>';
    onAnswerSubmit(true); // hack for untested types
  }
}
