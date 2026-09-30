/**
 * Best Buy Metals - Documentation of Conversation
 * Two-Screen Workflow (Form Entry -> Confirmation & Document Review)
 * Dynamic Multi-Page Engine & PDF Generation
 * Rev 07/2026
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Screen Elements & Header Navigation
  // --------------------------------------------------------------------------
  const screenForm = document.getElementById('screenForm');
  const screenConfirmation = document.getElementById('screenConfirmation');
  const formHeaderActions = document.getElementById('formHeaderActions');
  const confirmHeaderActions = document.getElementById('confirmHeaderActions');

  const btnGoToConfirmHeader = document.getElementById('btnGoToConfirmHeader');
  const btnReviewForm = document.getElementById('btnReviewForm');

  const btnBackToEditHeader = document.getElementById('btnBackToEditHeader');
  const btnBackToEdit = document.getElementById('btnBackToEdit');
  const btnBackToEditBottom = document.getElementById('btnBackToEditBottom');

  // Confirmation Meta Chips
  const confirmEmpName = document.getElementById('confirmEmpName');
  const confirmDate = document.getElementById('confirmDate');
  const confirmPageCount = document.getElementById('confirmPageCount');

  // --------------------------------------------------------------------------
  // Form Inputs
  // --------------------------------------------------------------------------
  const inputEmployeeName = document.getElementById('inputEmployeeName');
  const inputNoticeDate = document.getElementById('inputNoticeDate');

  // Nature of Infraction Checkboxes & Details Cards
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

  // Manager Information
  const inputManagerName = document.getElementById('inputManagerName');
  const inputManagerDate = document.getElementById('inputManagerDate');

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
  if (!inputManagerDate.value) inputManagerDate.value = todayIso;

  function setupDetailCard(chk, card, input) {
    chk.addEventListener('change', () => {
      if (chk.checked) {
        card.classList.add('active');
        input.focus();
      } else {
        card.classList.remove('active');
      }
      saveDraft();
      updateCounters();
    });
  }

  setupDetailCard(chkPolicy, cardPolicy, inputPolicyName);
  setupDetailCard(chkAbsenteeism, cardAbsenteeism, inputAbsenteeismDates);
  setupDetailCard(chkTardiness, cardTardiness, inputTardinessTimes);
  setupDetailCard(chkOther, cardOther, inputOtherDesc);

  chkItems.forEach(item => {
    item.addEventListener('change', () => {
      saveDraft();
      updateCounters();
    });
  });

  // --------------------------------------------------------------------------
  // Live Counters & Impact Estimation
  // --------------------------------------------------------------------------
  function updateCounters() {
    const text = inputDetails.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    charCount.textContent = chars.toLocaleString();
    wordCount.textContent = words.toLocaleString();

    // Standard letter page fits ~420 words of details with header and signatures
    let estPages = 2;
    if (words > 400) {
      estPages = 2 + Math.ceil((words - 400) / 480);
    }
    pageImpactBadge.textContent = `${estPages} Pages`;
  }

  inputDetails.addEventListener('input', () => {
    updateCounters();
    saveDraft();
  });

  inputEmployeeName.addEventListener('input', saveDraft);
  inputNoticeDate.addEventListener('input', saveDraft);
  inputPolicyName.addEventListener('input', saveDraft);
  inputAbsenteeismDates.addEventListener('input', saveDraft);
  inputTardinessTimes.addEventListener('input', saveDraft);
  inputOtherDesc.addEventListener('input', saveDraft);
  inputManagerName.addEventListener('input', saveDraft);
  inputManagerDate.addEventListener('input', saveDraft);

  // --------------------------------------------------------------------------
  // Screen Switching Logic
  // --------------------------------------------------------------------------
  function showFormScreen() {
    screenForm.classList.remove('hidden');
    screenConfirmation.classList.add('hidden');
    formHeaderActions.style.display = 'flex';
    confirmHeaderActions.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showConfirmationScreen() {
    const empName = inputEmployeeName.value.trim();
    if (!empName) {
      alert('Please enter the Employee Name before reviewing.');
      inputEmployeeName.focus();
      return;
    }

    screenForm.classList.add('hidden');
    screenConfirmation.classList.remove('hidden');
    formHeaderActions.style.display = 'none';
    confirmHeaderActions.style.display = 'flex';

    // Update confirmation summary chips
    confirmEmpName.textContent = `Employee: ${empName}`;
    confirmDate.textContent = `Date: ${formatDate(inputNoticeDate.value)}`;

    // Build the rendered document pages
    updateDocument();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  btnGoToConfirmHeader.addEventListener('click', showConfirmationScreen);
  btnReviewForm.addEventListener('click', showConfirmationScreen);

  btnBackToEditHeader.addEventListener('click', showFormScreen);
  btnBackToEdit.addEventListener('click', showFormScreen);
  btnBackToEditBottom.addEventListener('click', showFormScreen);

  // --------------------------------------------------------------------------
  // LocalStorage Autosave
  // --------------------------------------------------------------------------
  const STORAGE_KEY = 'bbm_documentation_conversation_draft_v1';

  function saveDraft() {
    const data = {
      empName: inputEmployeeName.value,
      noticeDate: inputNoticeDate.value,
      chkPoorPerformance: document.getElementById('chkPoorPerformance').checked,
      chkRefusalOvertime: document.getElementById('chkRefusalOvertime').checked,
      chkAbuseLeave: document.getElementById('chkAbuseLeave').checked,
      chkSubstanceAbuse: document.getElementById('chkSubstanceAbuse').checked,
      chkInsubordination: document.getElementById('chkInsubordination').checked,
      chkMisuseProperty: document.getElementById('chkMisuseProperty').checked,
      chkImproperConduct: document.getElementById('chkImproperConduct').checked,
      chkPropertyDamage: document.getElementById('chkPropertyDamage').checked,
      chkSafetyViolation: document.getElementById('chkSafetyViolation').checked,
      chkPolicy: chkPolicy.checked,
      policyName: inputPolicyName.value,
      chkAbsenteeism: chkAbsenteeism.checked,
      absenteeismDates: inputAbsenteeismDates.value,
      chkTardiness: chkTardiness.checked,
      tardinessTimes: inputTardinessTimes.value,
      chkOther: chkOther.checked,
      otherDesc: inputOtherDesc.value,
      details: inputDetails.value,
      managerName: inputManagerName.value,
      managerDate: inputManagerDate.value
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    showSavedPulse();
  }

  function loadDraft() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      if (data.empName) inputEmployeeName.value = data.empName;
      if (data.noticeDate) inputNoticeDate.value = data.noticeDate;

      if (data.chkPoorPerformance) document.getElementById('chkPoorPerformance').checked = true;
      if (data.chkRefusalOvertime) document.getElementById('chkRefusalOvertime').checked = true;
      if (data.chkAbuseLeave) document.getElementById('chkAbuseLeave').checked = true;
      if (data.chkSubstanceAbuse) document.getElementById('chkSubstanceAbuse').checked = true;
      if (data.chkInsubordination) document.getElementById('chkInsubordination').checked = true;
      if (data.chkMisuseProperty) document.getElementById('chkMisuseProperty').checked = true;
      if (data.chkImproperConduct) document.getElementById('chkImproperConduct').checked = true;
      if (data.chkPropertyDamage) document.getElementById('chkPropertyDamage').checked = true;
      if (data.chkSafetyViolation) document.getElementById('chkSafetyViolation').checked = true;

      if (data.chkPolicy) {
        chkPolicy.checked = true;
        cardPolicy.classList.add('active');
        inputPolicyName.value = data.policyName || '';
      }
      if (data.chkAbsenteeism) {
        chkAbsenteeism.checked = true;
        cardAbsenteeism.classList.add('active');
        inputAbsenteeismDates.value = data.absenteeismDates || '';
      }
      if (data.chkTardiness) {
        chkTardiness.checked = true;
        cardTardiness.classList.add('active');
        inputTardinessTimes.value = data.tardinessTimes || '';
      }
      if (data.chkOther) {
        chkOther.checked = true;
        cardOther.classList.add('active');
        inputOtherDesc.value = data.otherDesc || '';
      }

      if (data.details) inputDetails.value = data.details;
      if (data.managerName) inputManagerName.value = data.managerName;
      if (data.managerDate) inputManagerDate.value = data.managerDate;

      updateCounters();
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
  }

  function showSavedPulse() {
    saveIndicator.classList.add('saving');
    setTimeout(() => {
      saveIndicator.classList.remove('saving');
    }, 700);
  }

  // --------------------------------------------------------------------------
  // Sample Data & Clear Actions
  // --------------------------------------------------------------------------
  btnSampleData.addEventListener('click', () => {
    inputEmployeeName.value = 'Marcus Vance';
    inputNoticeDate.value = todayIso;

    document.getElementById('chkPoorPerformance').checked = false;
    document.getElementById('chkRefusalOvertime').checked = false;
    document.getElementById('chkAbuseLeave').checked = false;
    document.getElementById('chkSubstanceAbuse').checked = false;
    document.getElementById('chkInsubordination').checked = false;
    document.getElementById('chkMisuseProperty').checked = false;
    document.getElementById('chkImproperConduct').checked = false;
    document.getElementById('chkPropertyDamage').checked = false;
    document.getElementById('chkSafetyViolation').checked = true;

    chkPolicy.checked = true;
    cardPolicy.classList.add('active');
    inputPolicyName.value = 'Warehouse Safety Standard §4.1 (Mandatory Steel-Toe & Hi-Vis)';

    chkAbsenteeism.checked = false;
    cardAbsenteeism.classList.remove('active');
    inputAbsenteeismDates.value = '';

    chkTardiness.checked = true;
    cardTardiness.classList.add('active');
    inputTardinessTimes.value = '09/22 at 7:35 AM (+35m), 09/28 at 7:42 AM (+42m)';

    chkOther.checked = false;
    cardOther.classList.remove('active');
    inputOtherDesc.value = '';

    inputDetails.value =
`A formal conversation was conducted on ${formatDate(todayIso)} with Marcus Vance regarding recurring safety protocol adherence and unexcused arrival delays at the Chattanooga Production Facility.

1. Chronology of Incidents:
- On 09/22/2026, Marcus arrived at the shift meeting 35 minutes after scheduled start time without notifying his direct supervisor in advance.
- During roll forming operations on 09/24/2026, Marcus was observed on the coil staging dock without wearing high-visibility safety vest and mandatory eye protection while a 10,000 lb master coil was actively being rigged for hoist.
- On 09/28/2026, Marcus arrived 42 minutes late, resulting in roll-former line 2 being unable to initiate production on time.

2. Discussion & Employee Response:
Marcus acknowledged the incidents and stated he has had transportation difficulties in the mornings. He recognized the safety hazard on the dock and understood that all personal protective equipment (PPE) must be fully donned prior to entering designated staging zones.

3. Expectations & Corrective Action:
Marcus is expected to arrive promptly at his designated shift start time (7:00 AM EST). In the event of an unavoidable emergency, he must contact dispatch or his shift supervisor at least 30 minutes prior to shift commencement. Furthermore, strict adherence to all OSHA and Best Buy Metals PPE guidelines is mandatory. Failure to maintain these standards will result in progressive disciplinary action up to and including termination.`;

    inputManagerName.value = 'Gregory Patterson, Production Supervisor';
    inputManagerDate.value = todayIso;

    saveDraft();
    updateCounters();
  });

  function clearAllFields() {
    if (!confirm('Are you sure you want to clear all form fields?')) return;
    localStorage.removeItem(STORAGE_KEY);

    inputEmployeeName.value = '';
    inputNoticeDate.value = todayIso;

    chkItems.forEach(i => i.checked = false);
    [chkPolicy, chkAbsenteeism, chkTardiness, chkOther].forEach(c => {
      c.checked = false;
    });
    [cardPolicy, cardAbsenteeism, cardTardiness, cardOther].forEach(card => {
      card.classList.remove('active');
    });

    inputPolicyName.value = '';
    inputAbsenteeismDates.value = '';
    inputTardinessTimes.value = '';
    inputOtherDesc.value = '';

    inputDetails.value = '';
    inputManagerName.value = '';
    inputManagerDate.value = todayIso;

    updateCounters();
    documentRenderContainer.innerHTML = '';
  }

  btnClearForm.addEventListener('click', clearAllFields);
  btnClearFormBottom.addEventListener('click', clearAllFields);

  // --------------------------------------------------------------------------
  // Document Header & Footer Generators
  // --------------------------------------------------------------------------
  function createDocHeader(isContinuation = false) {
    const header = document.createElement('div');
    header.className = 'doc-header';
    header.innerHTML = `
      <img src="assets/logo.png" alt="Best Buy Metals" class="doc-logo-img">
      <div class="doc-title">DOCUMENTATION OF CONVERSATION${isContinuation ? ' (Continued)' : ''}</div>
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

  // --------------------------------------------------------------------------
  // PAGE 1 RENDERER
  // --------------------------------------------------------------------------
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
      <!-- Employee Name and Date -->
      <div class="doc-field-line" style="margin-bottom: 0.26in;">
        <span class="doc-field-label">Employee Name: </span>
        <span class="doc-field-fill" style="flex: 2.8; margin-right: 0.4in;">${empName || '&nbsp;'}</span>
        <span class="doc-field-label">Date: </span>
        <span class="doc-field-fill" style="flex: 1.2;">${noticeDate || '&nbsp;'}</span>
      </div>

      <!-- Official Conversation Policy Text -->
      <div class="doc-notice-text">
        <p>A conversation was held with the employee regarding the issue(s) outlined below.</p>
        <p>The expectation is that the employee will address and resolve this matter by enhancing their job performance and/or refraining from the conduct or omission that prompted this Documentation of Conversation.</p>
        <p>Continued failure to make the necessary improvements may result in further disciplinary action, up to and including termination.</p>
      </div>

      <!-- Nature of Infraction Section -->
      <div class="doc-nature-section" style="margin-top: 0.28in;">
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

        <!-- Detail Lines with Checkbox & Underline Matching Original Form -->
        <div class="doc-detail-entry" style="margin-top: 0.2in;">
          <div class="doc-detail-entry-header">
            <span class="doc-box ${chkPolicy.checked ? 'checked' : ''}"></span>
            <span>Failure to comply with company policy</span>
            <span class="helper-text">(Name of Policy)</span>
          </div>
          <div class="doc-writein-line">${inputPolicyName.value.trim() || '&nbsp;'}</div>
        </div>

        <div class="doc-detail-entry" style="margin-top: 0.28in;">
          <div class="doc-detail-entry-header">
            <span class="doc-box ${chkAbsenteeism.checked ? 'checked' : ''}"></span>
            <span>Absenteeism</span>
            <span class="helper-text">(List all applicable dates of absenteeism)</span>
          </div>
          <div class="doc-writein-line">${inputAbsenteeismDates.value.trim() || '&nbsp;'}</div>
        </div>

        <div class="doc-detail-entry" style="margin-top: 0.28in;">
          <div class="doc-detail-entry-header">
            <span class="doc-box ${chkTardiness.checked ? 'checked' : ''}"></span>
            <span>Tardiness</span>
            <span class="helper-text">(List all applicable dates & tardiness times)</span>
          </div>
          <div class="doc-writein-line">${inputTardinessTimes.value.trim() || '&nbsp;'}</div>
        </div>

        <div class="doc-detail-entry" style="margin-top: 0.28in;">
          <div class="doc-detail-entry-header">
            <span class="doc-box ${chkOther.checked ? 'checked' : ''}"></span>
            <span>Other</span>
          </div>
          <div class="doc-writein-line">${inputOtherDesc.value.trim() || '&nbsp;'}</div>
        </div>
      </div>
    `;

    page.appendChild(content);
    page.appendChild(createDocFooter(1, 2));
    return page;
  }

  // --------------------------------------------------------------------------
  // SIGNATURE BLOCK (Manager Only - As per Official Conversation Template)
  // --------------------------------------------------------------------------
  function createSignatureBlock() {
    const block = document.createElement('div');
    block.className = 'doc-signatures-block';

    const mgrName = inputManagerName.value.trim();
    const mgrDate = formatDate(inputManagerDate.value);

    block.innerHTML = `
      <!-- Manager Printed Name -->
      <div style="margin-bottom: 0.28in; width: 55%;">
        <div style="min-height: 22px; font-weight: 500; font-size: 11pt; color: #1e293b; padding-bottom: 2px;">
          ${mgrName || '&nbsp;'}
        </div>
        <div class="doc-sig-underline"></div>
        <div class="doc-sig-label">Manager/Direct Report Printed Name</div>
      </div>

      <!-- Manager Signature & Date -->
      <div class="doc-signature-row" style="margin-bottom: 0;">
        <div class="doc-sig-col" style="flex: 1.8;">
          <div class="doc-sig-image-area"></div>
          <div class="doc-sig-underline"></div>
          <div class="doc-sig-label">Manager/Direct Report Signature</div>
        </div>
        <div class="doc-sig-col" style="flex: 1;">
          <div style="min-height: 38px; display: flex; align-items: flex-end; font-weight: 500; font-size: 11pt; color: #1e293b; padding-bottom: 2px;">
            ${mgrDate || '&nbsp;'}
          </div>
          <div class="doc-sig-underline"></div>
          <div class="doc-sig-label">Date <span style="font-weight: 400; font-size: 8.5pt;">(MM/DD/YYYY)</span></div>
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

  // --------------------------------------------------------------------------
  // Main Document Builder - Infinite Dynamic Multi-Page Engine
  // --------------------------------------------------------------------------
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

      // Support manual page breaks ('---', '[pagebreak]', '***')
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

    // Now place the signatures block on the final page
    const sigBlock = createSignatureBlock();
    current.detailsContainer.appendChild(sigBlock);

    // If adding signatures causes overflow, move signatures to a fresh continuation page
    if (current.page.scrollHeight > current.page.clientHeight + 1) {
      current.detailsContainer.removeChild(sigBlock);
      pageNum++;
      current = createDetailsPage(pageNum);
      current.detailsContainer.appendChild(sigBlock);
      documentRenderContainer.appendChild(current.page);
      pages.push(current.page);
    }

    // Update footers across all generated pages with exact total page count
    const totalPages = pages.length;
    pages.forEach((pg, idx) => {
      const footerCount = pg.querySelector('.doc-page-count');
      if (footerCount) {
        footerCount.textContent = `Page ${idx + 1} of ${totalPages}`;
      }
    });

    confirmPageCount.textContent = `${totalPages} Pages Generated`;
    totalPagesBadge.textContent = `${totalPages} Pages`;
  }

  // --------------------------------------------------------------------------
  // Zoom Controls
  // --------------------------------------------------------------------------
  let currentZoom = 0.85;

  function applyZoom(val) {
    currentZoom = Math.min(1.4, Math.max(0.4, val));
    documentRenderContainer.style.transform = `scale(${currentZoom})`;
    zoomLevelDisplay.textContent = `${Math.round(currentZoom * 100)}%`;
  }

  btnZoomIn.addEventListener('click', () => applyZoom(currentZoom + 0.1));
  btnZoomOut.addEventListener('click', () => applyZoom(currentZoom - 0.1));
  btnZoomFit.addEventListener('click', () => applyZoom(0.85));

  // --------------------------------------------------------------------------
  // Density Selector
  // --------------------------------------------------------------------------
  const densityBtns = document.querySelectorAll('.density-btn');
  densityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      densityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const size = btn.getAttribute('data-size');
      const line = btn.getAttribute('data-line');

      document.documentElement.style.setProperty('--doc-font-size', size);
      document.documentElement.style.setProperty('--doc-line-height', line);

      updateDocument();
    });
  });

  // --------------------------------------------------------------------------
  // Print & PDF Download Handlers
  // --------------------------------------------------------------------------
  function triggerPrint() {
    window.print();
  }

  btnPrintHeader.addEventListener('click', triggerPrint);
  btnPrintConfirm.addEventListener('click', triggerPrint);
  btnPrintBottom.addEventListener('click', triggerPrint);

  async function downloadPdf() {
    const originalTransform = documentRenderContainer.style.transform;
    documentRenderContainer.style.transform = 'none';

    bottomBarDocStatus.textContent = 'Generating PDF...';

    const empName = inputEmployeeName.value.trim() || 'Employee';
    const cleanName = empName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const noticeDate = inputNoticeDate.value || todayIso;
    const filename = `Documentation_of_Conversation_${cleanName}_${noticeDate}.pdf`;

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
      }
    };

    try {
      if (window.html2pdf) {
        await html2pdf().set(opt).from(documentRenderContainer).save();
      } else {
        window.print();
      }
      bottomBarDocStatus.textContent = 'PDF Generated Successfully';
    } catch (e) {
      console.error('PDF export failed:', e);
      alert('PDF generation error. Opening system print dialog as fallback...');
      window.print();
      bottomBarDocStatus.textContent = 'Ready';
    } finally {
      documentRenderContainer.style.transform = originalTransform;
      setTimeout(() => {
        bottomBarDocStatus.textContent = 'Document Ready';
      }, 3000);
    }
  }

  btnDownloadPdfHeader.addEventListener('click', downloadPdf);
  btnDownloadPdfConfirm.addEventListener('click', downloadPdf);
  btnDownloadPdfBottom.addEventListener('click', downloadPdf);

  // --------------------------------------------------------------------------
  // Helper: Format Date as MM/DD/YYYY
  // --------------------------------------------------------------------------
  function formatDate(isoStr) {
    if (!isoStr) return '';
    const parts = isoStr.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
    return isoStr;
  }

  // Initialize draft on boot
  loadDraft();
  applyZoom(0.85);
});
