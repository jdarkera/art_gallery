// // <!--disable right click and copy & paste-->
// // <script type="text/javascript">
//     $(document).ready(function(){$("body").bind("cut copy paste",function(n){n.preventDefault()}),$("body").on("contextmenu",function(n){return!1})});
//     window.dataLayer = window.dataLayer || [];
//     function gtag(){dataLayer.push(arguments);}
//     gtag('js', new Date());
//     gtag('config', 'UA-130204150-1');
// </script>
// <!-- init Masonry --> 

    /*
    var $grid = $('.grid').masonry({
        itemSelector: '.grid-item',
        percentPosition: true,
        columnWidth: '.grid-sizer'
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress( function() {
        $grid.masonry();
    });*/

    // Open the Modal
    function openModal(e) {
        document.getElementById("myModal").style.display = "block";
    }
    
    // Close the Modal
    function closeModal() {
        document.getElementById("myModal").style.display = "none";
    }
    
    var slideIndex = 1;
        showSlides(slideIndex);
    
    // Next/previous controls
    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    // Thumbnail image controls
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }
    
    function showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        var captionText = document.getElementById("caption");
        
        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex-1].style.display = "block";
        document.getElementById("caption").innerHTML= slides[slideIndex-1].getElementsByTagName("img")[0].alt;
    }
    baguetteBox.run('.tz-gallery');
    
    // $('#myCarousel').on('slide.bs.carousel', function () {
    //     slide.bs.carousel   
    //   })
    /* Roller Coaster */
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-130204150-1');

// init Masonry
var $grid = $('.grid').masonry({
itemSelector: '.grid-item',
percentPosition: true,
columnWidth: '.grid-sizer'
});

// layout Masonry after each image loads
$grid.imagesLoaded().progress( function() {
$grid.masonry();
}); 