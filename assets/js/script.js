/**
 * TAREA:
 * Hacer que el botón de X en los productos que tienen stack, solo reste 1 en lugar de borrarlos todos.
 * Hacer que solo aparezcan en el menú los últimos 3 elementos
 * Hacer que a pesar de la limitación anterior, los valores del array de objetos deben sumarse de forma íntegra
 * Arreglar la limitación existente en los botones que traen íconos dentro: Que el mismo codigo funciona para cualquiera de ambos sin necesidad de un else if
 */

//Declaraciones
const cart = document.querySelector('#carrito')
const cartContainer = document.querySelector('#lista-carrito tbody')
const priceCalculusContainer = document.querySelector('#lista-carrito2 tbody')
const courseList = document.querySelector('#lista-cursos')
const dumpCart = document.querySelector('#vaciar-carrito')

const cartCounter = document.querySelector('#counter-cart')

let cartArticles = []

//EventLoader
regEventListener()

function regEventListener(){
    courseList.addEventListener('click', addCourse)
    cart.addEventListener('click', deleteCourse)
    dumpCart.addEventListener('click', () => {
        cartArticles = []
        cleanHTML()
    })
}

//Funciones
function addCourse(event){
    event.preventDefault()
    //console.log(event)
    if(event.target.classList.contains('btn','agregar-carrito')){
        const selectedCourse = event.target.parentElement.parentElement
        readCourseData(selectedCourse)
    }else if(event.target.parentElement.classList.contains('btn', 'agregar-carrito')){
        const selectedCourse = event.target.parentElement.parentElement.parentElement
        readCourseData(selectedCourse)
    }
}

//Step 1. Obtain the data: Ready
//Step 2. Read the data!!
//Step 3. Write the data!

function readCourseData(course){
    const courseInfo ={
        image: course.parentElement.querySelector('img').src,
        title: course.querySelector('h2').textContent,
        price: parseFloat(course.querySelector('.precios div h4').textContent.replace(/\D/g, '')),
        id: parseInt(course.parentElement.getAttribute('id').split('-')[1]),
        quantity: 1
    }

    const exists = cartArticles.some( course => course.id === courseInfo.id)

    if(exists){
        const courses = cartArticles.map((course) =>{
            if(course.id === courseInfo.id){
                course.quantity++
                return course
            }else{
                return course
            }
        })
        cartArticles = [...courses]
    }else{
        cartArticles = [...cartArticles, courseInfo]
    }
    
    counterCart()
    // console.table(courseInfo)
    console.table(cartArticles)
    htmlCart()
}

//Set 4. The objects array works. Now we have to write it in the HTML

function htmlCart(){
    cleanHTML()
    

    let subtotalPrice = 0
    
    //Calculo actulizado de los precios
    cartArticles.forEach(course =>{
        subtotalPrice += course.price * course.quantity
    })
    let shippingPrice = subtotalPrice === 0 ? 0 : subtotalPrice < 100000 ? 4000 : 0
    
    //Actualizacion correcta dentro del bucle de los articulos
    
    cartArticles.forEach((course) =>{
        const { image, title, price, id, quantity } = course
        const row = document.createElement('tr')
        
        row.innerHTML = `
            <td><img src="${image}" alt="${title}"></td>
            <td class="info-table-container" colspan="2">
                <div>${phraseSlicer(title)}</div>
                <div>
                    <span class="cantidad">${quantity} x</span>
                    <span class="precio">$${price.toLocaleString('es-ES')}</span>
                </div>
            </td>
            <td colspan="2" class="text-center"><a href="#" class="delete-button" data-id="${id}"><i class="fa-solid fa-xmark"></i></a></td>
        `
        cartContainer.appendChild(row)

    })

    let totalPrice = subtotalPrice > 0 ? subtotalPrice + shippingPrice : 0 
    const rowSubTotal = document.createElement('tr')
    const rowShipping = document.createElement('tr')
    const rowTotal = document.createElement('tr')

    rowSubTotal.className = "text-end detalles-border"
    rowShipping.className = "text-end detalles-border"
    rowTotal.className = "text-end detalles-border"

    rowSubTotal.innerHTML = `
        <td class="detalles">Subtotal: </td>
        <td class="detalles">&#160;</td>
        <td class="detalles thevalue">$${subtotalPrice.toLocaleString('es-ES')}</td>
    `

    rowShipping.innerHTML = `
        <td class="detalles">Envío: </td>
        <td class="detalles">&#160;</td>
        <td class="detalles thevalue">${shippingPrice === 4000 ? "$" + shippingPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "¡GRATIS!"}</td>
    `

    rowTotal.innerHTML = `
        <td class="detalles">Total: </td>
        <td class="detalles">&#160;</td>
        <td class="detalles thevalue">$${totalPrice.toLocaleString('es-ES')}</td>
    `
    priceCalculusContainer.appendChild(rowSubTotal)
    priceCalculusContainer.appendChild(rowShipping)
    priceCalculusContainer.appendChild(rowTotal)

    console.log(subtotalPrice)
    console.log(subtotalPrice < 100000 ? shippingPrice.toLocaleString('es-ES') : shippingPrice = 0)
}

function cleanHTML(){
    counterCart()
    while(cartContainer.firstChild){
        cartContainer.removeChild(cartContainer.firstChild)
    }
    while(priceCalculusContainer.firstChild){
        priceCalculusContainer.removeChild(priceCalculusContainer.firstChild)
    }
}

function phraseSlicer(inputText){
    if (inputText.length >= 40){
        inputText = `${inputText.slice(0,40)}...`
        return inputText
    }
    else{
        return inputText
    }
}

//Final step. DELETE THE DATA INDIVIDUALLY

function deleteCourse(event){
    if(event.target.classList.contains('delete-button')){
        const courseId = event.target.getAttribute('data-id')
        cartArticles = cartArticles.filter ( course => course.id != courseId )
        htmlCart()
    }else if (event.target.parentElement.classList.contains('delete-button')){
        const courseId = event.target.parentElement.getAttribute('data-id')
        cartArticles = cartArticles.filter ( course => course.id != courseId )
        htmlCart()
    }
}

function counterCart(){
    let cartArticleNumber = 0
    cartArticles.forEach((article)=>{
        const { quantity } = article
        cartArticleNumber = cartArticleNumber + quantity
        
    })
    if(cartArticles.length){
        cartCounter.textContent = cartArticleNumber
        cartCounter.classList.remove('disabler')
    }else{
        cartArticleNumber = 0
        cartCounter.classList.add('disabler')
    }
}