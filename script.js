'use strict';


// Data
const account1 = {
  owner: 'Ariel Cohen',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Yarden Furman',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Roni Gofshtein',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Eti Cohen',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements

  movs.forEach(function (mov, i) {

    const type = mov > 0 ? "deposit" : "withdrawal"

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1}. ${type}</div>
        <div class="movements__value">${mov}₪</div>
   </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin',
      html)
  })
}

const calcDisplayedBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = `${acc.balance} ₪`
}

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${incomes}₪`

  const outcomes = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = `${Math.abs(outcomes)}₪`

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100)
    .filter(int => {
      return int >= 1
    })
    .reduce((acc, int) => acc + int, 0)
  labelSumInterest.textContent = `${interest}₪`
}


const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(" ").map(n => n[0]).join("");

  })
}
createUsernames(accounts);

const updateUI = function (acc) {

  displayMovements(acc.movements) // display current user's movements

  calcDisplayedBalance(acc) // display current user's balance

  calcDisplaySummary(acc) // display current user's summary
}

let currentAcount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAcount = accounts.find(acc => acc.username === inputLoginUsername.value)
  if (currentAcount && currentAcount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back ${currentAcount.owner}`
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur();

    updateUI(currentAcount)
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)

  inputTransferAmount.value = inputTransferTo.value = ''

  if (amount > 0 &&
    receiverAcc &&
    currentAcount.balance >= amount &&
    receiverAcc.username !== currentAcount.username) {

    currentAcount.movements.push(-amount)
    receiverAcc.movements.push(amount)

    updateUI(currentAcount)
  }
})

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value)

  if (amount > 0 && currentAcount.movements.some(mov => mov >= amount * 0.1)) {
    currentAcount.movements.push(amount)

    updateUI(currentAcount)
  }

  inputLoanAmount.value = ''
})

btnClose.addEventListener('click', e => {
  e.preventDefault()

  if (inputCloseUsername.value === currentAcount.username && Number(inputClosePin.value) === currentAcount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAcount.username)

    if (confirm("Are You Sure You Want Delete This Account ?")) {
      accounts.splice(index, 1)
      containerApp.style.opacity = 0
      labelWelcome.textContent = 'Log in to get started'
    } else {
      return
    }
    inputCloseUsername.value = inputClosePin.value = ''
  }
})

let sorted = false
btnSort.addEventListener('click', e => {
  e.preventDefault()

  displayMovements(currentAcount.movements, !sorted)
  sorted = !sorted
})

// TODO : info modal, toasts, localSession, responsive