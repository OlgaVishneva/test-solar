export default function cleanInput() {
  // Сначала скрываем все сообщения об ошибками
  document.querySelectorAll('.field__hint--error').forEach(hint => {
    hint.style.display = 'none';
  });

  // Инициализация маски телефона
  function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(input => {
      // Устанавливаем placeholder если его нет
      if (!input.getAttribute('placeholder')) {
        input.setAttribute('placeholder', '+7 (___) ___-__-__');
      }

      input.addEventListener('input', function (e) {
        const input = e.target;
        let value = input.value.replace(/\D/g, '');

        // Если номер начинается с 8, заменяем на 7
        if (value.startsWith('8')) {
          value = '7' + value.substring(1);
        }

        // Если номер не начинается с 7, добавляем 7 в начало
        if (!value.startsWith('7') && value.length > 0) {
          value = '7' + value;
        }

        let formattedValue = '';

        if (value.length > 0) {
          formattedValue = '+7 ';

          if (value.length > 1) {
            const numbers = value.substring(1);

            if (numbers.length > 0) {
              formattedValue += '(' + numbers.substring(0, 3);
            }
            if (numbers.length >= 4) {
              formattedValue += ') ' + numbers.substring(3, 6);
            }
            if (numbers.length >= 7) {
              formattedValue += '-' + numbers.substring(6, 8);
            }
            if (numbers.length >= 9) {
              formattedValue += '-' + numbers.substring(8, 10);
            }
          }
        }

        input.value = formattedValue;

        // Вызываем валидацию после применения маски
        const field = input.closest('.field');
        if (field) {
          validatePhoneField(field);
        }
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && e.target.value.length <= 4) {
          setTimeout(() => {
            e.target.value = '';
            const field = e.target.closest('.field');
            if (field) {
              validatePhoneField(field);
            }
          }, 0);
        }
      });

      input.addEventListener('focus', function () {
        if (!this.value) {
          this.value = '+7 ';
        }
      });
    });
  }

  // Специальная валидация для телефонных полей
  function validatePhoneField(field) {
    const input = field.querySelector('.field__control');
    if (!input || input.type !== 'tel') return true;

    const value = input.value.trim();
    const isRequired = input.hasAttribute('required');

    // Очищаем предыдущие ошибки
    clearFieldError(field);

    // Проверка на обязательное поле
    if (isRequired && (value === '' || value === '+7')) {
      showFieldError(field, 'Error');
      return false;
    }

    // Проверка полного формата телефона (+7 (999) 999-99-99)
    if (value !== '' && value !== '+7') {
      const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
      if (!phoneRegex.test(value)) {
        showFieldError(field, 'Введите телефон в формате +7 (999) 999-99-99');
        return false;
      }
    }

    return true;
  }

  // Функция очистки поля
  document.addEventListener('click', function (e) {
    if (e.target.closest('.field__btn--clear')) {
      const clearButton = e.target.closest('.field__btn--clear');
      const field = clearButton.closest('.field');
      const input = field.querySelector('.field__control');

      if (input) {
        // Для телефонных полей очищаем полностью
        if (input.type === 'tel') {
          input.value = '';
        } else {
          input.value = '';
        }
        input.focus();

        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        // Очищаем ошибку при очистке поля
        clearFieldError(field);
      }
    }
  });

  // Функция очистки ошибки поля
  function clearFieldError(field) {
    field.classList.remove('_error');
    const hint = field.querySelector('.field__hint--error');
    if (hint) {
      hint.style.display = 'none';
    }
  }

  // Функция показа ошибки
  function showFieldError(field, message) {
    field.classList.add('_error');
    const hint = field.querySelector('.field__hint--error');
    if (hint) {
      hint.textContent = message;
      hint.style.display = 'block';
    }
  }

  // Функция валидации поля (обновленная)
  function validateField(field) {
    const input = field.querySelector('.field__control');
    if (!input) return true;

    // Для телефонных полей используем специальную валидацию
    if (input.type === 'tel') {
      return validatePhoneField(field);
    }

    const value = input.value.trim();
    const isRequired = input.hasAttribute('required');

    // Очищаем предыдущие ошибки
    clearFieldError(field);

    // Проверка на обязательное поле
    if (isRequired && value === '') {
      showFieldError(field, 'Error');
      return false;
    }

    // Проверка email
    if (input.type === 'email' && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showFieldError(field, 'Error');
        return false;
      }
    }

    // Проверка по pattern
    if (input.hasAttribute('pattern') && value !== '') {
      const pattern = new RegExp(input.getAttribute('pattern'));
      if (!pattern.test(value)) {
        showFieldError(field, 'Error');
        return false;
      }
    }

    return true;
  }

  // Инициализация валидации для всех полей
  function initValidation() {
    const fields = document.querySelectorAll('.field');

    fields.forEach(field => {
      const input = field.querySelector('.field__control');
      if (!input) return;

      // Валидация при уходе с поля
      input.addEventListener('blur', () => {
        validateField(field);
      });

      // Для телефонных полей добавляем дополнительную валидацию при вводе
      if (input.type === 'tel') {
        input.addEventListener('input', () => {
          validatePhoneField(field);
        });
      }
    });

    // Валидация при отправке форм
    document.addEventListener('submit', function (e) {
      const form = e.target;
      const fieldsInForm = form.querySelectorAll('.field');
      let isFormValid = true;

      fieldsInForm.forEach(field => {
        if (!validateField(field)) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        e.preventDefault();
        const firstErrorField = form.querySelector('._error');
        if (firstErrorField) {
          const input = firstErrorField.querySelector('.field__control');
          if (input) {
            input.focus();
          }
        }
      }
    });
  }

  // Инициализация всех функций
  initPhoneMask();
  initValidation();
}