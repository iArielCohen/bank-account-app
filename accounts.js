 'use strict';


 // Data
 const account1 = {
   owner: 'Ariel Cohen',
   movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
   interestRate: 1.2,
   pin: 1111,
   movementsDates: [
     '2021-11-18T21:31:17.178Z',
     '2021-12-23T07:42:02.383Z',
     '2021-01-28T09:15:04.904Z',
     '2021-04-01T10:17:24.185Z',
     '2021-05-08T14:11:59.604Z',
     '2021-05-27T17:01:17.194Z',
     '2021-07-11T23:36:17.929Z',
     '2021-07-12T10:51:36.790Z',
   ],
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

 const displayMovements = function (acc, sort = false) {
   containerMovements.innerHTML = ''

   const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements

   movs.forEach(function (mov, i) {

     const type = mov > 0 ? "deposit" : "withdrawal"

     const date = new Date(acc.movementsDates[i])
     const day = `${date.getDate()}`.padStart(2, 0)
     const month = `${date.getMonth() + 1}`.padStart(2, 0)
     const year = date.getFullYear()
     const displayDate = `${day}/${month}/${year}`

     const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1}. ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}₪</div>
   </div>
    `
     containerMovements.insertAdjacentHTML('afterbegin',
       html)
   })
 }

 const calcDisplayedBalance = function (acc) {
   acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
   labelBalance.textContent = `${acc.balance.toFixed(2)} ₪`
 }

 const calcDisplaySummary = function (acc) {
   const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
   labelSumIn.textContent = `${incomes.toFixed(2)}₪`

   const outcomes = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
   labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}₪`

   const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100)
     .filter(int => {
       return int >= 1
     })
     .reduce((acc, int) => acc + int, 0)
   labelSumInterest.textContent = `${interest.toFixed(2)}₪`
 }


 const createUsernames = function (accs) {
   accs.forEach(function (acc) {
     acc.username = acc.owner.toLowerCase().split(" ").map(n => n[0]).join("");

   })
 }
 createUsernames(accounts);

 const updateUI = function (acc) {

   displayMovements(acc) // display current user's movements

   calcDisplayedBalance(acc) // display current user's balance

   calcDisplaySummary(acc) // display current user's summary
 }

 let currentAccount;

 // Fake Log In
 currentAccount = account1;
 updateUI(currentAccount);
 containerApp.style.opacity = 100;

 // --------------------------------------------

 btnLogin.addEventListener("click", function (e) {
   e.preventDefault();

   currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
   if (currentAccount && currentAccount.pin === +(inputLoginPin.value)) {
     labelWelcome.textContent = `Welcome Back ${currentAccount.owner}`
     containerApp.style.opacity = 100;

     const now = new Date()
     const day = `${now.getDate()}`.padStart(2, 0)
     const month = `${now.getMonth() + 1}`.padStart(2, 0)
     const year = now.getFullYear()
     const hour = `${now.getHours()}`.padStart(2, 0)
     const minute = `${now.getMinutes()}`.padStart(2, 0)
     labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`

     inputLoginUsername.value = inputLoginPin.value = ''
     inputLoginPin.blur();

     updateUI(currentAccount)
   }
 });

 btnTransfer.addEventListener('click', e => {
   e.preventDefault();
   const amount = +(inputTransferAmount.value)
   const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)

   inputTransferAmount.value = inputTransferTo.value = ''

   if (amount > 0 &&
     receiverAcc &&
     currentAccount.balance >= amount &&
     receiverAcc.username !== currentAccount.username) {

     // Doing The Transfer
     currentAccount.movements.push(-amount)
     receiverAcc.movements.push(amount)

     // Add Transfer Dates
     currentAccount.movementsDates.push(new Date().toISOString())
     receiverAcc.movementsDates.push(new Date().toISOString())

     updateUI(currentAccount)
   }
 })

 btnLoan.addEventListener('click', e => {
   e.preventDefault();

   const amount = Math.floor(inputLoanAmount.value)

   if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
     // Add Movement
     currentAccount.movements.push(amount)

     // Add Loans Dates
     currentAccount.movementsDates.push(new Date().toISOString())

     updateUI(currentAccount)
   }

   inputLoanAmount.value = ''
 })

 btnClose.addEventListener('click', e => {
   e.preventDefault()

   if (inputCloseUsername.value === currentAccount.username && +(inputClosePin.value) === currentAccount.pin) {
     const index = accounts.findIndex(acc => acc.username === currentAccount.username)

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

   displayMovements(currentAccount, !sorted)
   sorted = !sorted
 })

 // TODO : info modal, toasts, localSession, responsive