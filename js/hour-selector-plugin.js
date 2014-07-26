/**
 * A simple plugin to select time intervals for a week.
 *
 * @author  Amitesh Kumar
 *
 * Use case :
 * If we want to define do not disturb hours for an user then we can use this plugin to create the ui to select the hour range easily.
 * 
 * @usage 
 * var hs = new HourSelector( $('container-element'), {}, {} );
 *
 * Provide old values :
 * var hs = new HourSelector( this, selectedHours, {} ); // For selectedHours values see below HourSelector definition
 *
 * Provide custom parameter name :
 * var hs = new HourSelector( this, {}, { paramName : "hour_setting"} ); 
 */
( function ( window ) {
  
  /**
   * Hour selector Module
   * 
   * @constructor
   * @param  {Dom element} daysContainer [description]
   * @param  {Hash} selectedHours: Hour selection matrix
   *
   *    selectedHours = {
          all       : { 0 : 1, 1 : 1, 2 : 1, 3 : 1, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0, 14 : 0, 15 : 0, 16 : 0, 17 : 0, 18 : 0, 19 : 0, 20 : 0, 21 : 0, 22 : 0, 23 : 0 },
          monday    : { 0 : 0, 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0, 14 : 0, 15 : 0, 16 : 0, 17 : 0, 18 : 0, 19 : 0, 20 : 0, 21 : 0, 22 : 0, 23 : 0 },
          tuesday   : { 0 : 0, 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0, 14 : 0, 15 : 0, 16 : 0, 17 : 0, 18 : 0, 19 : 0, 20 : 0, 21 : 0, 22 : 0, 23 : 0 },
          wednesday : { 0 : 0, 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0, 14 : 0, 15 : 0, 16 : 0, 17 : 0, 18 : 0, 19 : 0, 20 : 0, 21 : 0, 22 : 0, 23 : 0 },
          thursday  : { 0 : 0, 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0, 14 : 0, 15 : 0, 16 : 0, 17 : 0, 18 : 0, 19 : 0, 20 : 0, 21 : 0, 22 : 0, 23 : 0 },
          friday    : { 0 : 0, 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0, 14 : 0, 15 : 0, 16 : 0, 17 : 0, 18 : 0, 19 : 0, 20 : 0, 21 : 0, 22 : 0, 23 : 0 },
          saturday  : { 0 : 0, 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0, 14 : 0, 15 : 0, 16 : 0, 17 : 0, 18 : 0, 19 : 0, 20 : 0, 21 : 0, 22 : 0, 23 : 0 },
          sunday    : { 0 : 0, 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0, 14 : 0, 15 : 0, 16 : 0, 17 : 0, 18 : 0, 19 : 0, 20 : 0, 21 : 0, 22 : 0, 23 : 0 }
        }
   * @param  {Hash} options : options for the plugin eg. { paramName : "hour_setting" }
   * 
   */
  window.HourSelector = function ( daysContainer, selectedHours, options ) {
      var me = this;

      me.settings = selectedHours || {};
      // Name of form parameter or hidden element
      me.options = options || { paramName : "hour_setting"}; 

      me.widgetContainer = $( daysContainer );
      
      // Add days to containers
      me.addDays( daysContainer );
      me.renderDaysHours( daysContainer );
      me.applySettings( daysContainer, me.settings );

      $( "." + this.buttons.reset, daysContainer ).bind('click', function(){ me.reset(); });
      $( "." + this.buttons.clear, daysContainer ).bind('click', function(){ me.clear(); });
    }

  window.HourSelector.prototype = {
    /**
     * If selection of hours start by draging mouse then 
     * make it true to determine drag event 
     */
    isSelectionStart: false,

    widgetContainer: null,
    settings: {},

    buttons: {
      reset: 'reset-hours-selection',
      clear: 'clear-hours-selection'
    },

    /**
     * options for HourSelector widget
     */
    options: { 
      /**
       * This value will be used to prefix the name of parameter to set the hours value. It will be submit with form submit.
       * eg :  hourselector[monday][0] = true, hourselector[monday][2] = true, 
       *       hourselector[tuesday][0] = true, hourselector[tuesday][2] = true
       */
      paramName : "hourselector" 
    },

    /**
     * Default days settings
     */
    days: {
      all       : { className : "all", opts : {label : "For All Days"} },
      monday    : { className : "monday", opts : {label : "Monday"} },
      tuesday   : { className : "tuesday", opts : {label : "Tuesday"} },
      wednesday : { className : "wednesday", opts : {label : "Wednesday"} },
      thursday  : { className : "thursday", opts : {label : "Thursday"} },
      friday    : { className : "friday", opts : {label : "Friday"} },
      saturday  : { className : "saturday", opts : {label : "Saturday", className : "btn-danger"} },
      sunday    : { className : "sunday", opts : {label : "Sunday", className : "btn-danger"} }
    },


    /**
     * Add all days to container
     */
    addDays:function( widget ){
      $( widget ).html('<div class="all day clearfix"></div>' +
        '<div class="monday day clearfix"></div>' +
        '<div class="tuesday day clearfix"></div>' +
        '<div class="wednesday day clearfix"></div>' +
        '<div class="thursday day clearfix"></div>' +
        '<div class="friday day clearfix"></div>' +
        '<div class="saturday day clearfix"></div>'+
        '<div class="sunday day clearfix"></div>' +
        // Add buttons
        '<div class="">'+
          '<button class="' + this.buttons.reset + ' btn">Reset</button>' +
          '<button class="' + this.buttons.clear + ' btn">Clear</button>' +
        '</div>');
    },

    /**
     * Render hours for each days with am-pm 
     */
    renderDaysHours: function( widget ){
      var me = this,
          days = me.days;

      for( var key in days ){
        var day = days[key],
            dayCont = $('.' + day.className, $(widget));

        me.addHours(  dayCont, day.className, day.opts );
        me.onSelection( dayCont );
      }
    },

    /**
     * Add hours to a day
     */
    addHours: function( dayContainer, day, options ) {
      options = options || { label : "Day name", className : "btn-info" };
      options.className = options.className || "btn-info";

      if( dayContainer.size() > 0 ){
        $( dayContainer ).append('<div class="day-label pull-left btn ' + options.className + '">' + options.label + 
          '</div><div class="pull-left"><div class="hour-container clearfix"></div></div>');

        var options = this.options;

        for( var i = 0; i < 24; i++){
          if( i == 0 ){
            $( ".hour-container", dayContainer ).append( '<div class="am-pm pull-left btn btn-warning">AM</div>' );  
          }else if(i == 12){
            $( ".hour-container", dayContainer ).append( '<div class="am-pm pull-left btn btn-warning">PM</div>' );  
          }

          var hourSelValue = "<input type='hidden' name='{paramname}[{day}][{hour}]' value='0'>";
              hourSelValue = hourSelValue.replace(/{paramname}/, options.paramName ).replace(/{day}/, day ).replace(/{hour}/, i );

          if( i < 12 ){
            $( ".hour-container", dayContainer ).append( '<div class="hour pull-left btn hour-'+ i +'" data-hour="hour-'+ i +'">' + 
              ( i < 10 ? ("0" + i) : i ) + hourSelValue + '</div>' );
          }else{
            var j = parseInt(i) - 12;
            $( ".hour-container", dayContainer ).append( '<div class="hour pull-left btn hour-'+ i +'" data-hour="hour-'+ i +'">' + 
              ( j < 10 ? ("0" + j) : j ) + hourSelValue + '</div>' );
          }
        }
      } // end if

    }, // addHours end

    /**
     * Adding click and drag event to each hour button
     * @param  {Object} selector [description]
     */
    onSelection: function( selector ){
      var me = this;

      var onAllDaySelection = function( day ){
        if( $( day ).parents('.all').size() > 0){
          var widgetCont = $( day ).parents('.time-ticker'),
              selHourClass = "." + $( day ).data('hour'),
              isSelect = $(day).hasClass('btn-success');

          me.toggleHour( day, isSelect );

          $( selHourClass,  widgetCont ).each(function(){
              me.toggleHour( this, isSelect );
            });
        }
      };

      $( ".hour", selector ).mousedown(function(){
          me.isSelectionStart = true;
          if(me.isSelectionStart){
            me.toggleHour( this );
            onAllDaySelection( this );
          }
      });

      $(document).mouseup(function(){
          me.isSelectionStart = false;
      });

      $( ".hour", selector ).hover(function(){
          if(me.isSelectionStart){
            me.toggleHour( this );
            onAllDaySelection( this );
          }
      }, function(){});
    },

    /**
     * Toggle the hour selection
     * @param  {Obj}  hourBtn  [description]
     * @param  {Boolean} isSelect [description]
     */
    toggleHour: function( hourBtn, isSelect ){
      if(isSelect === undefined ){
        isSelect = !$( hourBtn ).hasClass('btn-success');
      }

      hourBtn = $( hourBtn );
      if( isSelect ){
        hourBtn.addClass( 'btn-success' );
        hourBtn.find('input:hidden').val(1);
      }else{
        hourBtn.removeClass( 'btn-success' );
        hourBtn.find('input:hidden').val(0);
      }
    },

    /**
     * Apply the previous settings
     * @param  {[type]} widget   [description]
     * @param  {[type]} settings [description]
     */
    applySettings: function( widget, settings){
      var me = this;
          widget = $( widget );

      for( var day in settings ){
        var hours = settings[day],
            dayHourCont = $('.' + day + ' .hour-container', widget );

        for(var hour in hours){
          var hourBtn = $('.hour-' + hour, dayHourCont ),
              isSelected = hours[hour];

          if( isSelected ){
            hourBtn.mousedown().mouseup();
          }
        }
      }
    },

    /**
     * Reset the hour selection
     */
    reset : function(){
      this.clear();
      this.applySettings( this.widgetContainer, this.settings);
    },

    /**
     * Clear the hour selection
     */
    clear: function(){
      var me = this;
      $('.hour', this.widgetContainer).each( function(){
        me.toggleHour( this, false);
      })
    }
  }; //HourSelector end

} )( window );