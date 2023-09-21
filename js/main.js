/* ============================================
            preloader
===============================================*/
$(window).on('load', function () {
    // makes sure that whole site is loaded
    $('#preloader-gif, #preloader').fadeOut(5000, function () {
    });
});

$(function () {
    //**************** variables ****************//
    const image_container = document.getElementById('image__container');
    const loader = document.getElementById('loader');

    const NUMBER_OF_PHOTOS = 10;
    const API_KEY = ``;
    const API_URL = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&orientation=landscape&count=${NUMBER_OF_PHOTOS}`;

    let is_ready = false;
    let number_images_loaded = 0;
    let total_images = 0;
    let photos_array = [];

    //**************** functions ****************//
    /**
     * @description - checks whether all the images were loaded
     * @returns {boolean} - if all images were loaded, return true; otherwise, false
     */
    function hasImageCompletedLoading() {
        number_images_loaded++;
        if (number_images_loaded === total_images) {
            is_ready = true;
            return is_ready;
        }
    }

    /**
     * @description - a utility function to set attributes to HTML element
     * @param element - the specific HTML element
     * @param attributes - the object of attributes to be set
     */
    function setAttributes(element, attributes) {
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
    }

    /**
     * @description - creates HTML anchor and image elements, add specific attributes, and add
     * the elements to the image__container
     */
    function displayPhotos() {
        number_images_loaded = 0;
        total_images = photos_array.length;

        photos_array.forEach(photo => {
            const anchorElement = document.createElement('a');
            setAttributes(anchorElement, {
                href: photo.links.html,
                target: '_blank',
            });
            const imageElement = document.createElement('img');
            setAttributes(imageElement, {
                src: photo.urls.regular,
                alt: photo.alt_description,
                loading: 'lazy',
                title: photo.alt_description,
            });

            imageElement.addEventListener('load', hasImageCompletedLoading);
            anchorElement.appendChild(imageElement);
            image_container.appendChild(anchorElement);

        })

    }

    /**
     * @description - gets photos from the API and displays them
     * @returns {Promise<void>}
     */
    async function getPhotosFromAPI() {
        try {
            const response = await fetch(API_URL);
            photos_array = await response.json();
            console.log(photos_array)
            displayPhotos();
        } catch (e) {
            swal({
                title: "ERROR!",
                text: `${e.message}`,
                icon: "error",
            });
        }
    }

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && is_ready) {
            is_ready = false;
            getPhotosFromAPI();
        }
    });

    getPhotosFromAPI();
});