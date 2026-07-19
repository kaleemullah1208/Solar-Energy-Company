/**
 * SolarVision Energy — Contact Page JS
 * Features: form validation, FAQ accordion, form success state
 */

'use strict';

/* ============================================================
   1. FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-item__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (unless it was already open)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ============================================================
   2. CONTACT FORM VALIDATION & SUBMISSION
   ============================================================ */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate async submission
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      setTimeout(() => {
        form.hidden = true;
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1200);
    }
  });

  // Live validation on blur
  form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });
}

function validateField(field) {
  const group = field.closest('.form-group');
  let errorEl = group.querySelector('.field-error');

  // Create error element if missing
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    group.appendChild(errorEl);
  }

  let message = '';

  if (field.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!field.value.trim()) {
      message = 'Email address is required.';
    } else if (!emailRegex.test(field.value)) {
      message = 'Please enter a valid email address.';
    }
  } else if (field.tagName === 'SELECT') {
    if (!field.value) message = 'Please select an option.';
  } else if (field.type === 'checkbox') {
    if (!field.checked) message = 'Please accept to continue.';
  } else {
    if (!field.value.trim()) message = `${field.labels?.[0]?.textContent?.replace(' *','') || 'This field'} is required.`;
  }

  if (message) {
    field.classList.add('invalid');
    errorEl.textContent = message;
    errorEl.classList.add('show');
    return false;
  } else {
    field.classList.remove('invalid');
    errorEl.classList.remove('show');
    return true;
  }
}

function validateForm() {
  const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  requiredFields.forEach(field => {
    if (!validateField(field)) isValid = false;
  });
  return isValid;
}
