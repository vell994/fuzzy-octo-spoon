const fields = {
      name: document.getElementById('name'),
      degree: document.getElementById('degree'),
      program: document.getElementById('program'),
      university: document.getElementById('university'),
      date: document.getElementById('date'),
      city: document.getElementById('city'),
      notes: document.getElementById('notes'),
      signature: document.getElementById('signature')
    };

    const p = {
      student: document.getElementById('pStudent'),
      degree: document.getElementById('pDegree'),
      program: document.getElementById('pProgram'),
      university: document.getElementById('pUniversity'),
      date: document.getElementById('pDate'),
      signature: document.getElementById('pSignature')
    };

    const btnGenerate = document.getElementById('generateBtn');
    const btnClear = document.getElementById('clearBtn');

    function updatePreview() {
      p.student.textContent = fields.name.value || 'Иван Иванов';
      p.degree.textContent = fields.degree.value || '...';
      p.program.textContent = fields.program.value || '...';
      p.university.textContent = fields.university.value || '...';
      if (fields.date.value) {
        const d = new Date(fields.date.value);
        p.date.textContent = d.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
      } else {
        p.date.textContent = 'Дата выдачи';
      }
      p.signature.textContent = (fields.signature.value || 'Должность') + ' / подпись';
      // Заголовок и подпись
      document.getElementById('diplomaTitle').textContent = 'Диплом об образовании';
      document.getElementById('diplomaSubtitle').textContent = (fields.university.value || 'Учебное заведение') + ' | ' + (fields.city.value || 'Город');
    }

    Object.values(fields).forEach(f => f.addEventListener('input', updatePreview));

    btnGenerate.addEventListener('click', updatePreview);

    btnClear.addEventListener('click', () => {
      Object.values(fields).forEach(f => f.value = '');
      updatePreview();
    });

    // Инициализация предпросмотра
    updatePreview();
    // Ссылки на новые кнопки
const btnDownloadPdf = document.getElementById('downloadPdfBtn');
const btnEmail = document.getElementById('emailBtn');

// 1. Сохранение в PDF
btnDownloadPdf.addEventListener('click', async () => {
  const diplomaElement = document.getElementById('diploma');
  if (!diplomaElement) return alert('Ошибка: не найден элемент с id="diploma"');

  try {
    // Преобразуем HTML-блок в canvas (картинку)
    const canvas = await html2canvas(diplomaElement, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    // Инициализируем jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Размеры страницы A4 в мм
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Вставляем изображение на всю страницу и сохраняем
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Диплом.pdf');
  } catch (err) {
    console.error('Ошибка генерации PDF:', err);
    alert('Не удалось создать PDF. Проверьте консоль разработчика.');
  }
});

// 2. Отправка по почте
btnEmail.addEventListener('click', () => {
  // Браузеры не позволяют автоматически прикреплять файлы к mailto из-за безопасности
  alert('⚠️ Из-за ограничений безопасности браузер не может автоматически прикрепить файл к письму.\n\nСначала скачается PDF, затем откроется почтовая программа. Вам нужно будет вручную перетащить скачанный файл в письмо.');
  
  // Сначала инициируем скачивание
  btnDownloadPdf.click();

  // Через небольшую задержку открываем почтовый клиент с заполненным темой и текстом
  setTimeout(() => {
    const subject = encodeURIComponent('Диплом об образовании');
    const body = encodeURIComponent('Здравствуйте,\n\nВо вложении вы найдете сгенерированный диплом.\n\nС уважением,');
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, 800);
});