const Modal = {
    open(){
        //Abrir modal
        document.querySelector('.modal-overlay').classList.add('active')
        //adicionar a class active ao modal
    },

    close(){
        //fechar o modal
        //remover a class active do modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
 }

const  Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finance:transactions')) || []
    },
    set(transaction){
        localStorage.setItem('dev.finance:transactions', JSON.stringify(transaction))
    }
}

 //Eu preciso somar as entradas
 //Depoiseu preciso somar as saidas e 
 //remover das entradas o valor das saídas
 //assim, eu terei total.

const Transaction = {
     all: Storage.get(),

     add(transaction){

        Transaction.all.push(transaction)
        App.reload()

     },
     
     remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
     },

     incomes(){
        let income = 0;
         // Pegar todas as transações
         // Para cadas transação, 
        Transaction.all.forEach(transaction => {
            //se for maior que zero
            if(transaction.amount > 0){
                // somar a uma variavel e retornar a variavel
                income += transaction.amount;
            } 
         })
         return income;
     },

     expenses(){
         //somar as saidas
         let expense = 0;
         // Pegar todas as transações
         // Para cadas transação, 
         Transaction.all.forEach(transaction => {
            //se for maior que zero
            if(transaction.amount < 0){
                // somar a uma variavel e retornar a variavel
                expense += transaction.amount;
            }
         })
         return expense;
     },

     total(){
         // Entradas - Saídas
         return Transaction.incomes() + Transaction.expenses();
     }
 }


 // Precisamos criar um tr e adicionar os valores dinamicamente
const DOM = {
    transactionsContainer: document.querySelector('#data-table  tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
                <td class="description">${transaction.description}</td> 
                <td class="${CSSclass}">${amount}</td>
                 <td class="date">${transaction.date}</td>
                <td>
                     <img onclick="Transaction.remove(${index}) "src="./assets/minus.svg" alt="Remover transação">
                </td>
        `
        return html
    },

    updateBalance() {
        document.querySelector('#incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.querySelector('#expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.querySelector('#totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransaction() {
        DOM.transactionsContainer.innerHTML = ''
    }
}

const Utils = {
    formatAmount(value){
       value = value * 100

       return Math.round(value)
    },

    formatDate(date){
        const splittedDate = date.split("-")
        console.log(splittedDate)
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        //Verificar o comportamento do [replace]
        //Vamos tirar tudo que não seja numero para poder fazer a divisão por 100
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        // O [toLocaleString] funciona em numeros

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        
        return `${signal} ${value}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },


    validateFields() {
        const { description, amount, date } = Form.getValues()
        
        if( description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "" ) {
                throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues(){
        let { description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event){
       event.preventDefault()

       try{
            //verificar se todas as informações estão preenchidas
            Form.validateFields()
            // formatar os dados parasalvar
            const transaction = Form.formatValues()
            // salvar
            Transaction.add(transaction)
            // apagar os dados do formulario
            Form.clearFields()
            // modal feche
            Modal.close()
            
       } catch (error){
            alert(error.message)
       }
    }
}


const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()
        

        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransaction()
        App.init()
    }
}

App.init()


/*Transaction.add({
    description: 'Alo',
    amount: 200,
    date: '23/01/2021'
})*/

Transaction.remove(0)
