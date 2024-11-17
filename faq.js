document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
      const answer = button.nextElementSibling;
      if (button.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });
