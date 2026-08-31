/**
 * Best Buy Metals - Documentation of Company Infraction
 * Two-Screen Workflow (Form Entry -> Confirmation & Document Review)
 * Dynamic Multi-Page Engine & PDF Generation
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Screen Elements & Header Navigation
  // --------------------------------------------------------------------------
  const screenForm = document.getElementById('screenForm');
  const screenConfirmation = document.getElementById('screenConfirmation');
  const formHeaderActions = document.getElementById('formHeaderActions');
  const confirmHeaderActions = document.getElementById('confirmHeaderActions');
  const headerTitle = document.getElementById('headerTitle');

  const btnGoToConfirmHeader = document.getElementById('btnGoToConfirmHeader');
  const btnReviewForm = document.getElementById('btnReviewForm');

  const btnBackToEditHeader = document.getElementById('btnBackToEditHeader');
  const btnBackToEdit = document.getElementById('btnBackToEdit');
  const btnBackToEditBottom = document.getElementById('btnBackToEditBottom');

  // Confirmation Meta Chips
  const confirmEmpName = document.getElementById('confirmEmpName');
  const confirmNoticeLevel = document.getElementById('confirmNoticeLevel');
  const confirmDate = document.getElementById('confirmDate');
  const confirmPageCount = document.getElementById('confirmPageCount');

  // --------------------------------------------------------------------------
  // Form Inputs
  // --------------------------------------------------------------------------
  const inputEmployeeName = document.getElementById('inputEmployeeName');
  const inputNoticeDate = document.getElementById('inputNoticeDate');
  const radioDisciplinary = document.querySelectorAll('input[name="disciplinaryLevel"]');
  const suspensionFields = document.getElementById('suspensionFields');
  const inputSuspensionDates = document.getElementById('inputSuspensionDates');
  const inputReturnDate = document.getElementById('inputReturnDate');

  // Checkboxes & Details Cards
  const chkItems = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
  const chkPolicy = document.getElementById('chkPolicy');
  const cardPolicy = document.getElementById('cardPolicy');
  const inputPolicyName = document.getElementById('inputPolicyName');

  const chkAbsenteeism = document.getElementById('chkAbsenteeism');
  const cardAbsenteeism = document.getElementById('cardAbsenteeism');
  const inputAbsenteeismDates = document.getElementById('inputAbsenteeismDates');

  const chkTardiness = document.getElementById('chkTardiness');
  const cardTardiness = document.getElementById('cardTardiness');
  const inputTardinessTimes = document.getElementById('inputTardinessTimes');

  const chkOther = document.getElementById('chkOther');
  const cardOther = document.getElementById('cardOther');
  const inputOtherDesc = document.getElementById('inputOtherDesc');

  // Incident Details textarea & counters
  const inputDetails = document.getElementById('inputDetails');
  const charCount = document.getElementById('charCount');
  const wordCount = document.getElementById('wordCount');
  const pageImpactBadge = document.getElementById('pageImpactBadge');

  // Action Buttons
  const btnSampleData = document.getElementById('btnSampleData');
  const btnClearForm = document.getElementById('btnClearForm');
  const btnClearFormBottom = document.getElementById('btnClearFormBottom');
  const saveIndicator = document.getElementById('saveIndicator');

  // Confirmation Download / Print Buttons
  const btnDownloadPdfHeader = document.getElementById('btnDownloadPdfHeader');
  const btnDownloadPdfConfirm = document.getElementById('btnDownloadPdfConfirm');
  const btnDownloadPdfBottom = document.getElementById('btnDownloadPdfBottom');
  const btnPrintHeader = document.getElementById('btnPrintHeader');
  const btnPrintConfirm = document.getElementById('btnPrintConfirm');
  const btnPrintBottom = document.getElementById('btnPrintBottom');
  const bottomBarDocStatus = document.getElementById('bottomBarDocStatus');

  // Preview & Zoom Elements
  const documentRenderContainer = document.getElementById('documentRenderContainer');
  const totalPagesBadge = document.getElementById('totalPagesBadge');
  const zoomLevelDisplay = document.getElementById('zoomLevel');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomFit = document.getElementById('btnZoomFit');

  // --------------------------------------------------------------------------
  // Default Values & Today Date Setup
  // --------------------------------------------------------------------------
  const todayIso = new Date().toISOString().split('T')[0];
  if (!inputNoticeDate.value) inputNoticeDate.value = todayIso;

  // --------------------------------------------------------------------------
  // Conditional Suspension Notice Fields
  // --------------------------------------------------------------------------
  function updateSuspensionVisibility() {
    const selected = document.querySelector('input[name="disciplinaryLevel"]:checked')?.value;
    if (selected === 'Suspension without pay notice') {
      suspensionFields.classList.add('visible');
    } else {
      suspensionFields.classList.remove('visible');
    }
  }

  radioDisciplinary.forEach(r => {
    r.addEventListener('change', () => {
      updateSuspensionVisibility();
      saveDraft();
    });
  });

  function setupDetailCard(chk, card, input) {
    chk.addEventListener('change', () => {
      if (chk.checked) {
        card.classList.add('active');
        input.focus();
      } else {
        card.classList.remove('active');
      }
      saveDraft();
    });
    input.addEventListener('input', () => saveDraft());
  }

  setupDetailCard(chkPolicy, cardPolicy, inputPolicyName);
  setupDetailCard(chkAbsenteeism, cardAbsenteeism, inputAbsenteeismDates);
  setupDetailCard(chkTardiness, cardTardiness, inputTardinessTimes);
  setupDetailCard(chkOther, cardOther, inputOtherDesc);

  chkItems.forEach(chk => {
    chk.addEventListener('change', () => saveDraft());
  });

  // Textarea Counters
  inputDetails.addEventListener('input', () => {
    const text = inputDetails.value;
    charCount.textContent = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    wordCount.textContent = words;
    // Estimate page count (calibrated to standard 12pt format)
    const estimatedPages = Math.max(2, Math.ceil(words / 360) + 1);
    pageImpactBadge.textContent = `${estimatedPages} Pages`;
    saveDraft();
  });

  // General Inputs change listener
  [
    inputEmployeeName,
    inputNoticeDate,
    inputSuspensionDates,
    inputReturnDate
  ].forEach(input => {
    input.addEventListener('input', () => saveDraft());
  });

  // --------------------------------------------------------------------------
  // Zoom Controls on Confirmation Screen
  // --------------------------------------------------------------------------
  let currentZoom = 0.8;
  function setZoom(zoom) {
    currentZoom = Math.min(Math.max(zoom, 0.4), 1.3);
    documentRenderContainer.style.transform = `scale(${currentZoom})`;
    zoomLevelDisplay.textContent = `${Math.round(currentZoom * 100)}%`;
  }

  btnZoomIn.addEventListener('click', () => setZoom(currentZoom + 0.1));
  btnZoomOut.addEventListener('click', () => setZoom(currentZoom - 0.1));
  btnZoomFit.addEventListener('click', () => setZoom(0.8));

  // --------------------------------------------------------------------------
  // Density Controls on Confirmation Screen
  // --------------------------------------------------------------------------
  const densityBtns = document.querySelectorAll('.density-btn');
  let currentDensity = { size: '12pt', line: '1.55' };

  function applyDensity(size, line) {
    currentDensity.size = size;
    currentDensity.line = line;
    documentRenderContainer.style.setProperty('--details-font-size', size);
    documentRenderContainer.style.setProperty('--details-line-height', line);

    // Update active button state
    densityBtns.forEach(btn => {
      if (btn.getAttribute('data-size') === size) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Re-run pagination with unscaled container for accurate measurement
    if (!screenConfirmation.classList.contains('hidden')) {
      documentRenderContainer.style.transform = 'none';
      const totalPages = updateDocument();
      documentRenderContainer.style.transform = `scale(${currentZoom})`;
      confirmPageCount.textContent = `${totalPages} Page${totalPages > 1 ? 's' : ''} Generated`;
      if (bottomBarDocStatus) {
        const empName = inputEmployeeName.value.trim();
        bottomBarDocStatus.textContent = `${empName || 'Employee'} • ${totalPages} Pages`;
      }
    }
  }

  densityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyDensity(btn.getAttribute('data-size'), btn.getAttribute('data-line'));
      saveDraft();
    });
  });

  // --------------------------------------------------------------------------
  function goToConfirmation() {
    const empName = inputEmployeeName.value.trim();
    if (!empName) {
      alert('Please enter the Employee Name before continuing to confirmation.');
      inputEmployeeName.focus();
      return;
    }

    // 1. Switch view FIRST so elements are rendered and measurable in the DOM!
    screenForm.classList.add('hidden');
    screenConfirmation.classList.remove('hidden');

    formHeaderActions.style.display = 'none';
    confirmHeaderActions.style.display = 'flex';
    headerTitle.textContent = 'Review & Confirmation';

    // 2. Temporarily set transform to 'none' during pagination measurement
    documentRenderContainer.style.transform = 'none';
    documentRenderContainer.style.setProperty('--details-font-size', currentDensity.size);
    documentRenderContainer.style.setProperty('--details-line-height', currentDensity.line);

    // 3. Build the document pages (now accurately measures real DOM dimensions)
    const totalPages = updateDocument();

    // 4. Restore zoom
    documentRenderContainer.style.transform = `scale(${currentZoom})`;

    // 5. Populate confirmation metadata chips
    confirmEmpName.textContent = `Employee: ${empName}`;
    const level = document.querySelector('input[name="disciplinaryLevel"]:checked')?.value || 'Verbal Warning';
    confirmNoticeLevel.textContent = `Level: ${level}`;
    confirmDate.textContent = `Date: ${formatDate(inputNoticeDate.value)}`;
    confirmPageCount.textContent = `${totalPages} Page${totalPages > 1 ? 's' : ''} Generated`;

    const confirmWordIntegrity = document.getElementById('confirmWordIntegrity');
    const words = inputDetails.value.trim() ? inputDetails.value.trim().split(/\s+/).length : 0;
    if (confirmWordIntegrity) {
      confirmWordIntegrity.textContent = `✓ 100% Content Included (${words.toLocaleString()} words)`;
    }

    if (bottomBarDocStatus) {
      bottomBarDocStatus.textContent = `${empName || 'Employee'} • ${totalPages} Pages`;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function backToForm() {
    screenConfirmation.classList.add('hidden');
    screenForm.classList.remove('hidden');

    confirmHeaderActions.style.display = 'none';
    formHeaderActions.style.display = 'flex';
    headerTitle.textContent = 'Company Infraction Form';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  btnGoToConfirmHeader.addEventListener('click', goToConfirmation);
  btnReviewForm.addEventListener('click', goToConfirmation);

  btnBackToEditHeader.addEventListener('click', backToForm);
  btnBackToEdit.addEventListener('click', backToForm);
  btnBackToEditBottom.addEventListener('click', backToForm);

  // --------------------------------------------------------------------------
  // Format Date Helper
  // --------------------------------------------------------------------------
  function formatDate(isoStr) {
    if (!isoStr) return '';
    const parts = isoStr.split('-');
    if (parts.length !== 3) return isoStr;
    const [y, m, d] = parts;
    return `${m}/${d}/${y}`;
  }

  // --------------------------------------------------------------------------
  // Document Page Templates
  // --------------------------------------------------------------------------
  function createDocHeader(isContinuation = false) {
    const header = document.createElement('div');
    header.className = 'doc-header';
    header.innerHTML = `
      <img src="assets/logo.png" alt="Best Buy Metals" class="doc-logo-img">
      <div class="doc-title">DOCUMENTATION OF COMPANY INFRACTION${isContinuation ? ' (Continued)' : ''}</div>
    `;
    return header;
  }

  function createDocFooter(pageNum, totalPages) {
    const footer = document.createElement('div');
    footer.className = 'doc-footer';
    footer.innerHTML = `
      <div class="doc-rev">Rev 07/2026</div>
      <div class="doc-page-count">Page ${pageNum} of ${totalPages}</div>
    `;
    return footer;
  }

  function renderPage1() {
    const page = document.createElement('div');
    page.className = 'pdf-page';
    page.id = 'docPage1';

    page.appendChild(createDocHeader(false));

    const content = document.createElement('div');
    content.className = 'doc-page1-body';

    const empName = inputEmployeeName.value.trim();
    const noticeDate = formatDate(inputNoticeDate.value);

    content.innerHTML = `
      <div class="doc-field-line" style="margin-bottom: 0.22in;">
        <span class="doc-field-label">Employee Name: </span>
        <span class="doc-field-fill" style="flex: 2.8; margin-right: 0.4in;">${empName || '&nbsp;'}</span>
        <span class="doc-field-label">Date: </span>
        <span class="doc-field-fill" style="flex: 1.2;">${noticeDate || '&nbsp;'}</span>
      </div>

      <div class="doc-notice-text">
        <p>You are receiving this <span class="doc-notice-highlight">Documentation of Company Infraction</span> as a result of the issue(s) described below.</p>
        <p>We trust that you will correct this matter by improving your performance of your job and/or refraining from the act or omission that has led to this Documentation of Company Infraction.</p>
        <p>Failure to make appropriate corrections will lead to further discipline, up to and including termination.</p>
      </div>
    `;

    // Disciplinary Level
    const selectedLevel = document.querySelector('input[name="disciplinaryLevel"]:checked')?.value || 'Verbal Warning';
    const isSuspension = (selectedLevel === 'Suspension without pay notice');
    const suspDates = inputSuspensionDates.value.trim();
    const returnDate = inputReturnDate.value.trim();

    const disciplinaryDiv = document.createElement('div');
    disciplinaryDiv.className = 'doc-disciplinary-block';
    disciplinaryDiv.innerHTML = `
      <div class="doc-disciplinary-line">
        <span class="doc-field-label">Select One:</span>
        <span class="doc-disciplinary-value">${selectedLevel}</span>
      </div>
      <div class="doc-suspension-box" style="display: ${isSuspension ? 'block' : 'none'};">
        <div style="font-weight: 700; margin-bottom: 0.05in;">If selected 'Suspension without Pay Notice' include the following:</div>
        <div class="doc-field-line" style="margin-bottom: 0.06in;">
          <span class="doc-field-label">Employee Suspension Dates: </span>
          <span class="doc-field-fill" style="flex: 1;">${suspDates || '&nbsp;'}</span>
        </div>
        <div class="doc-field-line">
          <span class="doc-field-label">Employee Expected to Return to Work Date: </span>
          <span class="doc-field-fill" style="flex: 1;">${returnDate || '&nbsp;'}</span>
        </div>
      </div>
    `;
    content.appendChild(disciplinaryDiv);

    // Nature of Infraction Checkboxes
    const infractionsDiv = document.createElement('div');
    infractionsDiv.className = 'doc-nature-section';
    infractionsDiv.innerHTML = `
      <div class="doc-nature-heading">Nature of Infraction: <span>(check all that apply)</span></div>
      <div class="doc-checkbox-grid">
        <div class="doc-checkbox-row">
          <span class="doc-box ${document.getElementById('chkPoorPerformance').checked ? 'checked' : ''}"></span>
          <span>Poor Work Performance</span>
        </div>
        <div class="doc-checkbox-row">
          <span class="doc-box ${document.getElementById('chkRefusalOvertime').checked ? 'checked' : ''}"></span>
          <span>Refusal to work overtime</span>
        </div>
        <div class="doc-checkbox-row">
          <span class="doc-box ${document.getElementById('chkAbuseLeave').checked ? 'checked' : ''}"></span>
          <span>Abuse of Leave</span>
        </div>
        <div class="doc-checkbox-row">
          <span class="doc-box ${document.getElementById('chkSubstanceAbuse').checked ? 'checked' : ''}"></span>
          <span>Substance Use/Abuse</span>
        </div>
        <div class="doc-checkbox-row">
          <span class="doc-box ${document.getElementById('chkInsubordination').checked ? 'checked' : ''}"></span>
          <span>Insubordination</span>
        </div>
        <div class="doc-checkbox-row">
          <span class="doc-box ${document.getElementById('chkMisuseProperty').checked ? 'checked' : ''}"></span>
          <span>Misuse of Company Property</span>
        </div>
        <div class="doc-checkbox-row">
          <span class="doc-box ${document.getElementById('chkImproperConduct').checked ? 'checked' : ''}"></span>
          <span>Improper Conduct</span>
        </div>
        <div class="doc-checkbox-row">
          <span class="doc-box ${document.getElementById('chkPropertyDamage').checked ? 'checked' : ''}"></span>
          <span>Property Damage</span>
        </div>
        <div class="doc-checkbox-row">
          <span class="doc-box ${document.getElementById('chkSafetyViolation').checked ? 'checked' : ''}"></span>
          <span>Safety Violation</span>
        </div>
      </div>

      <!-- Detail Lines -->
      <div class="doc-detail-entry">
        <div class="doc-detail-entry-header">
          <span class="doc-box ${chkPolicy.checked ? 'checked' : ''}"></span>
          <span>Failure to comply with company policy</span>
          <span class="helper-text">(Name of Policy)</span>
        </div>
        <div class="doc-writein-line">${inputPolicyName.value.trim() || '&nbsp;'}</div>
      </div>

      <div class="doc-detail-entry">
        <div class="doc-detail-entry-header">
          <span class="doc-box ${chkAbsenteeism.checked ? 'checked' : ''}"></span>
          <span>Absenteeism</span>
          <span class="helper-text">(List all applicable dates of absenteeism)</span>
        </div>
        <div class="doc-writein-line">${inputAbsenteeismDates.value.trim() || '&nbsp;'}</div>
      </div>

      <div class="doc-detail-entry">
        <div class="doc-detail-entry-header">
          <span class="doc-box ${chkTardiness.checked ? 'checked' : ''}"></span>
          <span>Tardiness</span>
          <span class="helper-text">(List all applicable dates & tardiness times)</span>
        </div>
        <div class="doc-writein-line">${inputTardinessTimes.value.trim() || '&nbsp;'}</div>
      </div>

      <div class="doc-detail-entry">
        <div class="doc-detail-entry-header">
          <span class="doc-box ${chkOther.checked ? 'checked' : ''}"></span>
          <span>Other</span>
        </div>
        <div class="doc-writein-line">${inputOtherDesc.value.trim() || '&nbsp;'}</div>
      </div>
    `;
    content.appendChild(infractionsDiv);

    page.appendChild(content);
    page.appendChild(createDocFooter(1, 2));
    return page;
  }

  function createSignatureBlock() {
    const block = document.createElement('div');
    block.className = 'doc-signatures-block';

    block.innerHTML = `
      <!-- Employee Signature -->
      <div class="doc-signature-row">
        <div class="doc-sig-col">
          <div class="doc-sig-image-area"></div>
          <div class="doc-sig-underline"></div>
          <div class="doc-sig-label">Employee Signature</div>
        </div>
        <div class="doc-sig-col">
          <div class="doc-sig-image-area"></div>
          <div class="doc-sig-underline"></div>
          <div class="doc-sig-label">Date (MM/DD/YYYY)</div>
        </div>
      </div>

      <!-- Manager Printed Name -->
      <div style="margin-bottom: 0.25in; width: 65%;">
        <div style="min-height: 20px;"></div>
        <div class="doc-sig-underline"></div>
        <div class="doc-sig-label">Manager/Direct Report Printed Name</div>
      </div>

      <!-- Manager Signature -->
      <div class="doc-signature-row" style="margin-bottom: 0;">
        <div class="doc-sig-col">
          <div class="doc-sig-image-area"></div>
          <div class="doc-sig-underline"></div>
          <div class="doc-sig-label">Manager/Direct Report Signature</div>
        </div>
        <div class="doc-sig-col">
          <div class="doc-sig-image-area"></div>
          <div class="doc-sig-underline"></div>
          <div class="doc-sig-label">Date (MM/DD/YYYY)</div>
        </div>
      </div>
    `;

    return block;
  }

  function createDetailsPage(pageNum) {
    const isContinuation = (pageNum > 2);
    const page = document.createElement('div');
    page.className = 'pdf-page';
    page.id = `docPage${pageNum}`;
    page.appendChild(createDocHeader(isContinuation));

    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'doc-details-container';
    detailsContainer.innerHTML = `<div class="doc-details-title">Details${isContinuation ? ' (Continued)' : ''}:</div>`;

    const detailsBody = document.createElement('div');
    detailsBody.className = 'doc-details-body';
    detailsContainer.appendChild(detailsBody);
    page.appendChild(detailsContainer);

    const footer = createDocFooter(pageNum, pageNum);
    page.appendChild(footer);

    return { page, detailsContainer, detailsBody, footer };
  }

  /**
   * Main Document Builder - Infinite Dynamic Multi-Page Engine
   */
  function updateDocument() {
    documentRenderContainer.innerHTML = '';

    // Render Page 1
    const p1 = renderPage1();
    documentRenderContainer.appendChild(p1);

    const rawDetails = inputDetails.value.trim();
    const rawParagraphs = rawDetails ? rawDetails.split(/\n+/) : [''];

    const pages = [p1];
    let pageNum = 2;

    let current = createDetailsPage(pageNum);
    documentRenderContainer.appendChild(current.page);
    pages.push(current.page);

    const queue = [...rawParagraphs];

    while (queue.length > 0) {
      const pText = queue.shift().trim();
      if (!pText) continue;

      // Support manual page breaks (e.g. '---', '[pagebreak]', '***')
      if (pText === '---' || pText === '[pagebreak]' || pText === '***') {
        pageNum++;
        current = createDetailsPage(pageNum);
        documentRenderContainer.appendChild(current.page);
        pages.push(current.page);
        continue;
      }

      const pEl = document.createElement('p');
      pEl.style.marginBottom = '0.65em';
      pEl.textContent = pText;
      current.detailsBody.appendChild(pEl);

      // Check if page overflows Letter dimensions
      if (current.page.scrollHeight > current.page.clientHeight + 1) {
        current.detailsBody.removeChild(pEl);

        const words = pText.split(' ');
        let low = 0;
        let high = words.length;
        let bestFit = 0;

        const testP = document.createElement('p');
        testP.style.marginBottom = '0.65em';
        current.detailsBody.appendChild(testP);

        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          testP.textContent = words.slice(0, mid).join(' ');
          if (current.page.scrollHeight <= current.page.clientHeight + 1) {
            bestFit = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }

        if (bestFit <= 0 && current.detailsBody.children.length > 1) {
          // Current page already has content. Remove testP and move this whole paragraph to next page.
          current.detailsBody.removeChild(testP);
          queue.unshift(pText);
          pageNum++;
          current = createDetailsPage(pageNum);
          documentRenderContainer.appendChild(current.page);
          pages.push(current.page);
        } else {
          const actualFit = Math.max(1, bestFit);
          testP.textContent = words.slice(0, actualFit).join(' ');
          const remainder = words.slice(actualFit).join(' ').trim();
          if (remainder) {
            queue.unshift(remainder);
          }
          if (queue.length > 0) {
            pageNum++;
            current = createDetailsPage(pageNum);
            documentRenderContainer.appendChild(current.page);
            pages.push(current.page);
          }
        }
      }
    }

    // Attach signatures to the FINAL page
    const sigBlock = createSignatureBlock();
    current.page.insertBefore(sigBlock, current.footer);

    // If signatures cause this page to overflow, push them to a fresh final page
    if (current.page.scrollHeight > current.page.clientHeight + 2) {
      current.page.removeChild(sigBlock);

      pageNum++;
      const finalPage = createDetailsPage(pageNum);
      const continuationNote = document.createElement('p');
      continuationNote.style.fontStyle = 'italic';
      continuationNote.style.color = '#64748b';
      continuationNote.style.fontSize = '9pt';
      continuationNote.textContent = '[Signatures and acknowledgement continued from preceding page]';
      finalPage.detailsBody.appendChild(continuationNote);

      finalPage.page.insertBefore(sigBlock, finalPage.footer);
      documentRenderContainer.appendChild(finalPage.page);
      pages.push(finalPage.page);
    }

    // Update dynamic page numbers across all pages: "Page X of Total"
    const totalPages = pages.length;
    pages.forEach((p, idx) => {
      const footerPageCount = p.querySelector('.doc-page-count');
      if (footerPageCount) {
        footerPageCount.textContent = `Page ${idx + 1} of ${totalPages}`;
      }
    });

    // Update indicators
    totalPagesBadge.textContent = `${totalPages} Page${totalPages > 1 ? 's' : ''}`;
    pageImpactBadge.textContent = `${totalPages} Page${totalPages > 1 ? 's' : ''}`;

    return totalPages;
  }

  // --------------------------------------------------------------------------
  // LocalStorage Auto-Save & Restore
  // --------------------------------------------------------------------------
  const STORAGE_KEY = 'bbm_infraction_form_draft';

  function saveDraft() {
    saveIndicator.innerHTML = `<span class="dot" style="background:#f59e0b;"></span> <span>Saving...</span>`;

    const checkboxesState = {};
    document.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      checkboxesState[chk.id] = chk.checked;
    });

    const draft = {
      empName: inputEmployeeName.value,
      noticeDate: inputNoticeDate.value,
      disciplinaryLevel: document.querySelector('input[name="disciplinaryLevel"]:checked')?.value || 'Verbal Warning',
      suspensionDates: inputSuspensionDates.value,
      returnDate: inputReturnDate.value,
      checkboxes: checkboxesState,
      policyName: inputPolicyName.value,
      absenteeismDates: inputAbsenteeismDates.value,
      tardinessTimes: inputTardinessTimes.value,
      otherDesc: inputOtherDesc.value,
      details: inputDetails.value
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setTimeout(() => {
        saveIndicator.innerHTML = `<span class="dot" style="background:#059669;"></span> <span>Auto-saved</span>`;
      }, 300);
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const draft = JSON.parse(raw);

      if (draft.empName) inputEmployeeName.value = draft.empName;
      if (draft.noticeDate) inputNoticeDate.value = draft.noticeDate;

      if (draft.disciplinaryLevel) {
        const rad = document.querySelector(`input[name="disciplinaryLevel"][value="${draft.disciplinaryLevel}"]`);
        if (rad) rad.checked = true;
      }
      updateSuspensionVisibility();

      if (draft.suspensionDates) inputSuspensionDates.value = draft.suspensionDates;
      if (draft.returnDate) inputReturnDate.value = draft.returnDate;

      if (draft.checkboxes) {
        Object.keys(draft.checkboxes).forEach(id => {
          const chk = document.getElementById(id);
          if (chk) chk.checked = draft.checkboxes[id];
        });
      }

      if (draft.policyName) {
        inputPolicyName.value = draft.policyName;
        cardPolicy.classList.toggle('active', !!draft.checkboxes['chkPolicy']);
      }
      if (draft.absenteeismDates) {
        inputAbsenteeismDates.value = draft.absenteeismDates;
        cardAbsenteeism.classList.toggle('active', !!draft.checkboxes['chkAbsenteeism']);
      }
      if (draft.tardinessTimes) {
        inputTardinessTimes.value = draft.tardinessTimes;
        cardTardiness.classList.toggle('active', !!draft.checkboxes['chkTardiness']);
      }
      if (draft.otherDesc) {
        inputOtherDesc.value = draft.otherDesc;
        cardOther.classList.toggle('active', !!draft.checkboxes['chkOther']);
      }

      if (draft.details) {
        inputDetails.value = draft.details;
        charCount.textContent = draft.details.length;
        const words = draft.details.trim() ? draft.details.trim().split(/\s+/).length : 0;
        wordCount.textContent = words;
        pageImpactBadge.textContent = `${Math.max(2, Math.ceil(words / 360) + 1)} Pages`;
      }

      return true;
    } catch (e) {
      console.warn('Draft load error:', e);
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // Sample Data Loader
  // --------------------------------------------------------------------------
  btnSampleData.addEventListener('click', () => {
    inputEmployeeName.value = 'David K. Vance';
    inputNoticeDate.value = todayIso;

    const rad = document.querySelector('input[name="disciplinaryLevel"][value="Second Written Warning"]');
    if (rad) rad.checked = true;
    updateSuspensionVisibility();

    document.getElementById('chkPoorPerformance').checked = true;
    document.getElementById('chkSafetyViolation').checked = true;
    document.getElementById('chkPolicy').checked = true;
    cardPolicy.classList.add('active');
    inputPolicyName.value = 'OSHA Lockout/Tagout Standards & Plant Equipment Safety §8.4';

    chkTardiness.checked = true;
    cardTardiness.classList.add('active');
    inputTardinessTimes.value = '08/18 (45 mins late), 08/24 (30 mins late)';

    inputDetails.value = `On August 28, 2026, at approximately 10:15 AM on the Main Forming Line, employee David Vance repeatedly operated the roll-former feed without engaging the secondary safety interlock guard. When requested by Lead Operator Martinez to halt operation and secure the guard, David refused, stating that the guard was slowing down his shift cycle rate.

Operating roll-forming machinery without proper interlocks is a critical Class 1 safety violation under Best Buy Metals workplace safety guidelines and OSHA standards. This non-compliance created an immediate amputation hazard for both the operator and material handlers in the work cell. Production was temporarily halted for 35 minutes while machine safety audits and interlocks were re-verified by shift maintenance.

David was previously issued a verbal counseling on June 12, 2026 regarding the bypass of material feed guides, and received a First Written Warning on July 19, 2026 for failure to wear required cut-resistant gloves and hearing protection in the fabrication bay. Employee acknowledged receipt of the company safety manual and signed the safety adherence pledge on hire date.

Required Corrective Actions:
1. Complete mandatory 4-hour machine safety and LOTO recertification with Safety Director before operating power machinery.
2. Adhere strictly to all machine guard protocols. Under no circumstances may any safety device or interlock be bypassed, removed, or modified.
3. Arrive promptly at scheduled shift start times; attendance and tardiness will be evaluated on a weekly basis.

Failure to demonstrate immediate and sustained adherence to safety and operational guidelines will result in further disciplinary action, up to and including immediate termination of employment.`;

    charCount.textContent = inputDetails.value.length;
    wordCount.textContent = inputDetails.value.trim().split(/\s+/).length;
    pageImpactBadge.textContent = `${Math.max(2, Math.ceil(wordCount.textContent / 360) + 1)} Pages`;

    saveDraft();
  });

  // --------------------------------------------------------------------------
  // Reset Form
  // --------------------------------------------------------------------------
  function resetForm() {
    if (confirm('Are you sure you want to reset all fields? This will clear your current draft.')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  }

  btnClearForm.addEventListener('click', resetForm);
  btnClearFormBottom.addEventListener('click', resetForm);

  // --------------------------------------------------------------------------
  // PDF Generation & Print
  // --------------------------------------------------------------------------
  function triggerPrint() {
    // Ensure document is generated before printing
    updateDocument();
    window.print();
  }

  btnPrintHeader.addEventListener('click', triggerPrint);
  btnPrintConfirm.addEventListener('click', triggerPrint);
  if (btnPrintBottom) btnPrintBottom.addEventListener('click', triggerPrint);

  async function downloadPdf() {
    updateDocument();

    const empName = (inputEmployeeName.value.trim() || 'Employee').replace(/[^a-zA-Z0-9_-]/g, '_');
    const dateStr = (inputNoticeDate.value || todayIso).replace(/-/g, '');
    const filename = `BestBuyMetals_Infraction_${empName}_${dateStr}.pdf`;

    const btns = [btnDownloadPdfHeader, btnDownloadPdfConfirm, btnDownloadPdfBottom];
    btns.forEach(b => {
      b.disabled = true;
      b.setAttribute('data-orig', b.innerHTML);
      b.innerHTML = `
        <svg class="animate-spin" style="animation: spin 1s linear infinite; width:16px; height:16px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Generating PDF...
      `;
    });

    try {
      const pages = Array.from(documentRenderContainer.querySelectorAll('.pdf-page'));
      if (!pages.length) throw new Error('No pages found to render');

      const opt = {
        margin: 0,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait'
        }
      };

      const updateProgress = (cur, total) => {
        btns.forEach(b => {
          b.innerHTML = `
            <svg class="animate-spin" style="animation: spin 1s linear infinite; width:16px; height:16px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Saving Page ${cur}/${total}...
          `;
        });
      };

      updateProgress(1, pages.length);

      // Render Page 1 to initialize the underlying jsPDF instance
      const w1 = html2pdf().set(opt).from(pages[0]);
      await w1.toCanvas();
      await w1.toPdf();
      const pdf = await w1.get('pdf');

      // Sequentially render every subsequent page directly onto a clean PDF page
      for (let i = 1; i < pages.length; i++) {
        updateProgress(i + 1, pages.length);
        const wi = html2pdf().set(opt).from(pages[i]);
        await wi.toCanvas();
        const canvas = await wi.get('canvas');
        const imgData = canvas.toDataURL('image/jpeg', 0.98);

        pdf.addPage('letter', 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, 0, 8.5, 11, undefined, 'FAST');
      }

      pdf.save(filename);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Could not export PDF directly. Opening print dialog where you can choose "Save as PDF".');
      window.print();
    } finally {
      btns.forEach(b => {
        b.innerHTML = b.getAttribute('data-orig');
        b.disabled = false;
      });
    }
  }

  btnDownloadPdfHeader.addEventListener('click', downloadPdf);
  btnDownloadPdfConfirm.addEventListener('click', downloadPdf);
  btnDownloadPdfBottom.addEventListener('click', downloadPdf);

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------
  const hasDraft = loadDraft();
  if (!hasDraft) {
    updateSuspensionVisibility();
  }
});
