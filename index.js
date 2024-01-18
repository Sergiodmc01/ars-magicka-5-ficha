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
  const rawData = collectInputState();
  const isEmpty = Object.keys(rawData).length == 0;
  const encodedData = isEmpty ? '' : btoa(JSON.stringify(rawData));

  const newUrl = new URL(window.location.href); 
  const newUrlParams = new URLSearchParams(window.location.search);
  newUrlParams.set('state', encodedData);
  newUrl.search = newUrlParams;
  window.history.pushState(rawData, undefined, newUrl);
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

// utils ================

function getInputVal(el) {
  return !isCheckbox(el) ? el.value : el.checked;
}

function isCheckbox(el){
  return el.type && el.type === 'checkbox'
}