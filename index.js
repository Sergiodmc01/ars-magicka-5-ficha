// setup ================

const inputContainer = document.querySelector('main');
const inputs = inputContainer.querySelectorAll('[id]');

// state loading ================

const currentUrlParams = new URLSearchParams(window.location.search);
const currentRawState = currentUrlParams.get('state');

if (currentRawState) {
  const currentState = JSON.parse(atob(currentRawState));
  loadState(currentState);
}

addEventListener("popstate", (event) => {
  loadState(event.state);
});

function loadState(state) {
  inputs.forEach(input => {
    const inputState = state[input.id];
    if (!isCheckbox(input))
      input.value = inputState ?? null;
    else
      input.checked = inputState ?? false;
  })
}

// state collecting ================

inputs.forEach(input => input?.addEventListener('change', () => {
  const state = collectInputState();
  pushState(state);
}));

function collectInputState() {
  const rawData = [...inputs]
  .reduce(
    (acc, input) => {
      const val = getInputVal(input);
      if (val) acc[input.id] = val; 
      return acc;
    }, {}
    );

  return rawData;
}

// save slots ================

const saveSlotsContainer = document.querySelector('#save-slots');
const saveSlots = saveSlotsContainer.querySelectorAll('[data-save-slot]')
let selectedSlot = null;


saveSlots
.forEach(saveSlot => {
  const saveSlotId = saveSlot.dataset.saveSlot;
  if (!saveSlotId) return;

  const saveButton = saveSlot.querySelector('.save');
  saveButton.addEventListener('click', () => {
    const state = collectInputState();
    alert(`Saving slot ${saveSlotId}`);
    window.localStorage.setItem(saveSlotId, JSON.stringify(state));
  });

  const loadButton = saveSlot.querySelector('.load');
  loadButton.addEventListener('click', () => {
    const saveSlotData = window.localStorage.getItem(saveSlotId);
    if (!saveSlotData) {
      alert(`No save in slot ${saveSlotId}`);
      return;
    }
    alert(`Loading slot ${saveSlotId}`);
    const saveSlotState = JSON.parse(saveSlotData);
    selectSlot(saveSlot);

    loadState(saveSlotState);
    pushState(saveSlotState);
  });

  const deleteButton = saveSlot.querySelector('.delete');
  deleteButton.addEventListener('click', () => {
    alert(`Deleting slot ${saveSlotId}`);
    selectSlot(null);
    window.localStorage.removeItem(saveSlotId);
  });
})

function selectSlot(slot) {
  selectedSlot?.classList.remove('selected');
  selectedSlot = slot;
  selectedSlot.classList.add('selected');

  const saveSlotId = slot.dataset.saveSlot;
  if (saveSlotId == null) return;
}

// utils ================

function pushState(state) {
  const isEmpty = Object.keys(state).length == 0;
  const encodedData = isEmpty ? '' : btoa(JSON.stringify(state));

  const newUrl = new URL(window.location.href); 
  const newUrlParams = new URLSearchParams(window.location.search);
  newUrlParams.set('state', encodedData);
  newUrl.search = newUrlParams;
  window.history.pushState(state, undefined, newUrl);
}

function getInputVal(el) {
  return !isCheckbox(el) ? el.value : el.checked;
}

function isCheckbox(el){
  return el.type && el.type === 'checkbox'
}