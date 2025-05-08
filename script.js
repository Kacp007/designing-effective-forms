let clickCount = 0;

const countryInput = document.getElementById('country');
const phonePrefix = document.getElementById('countryCode');
const cityInput = document.getElementById('city');
const zipField = document.getElementById('zipCode');
const phoneField = document.getElementById('phoneNumber');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const vatCheckbox = document.getElementById('vatUE');
const vatInfo = document.getElementById('vatInfo');
const clicksInfo = document.getElementById('click-count');
const submitButton = document.querySelector('button[type="submit"]');

let allCountries = [];
let formValid = false;

submitButton.disabled = true;

vatCheckbox.addEventListener('change', function () {
    if (vatCheckbox.checked) {
        vatInfo.style.display = 'block';
    } else {
        vatInfo.style.display = 'none';
    }
})

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        allCountries = data.map(country => country.name.common).sort();
        populateCountrySelect(allCountries);
        setupCountryFilter();
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function populateCountrySelect(countries) {
    let defaultOption = countryInput.querySelector('option[value=""]');
    countryInput.innerHTML = '';

    if (defaultOption) {
        countryInput.appendChild(defaultOption);
    }

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryInput.appendChild(option);
    });
}

function setupCountryFilter() {
    let filterText = '';
    let lastKeyTime = Date.now();

    countryInput.addEventListener('keydown', function (e) {
        if (e.key.length === 1) {
            const currentTime = Date.now();

            if (currentTime - lastKeyTime > 500) {
                filterText = '';
            }

            lastKeyTime = currentTime;
            filterText += e.key.toLowerCase();

            const filteredCountries = allCountries.filter(country =>
                country.toLowerCase().startsWith(filterText)
            );

            if (filteredCountries.length > 0) {
                const matchingOption = Array.from(countryInput.options).find(option =>
                    option.value.toLowerCase().startsWith(filterText)
                );

                if (matchingOption) {
                    matchingOption.selected = true;
                }
            }

            setTimeout(() => {
                filterText = '';
            }, 1000);
        }
    });
}

function fillCountryData(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + data[0].idd.suffixes.join("")
            phonePrefix.value = countryCode;
            countryInput.value = data[0].name.common;

        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            const country = data.country;
            fillCountryData(country);
            cityInput.value = data.city;
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function handleSelection() {
    const shippingOptions = document.querySelectorAll('[name="shippingMethod"] + .logo-image');
    const paymentOptions = document.querySelectorAll('[name="paymentMethod"] + .logo-image');

    shippingOptions.forEach(option => {
        const radio = option.previousElementSibling;
        if (radio.checked) {
            option.classList.add('selected');
        }

        option.addEventListener('click', function () {
            shippingOptions.forEach(opt => opt.classList.remove('selected'));

            this.classList.add('selected');

            const radio = this.previousElementSibling;
            radio.checked = true;

            validateForm();
        });
    });

    paymentOptions.forEach(option => {
        const radio = option.previousElementSibling;
        if (radio.checked) {
            option.classList.add('selected');
        }

        option.addEventListener('click', function () {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));

            this.classList.add('selected');

            const radio = this.previousElementSibling;
            radio.checked = true;

            validateForm();
        });
    });
}

function validateField(e) {
    const field = e.target;
    if (field.id === 'vatNumber' || field.id === 'invoiceData' || field.id === 'countryCode') {
        return;
    }

    field.classList.remove('is-invalid');
    field.classList.remove('is-valid');

    if (field.checkValidity() === false) {
        field.classList.add('is-invalid');
    } else {
        field.classList.add('is-valid');
    }

    validateForm();
}

function validateForm() {
    const requiredFields = form.querySelectorAll('[required]');
    const shippingRadios = document.querySelectorAll('[name="shippingMethod"]');
    const paymentRadios = document.querySelectorAll('[name="paymentMethod"]');

    let shippingSelected = false;
    for (let i = 0; i < shippingRadios.length; i++) {
        if (shippingRadios[i].checked) {
            shippingSelected = true;
            break;
        }
    }

    let paymentSelected = false;
    for (let i = 0; i < paymentRadios.length; i++) {
        if (paymentRadios[i].checked) {
            paymentSelected = true;
            break;
        }
    }

    let allFieldsValid = true;
    requiredFields.forEach(field => {
        if (!field.checkValidity()) {
            allFieldsValid = false;
        }
    });

    submitButton.disabled = !(allFieldsValid && shippingSelected && paymentSelected);

    return allFieldsValid && shippingSelected && paymentSelected;
}

function setupFormValidation() {
    phoneField.addEventListener('input', () => {
        phoneField.value = phoneField.value.replace(/\D/g, '');
    });


    zipField.addEventListener('input', () => {
        zipField.value = zipField.value.replace(/[^0-9-]/g, '');
    });
    
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('focusout', validateField);
        input.addEventListener('change', validateField);
        input.addEventListener('input', validateField);
    });

    form.addEventListener('submit', function (event) {
        if (!validateForm()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    });

}
(() => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);
    document.addEventListener('DOMContentLoaded', () => {
        handleSelection();
        setupFormValidation();
        validateForm();

    });
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        console.log('Form submitted!');
    });
    fetchAndFillCountries();
    getCountryByIP();
})()
