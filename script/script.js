const generateId = () => `ID${Math.round(Math.random() * 1e8).toString(16)}`;

//------------------------------------------------------------------------------

const totalBalance       = document.querySelector('.total__balance'),
      totalMoneyIncome   = document.querySelector('.total__money-income'),
      totalMoneyExpenses = document.querySelector('.total__money-expenses'),
      historyList        = document.querySelector('.history__list'),
      form               = document.querySelector('#form'),
      operationName      = document.querySelector('.operation__name'),
      operationAmount    = document.querySelector('.operation__amount');

//------------------------------------------------------------------------------

let dbOperation = JSON.parse(localStorage.getItem('calc')) || [];

//------------------------------------------------------------------------------

const renderOperation = operation => {
  const className = operation.amount < 0
                    ? 'history__item-minus'
                    : 'history__item-plus';

  const listItem = document.createElement('li');

  listItem.classList.add('history__item');
  listItem.classList.add(className);

  listItem.innerHTML = `
    ${operation.description}
    <span class="history__money">${operation.amount} ₽</span>
    <button class="history_delete" data-id='${operation.id}'>x</button>
  `;

  historyList.append(listItem)
}

const updateBalance = () => {
  const resultIncome = dbOperation
                        .filter(item => item.amount > 0)
                        .reduce((result, item) => result + +item.amount, 0);
  const resultExpenses = dbOperation
                        .filter(item => item.amount < 0)
                        .reduce((result, item) => result + +item.amount, 0);

  totalMoneyIncome.textContent = resultIncome;
  totalMoneyExpenses.textContent = resultExpenses;
  totalBalance.textContent = resultIncome + resultExpenses + ' ₽';
}

const addOperation = e => {
  e.preventDefault();

  operationName.style.borderColor = '';
  operationAmount.style.borderColor = '';

  if(operationName.value !== '' && operationAmount.value !== ''){
    dbOperation.push({
      id: generateId(),
      description: operationName.value,
      amount: operationAmount.value,
    })
  } else {
    if(!operationName.value) operationName.style.borderColor = 'red';
    if(!operationAmount.value) operationAmount.style.borderColor = 'red';
  }

  operationName.value = '';
  operationAmount.value = '';

  init();
}

const deleteOperation = e => {
  if(e.target.classList.contains('history_delete')){
    dbOperation = dbOperation.filter(item => item.id !== e.target.dataset.id)
  }

  init();
}

const init = () => {
  historyList.textContent = '';
  dbOperation.map(item => renderOperation(item));
  updateBalance();
  localStorage.setItem('calc', JSON.stringify(dbOperation))
}

//------------------------------------------------------------------------------

form.addEventListener('submit', addOperation);
historyList.addEventListener('click', deleteOperation)

//------------------------------------------------------------------------------

init();
