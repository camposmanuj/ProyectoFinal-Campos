fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    const productos = data;

    // Obtener elementos del DOM //
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const checkoutButton = document.querySelector('.checkout');
    const clearCartButton = document.querySelector('.clear-cart');
    const messageContainer = document.getElementById('message-container');
    const contactFormContainer = document.querySelector('.contact-form-container');



    // Inicializar el carrito como un array vacío //
    let cart = [];

    // Funcion para guardar el carrito en local storage //
    function updateLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      cart = JSON.parse(storedCart);
      updateCartDisplay();
    }

    // Función para agregar un producto al carrito o aumentar la cantidad si ya existe //
    function addToCart(product) {
      const existingProductIndex = cart.findIndex((item) => item.nombre === product.nombre);

      if (existingProductIndex !== -1) {
        cart[existingProductIndex].cantidad += 1;
      } else {
        product.cantidad = 1;
        cart.push(product);
      }

      updateCartDisplay();
      updateLocalStorage();
    }

    // Función para actualizar la visualización del carrito //
    function updateCartDisplay() {
      cartItems.innerHTML = '';
      let total = 0;

      cart.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="cart-product-card">
                <img src="${item.imagenSrc}" alt="${item.nombre}">
                <div class="cart-product-info">
                    <h2>${item.nombre}</h2>
                    <p class="price">$${item.precio.toFixed(2)}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                </div>
            </div>
        `;
        listItem.classList.add('cart-item');
        cartItems.appendChild(listItem);
        total += item.precio * item.cantidad;
      });

      cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }


    // Agregar evento click al boton agregar al carrito //
    addToCartButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const product = productos[index];
        addToCart(product);
      });
    });

    // Agregar evento click al botón finalizar compra //
    checkoutButton.addEventListener('click', () => {
      if (cart.length > 0) {
        contactFormContainer.style.display = 'block';

        showMessage('Por favor, complete la información de contacto.');
      } else {
        showMessage('El carrito está vacío. Agregue productos antes de finalizar la compra.', true);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El carrito esta vacío',
          iconColor: '#000000',
          confirmButtonColor: '#000000',
        })
      }
    });

    // Agregar un controlador de eventos para el envío del formulario de información de contacto //
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName = document.getElementById('first-name').value;
      const lastName = document.getElementById('last-name').value;
      const street = document.getElementById('street').value;
      const city = document.getElementById('city').value;
      const state = document.getElementById('state').value;
      const country = document.getElementById('country').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;

      showMessage('Sus productos se han enviado con éxito. Gracias por su compra.', false);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Su compra ha sido realizada con éxito',
        showConfirmButton: false,
        timer: 2000,
        iconColor: '#000000',
      })

      cart.length = 0;
      updateCartDisplay();
      updateLocalStorage();
      contactFormContainer.style.display = 'none';
    });

    // Agregar un controlador de eventos al botón vaciar carrito //
    clearCartButton.addEventListener('click', () => {
      cart = [];
      updateCartDisplay();
      updateLocalStorage();
      showMessage('El carrito esta vacío');
      Swal.fire({
        title: 'El carrito se ha vaciado',
        confirmButtonColor: '#000000',
      })
      contactFormContainer.style.display = 'none';
    });

    function showMessage(message, isError = false) {
      const messageDiv = document.createElement('div');
      messageDiv.textContent = message;
      messageDiv.classList.add(isError ? 'error-message' : 'success-message');
      messageContainer.appendChild(messageDiv);

      // Desaparecer el mensaje después de 3 segundos //
      setTimeout(() => {
        messageDiv.remove();
      }, 3000);
    }
  });
