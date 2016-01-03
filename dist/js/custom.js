$(document).ready(function() {

    // аккордион в сайдбаре    
    

    $('.accordion-section-title').click(function(e) {
        e.preventDefault();
        var currentAttrValue = $(this).attr('href');

        if($(e.target).hasClass('active')) {
            $(this).removeClass('active');
            $(this).siblings('.accordion-section-content').stop(true).slideUp(300).removeClass('open')
        
        }else {    
            $(this).addClass('active');
            $('.accordion ' + currentAttrValue).slideDown(300).addClass('open'); 
        }

        
    });
    
    // инфа на две части
    $('.information__content').columnize({
        columns: 2,
        width: 530
    });
    
    
    // выбор цвета в сайдбаре 
    
    $('.colors-link').click(function(e){
        e.preventDefault();
        var elem = $(this);
        if(elem.parent().hasClass('active')) {
            elem.parent().removeClass('active')
        } else {
            elem.parent().addClass('active');
        }
    });
    
    // слайдер на товарах
    $('.products-slider__thumbnail').click(function(){
        var urlImg = $(this).find('img').attr('data-big');

        $(this).closest('.products-slider').find('.products-slider__thumbnail').removeClass('active');
        $(this).addClass('active');
        $(this).closest('.products-slider').find('.products-slider__main-thumbnail img').attr('src', urlImg);
    });
    
    // смена фильтра на товарах
    $('.head-filter__view-url').click(function(e){
        e.preventDefault();
        var filter = $(this).data('filter');
        $('.head-filter__view-url').removeClass('active');
        $(this).addClass('active');
        $('.products-list')
            .attr('class', 'products-list')
            .addClass('filter-' + filter);
    });
    
    // reset брендов
    
    $('.brand-reset').click(function(){
        resetCheckboxes(".brand-list");
    });
    
    // рейтинг товара
    
    $('.products-rating__list').each(function(){
        var numbStars = $(this).data("rate");
        $(this).find(".products-rating__item:lt(" + numbStars + ")").addClass("products-rating__item-fill");
        $(".products-rating__count-stars").text(numbStars);
    });
    
    // reset os
    
    $('.os-reset').click(function(){
        resetCheckboxes(".os-list");
    });
    
    function resetCheckboxes (list) {
        var list = list;
        $(list).find('input[type="checkbox"]').attr('checked', false);
    }
    
    // слайдер на цену в сайдабаре
    
    $("#slider").slider({
        min: 0,
        max: 30000,
        step: 1,
        range: true,
        values: [100, 13000],
        slide: function(event, ui) {
            for (var i = 0; i < ui.values.length; ++i) {
                $("input.sliderValue[data-index=" + i + "]").val(ui.values[i]);
            }
        }
    });

    $("input.sliderValue").change(function() {
        var $this = $(this);
        $("#slider").slider("values", $this.data("index"), $this.val());
    });

    // select 
    $('.head-filter__select').select2({
        minimumResultsForSearch: -1,
        width: '145px'
    });

});



