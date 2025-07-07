document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const id = document.getElementById('carId').value.trim() ?? 'N/A';
  const phoneNumber = document.getElementById('phoneNumber').value.trim();


  // Basic validation
  if (!name) {
    Notiflix.Notify.failure('Name is required');
    return;
  }

  if (!email) {
    Notiflix.Notify.failure('Email Address is required');
    return;
  }

  if (!message) {
    Notiflix.Notify.failure('Message is required');
    return;
  }

  if (!validateEmail(email)) {
    Notiflix.Notify.failure('Invalid Email Address');
    return;
  }

  Notiflix.Loading.standard('Sending...');


  $.ajax({
    type: 'POST',
    url: '/subscribe', 
    data: {
      email: email,
      name: name,
      message: message,
      carId: id ?? 'N/A',
      phoneNumber: phoneNumber ?? "N/A"
    },
    success: function (response) {
      Notiflix.Loading.remove();
      Notiflix.Notify.success('Message sent successful!');
      
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('message').value = '';
      document.getElementById('carId').value = '';
      document.getElementById('phoneNumber').value = '';
    },
    error: function (response) {
      console.log();
      let l = response.responseJSON;
      console.log(l.message);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(l.message ?? 'Error occurred. Please try again later.');

    }
  });

});

document.getElementById('contactForm1').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name1').value.trim();
  const email = document.getElementById('email1').value.trim();
  const message = document.getElementById('message1').value.trim();
  const id = document.getElementById('carId').value.trim() ?? 'N/A';
  const phoneNumber = document.getElementById('phoneNumber1').value.trim();


  // Basic validation
  if (!name) {
    Notiflix.Notify.failure('Name is required');
    return;
  }

  if (!email) {
    Notiflix.Notify.failure('Email Address is required');
    return;
  }

  if (!message) {
    Notiflix.Notify.failure('Message is required');
    return;
  }

  if (!validateEmail(email)) {
    Notiflix.Notify.failure('Invalid Email Address');
    return;
  }

  Notiflix.Loading.standard('Sending...');


  $.ajax({
    type: 'POST',
    url: '/subscribe', 
    data: {
      email: email,
      name: name,
      message: message,
      carId: id ?? "N/A",
      phoneNumber: phoneNumber
    },
    success: function (response) {
      Notiflix.Loading.remove();
      Notiflix.Notify.success('Message sent successful!');
      
      document.getElementById('name1').value = '';
      document.getElementById('email1').value = '';
      document.getElementById('message1').value = '';
      document.getElementById('carId').value = '';
      document.getElementById('phoneNumber1').value = '';
    },
    error: function (response) {
      console.log();
      let l = response.responseJSON;
      console.log(l.message);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(l.message ?? 'Error occurred. Please try again later.');

    }
  });

});


function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}


// Get the main image element
const mainImage = document.getElementById('main-image');

// Get all thumbnail images
const thumbnails = document.querySelectorAll('.car-images');

// Loop through each thumbnail and add a click event listener
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        // Add fade-out class to main image to start the transition
        mainImage.classList.add('fade-out');

        // Change the main image's src after the transition ends
        setTimeout(() => {
            mainImage.src = this.src;
            mainImage.classList.remove('fade-out'); // Remove the fade-out class to show the new image
        }, 500); // Match the timeout duration with the transition time
    });
});
