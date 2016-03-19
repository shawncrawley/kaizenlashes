var KAIZEN_LASHES = (function () {
    "use strict";

    /*--------------------------------
     *******GLOBAL VARIABLES**********
     *********************************/
    /*--CONSTANTS--*/
    var MAIN_PHOTOS = 4,
        OTH_PHOTOS = 23,
        PROD_PHOTOS = 4,
        PHOTO_DISPLAY_TIME = 5000,
    /*--STANDARD VARIABLES--*/
        photoShowing = 2,  // Photo loop count
        i,
    /*--JQUERY VARIABLES--*/
        $homeContent,
        $galleryContent,
    /*--FUNCTIONS--*/
        showModal,
        hideModal,
        loadGallery,
        loadPageContents,
        rotatePhotos,
        initializeJqueryVariables,
        setGalleryListeners;


    /*--------------------------------
     ******FUNCTION DECLARATIONS******
     *********************************/
    initializeJqueryVariables = function () {
        $galleryContent = $('#content-gallery').find('.flex-container-row');
        $homeContent = $('#content-home');
    };

    showModal = function () {
        $('#modal-link')[0].click();
    };

    hideModal = function () {
        $('#close-modal-link')[0].click();
    };

    loadGallery = (function () {
        var executed = false;
        return function () {
            if (!executed) {
                executed = true;
                for (i = 1; i <= MAIN_PHOTOS; i++) {
                    $galleryContent.append('<div class="gallery-photo"><img id="img-' + i + '" src="images/img-' + i + '.jpg"></div>');
                }
                for (i = 1; i <= OTH_PHOTOS; i++) {
                    $galleryContent.append('<div class="gallery-photo"><img id="img-oth-' + i + '" src="images/img-oth-' + i + '.jpg"></div>');
                }
                for (i = 1; i <= PROD_PHOTOS; i++) {
                    $galleryContent.append('<div class="gallery-photo"><img id="img-product-' + i + '" src="images/img-product-' + i + '.jpg"></div>');
                }
            }
        };
    }());

    setGalleryListeners = function () {
        var $modalPhotoView = $('#modal-photo-view');

        $('.gallery-photo').on('click', function () {
            // Empty current photo and replace with correct one
            $modalPhotoView
                .empty()
                .html('<img id="current-image" src="images/' + $(this).find('img').attr('id') + '.jpg" class="large-image">');
            showModal();
            $(document).on('keyup', function (e) {
                var currPhoto,
                    prevPhoto,
                    nextPhoto;

                if (e.keyCode === 27) { // Esc key
                    hideModal();
                    $(this).off('keyup');
                } else if (e.keyCode === 37) { // Left arrow
                    currPhoto = $('#current-image').attr('src').slice(7, -4);
                    prevPhoto = $($("#" + currPhoto).parent().prev().children()[0]).attr('src');
                    if (prevPhoto !== undefined) {
                        $modalPhotoView.html('<img id="current-image" src=' + prevPhoto + ' class="large-image">');
                    }
                } else if (e.keyCode === 39) { // Right arrow
                    currPhoto = $('#current-image').attr('src').slice(7, -4);
                    nextPhoto = $($("#" + currPhoto).parent().next().children()[0]).attr('src');
                    if (nextPhoto !== undefined) {
                        $modalPhotoView.html('<img id="current-image" src=' + nextPhoto + ' class="large-image">');
                    }
                }
            });
            // $(window).on('swiperight', function () {
            //     var currPhoto,
            //         nextPhoto;
            //
            //     currPhoto = $('#current-image').attr('src').slice(7, -4);
            //     nextPhoto = $($("#" + currPhoto).parent().next().children()[0]).attr('src');
            //     if (nextPhoto !== undefined) {
            //         $modalPhotoView.html('<img id="current-image" src=' + nextPhoto + ' class="large-image">');
            //     }
            // });
            // $(window).on('swipeleft', function () {
            //     var currPhoto,
            //         prevPhoto;
            //
            //     currPhoto = $('#current-image').attr('src').slice(7, -4);
            //     prevPhoto = $($("#" + currPhoto).parent().prev().children()[0]).attr('src');
            //     if (prevPhoto !== undefined) {
            //         $modalPhotoView.html('<img id="current-image" src=' + prevPhoto + ' class="large-image">');
            //     }
            // });
            $('#current-image').on('click', function (e) {
                e.stopPropagation();
            });
            $('#gallery-photo').on('click', function (e) {
                e.stopPropagation();
                hideModal();
                $(this).off('click');
                $('#current-image').off('click');
            });
        });
    };

    loadPageContents = function (e) {
        var hash = window.location.hash.slice(1),
            infoDivId = 'content-' + hash,
            $infoDiv = $('#' + infoDivId);

        if (hash === 'gallery-photo' || e.oldURL.indexOf('gallery-photo') !== -1) {
            return;
        }

        $infoDiv.fadeIn();  // If no other element info is showing, show the clicked element info

        $('.content').not($infoDiv).slideUp();

        if (infoDivId === "content-gallery") {
            loadGallery();
            setGalleryListeners();

        } else {
            $('.gallery-photo').off('click');
            $(document).off('keyup');
            $('#current-image').off('click');
        }

        window.scrollTo(0, 0);
    };

    rotatePhotos = function () {
        if (photoShowing > MAIN_PHOTOS) {
            photoShowing = 1;
        }
        $('#content-img').find(':first-child').attr('src', 'images/img-' + photoShowing + '.jpg');
        photoShowing++;
    };

    /*--------------------------------
     **********ON PAGE LOAD***********
     *********************************/
    $(function () {
        initializeJqueryVariables();

        window.onhashchange = loadPageContents;

        window.location.hash = 'home';
        $homeContent.fadeIn();

        //Switch main page image every 5 seconds
        setInterval(rotatePhotos, PHOTO_DISPLAY_TIME);

        // Control fading in/out of service price info
        $('.service-tab').on('click', function () {
            var clickedItemId = this.id,
                sliceIndex = clickedItemId.lastIndexOf('-'),
                clickedItem = clickedItemId.slice(0, sliceIndex + 1),
                infoDivId = clickedItem + "info",
                $serviceInfo = $('#' + infoDivId),
                $displayedServiceInfo = $('.services-fees-container[style="display: block;"]');
            if ($serviceInfo.attr('style') === undefined || $serviceInfo.attr('style') !== "display: block;") {  // If the clicked element info is hidden
                if ($displayedServiceInfo.length === 0) {   // Check if another element is showing its info
                    $serviceInfo.slideDown();  // If no other element info is showing, show the clicked element info
                } else {
                    $displayedServiceInfo.slideUp(function () {  // Otherwise, fade out the showing element info
                        $serviceInfo.slideDown();  // And then show the clicked element info
                    });
                }
                $('.service-text').css("color", "#008060");  // Change all of the color to the default color;
                $('#' + clickedItemId).children().css("color", "#d699af");  // Change the clicked element text to the highlighted color
            } else {
                $serviceInfo.slideUp();  // If the clicked element was already showing, hide it
                $('#' + clickedItemId).children().css("color", "#008060");  // Change the clicked element text back to the original color
            }
        });

        // Control fading in/out of different content (a.k.a. "different pages")
        $('.footer-link').on('click', function () {
            var clickedItemId = this.id,
                sliceIndex = clickedItemId.lastIndexOf('-');

            window.location.hash = clickedItemId.slice(sliceIndex + 1);
        });
    });

    /*--------------------------------
     ****ENABLE FACEBOOK CONTENT******
     ********************************/
    // (function (d, s, id) {
    //     var js, fjs = d.getElementsByTagName(s)[0];
    //     if (d.getElementById(id)) {
    //         return;
    //     }
    //     js = d.createElement(s);
    //     js.id = id;
    //     js.src = "http://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
    //     fjs.parentNode.insertBefore(js, fjs);
    // }(document, 'script', 'facebook-jssdk'));
}());