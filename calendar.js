YUICalendarWrapper = Class.create({
  initialize: function(elementID, popUpCaption) {
		var image = document.createElement("img");
		image.src="/images/calendar-select.png";
		image.id = elementID+"_calendar_select_image";
		$(image).addClassName("calendar_select_image");
		var forElement = image;
		var dateInput = $(elementID);
	
		image.onclick = function(){
			var calendar;
			var dialog;

			function mySelectHandler(type,args,obj) {
				var selected = args[0];
				var selDate = this.toDate(selected[0]);
				
				if (calendar.getSelectedDates().length > 0) {
					var selDate = calendar.getSelectedDates()[0];
					dateInput.value = (selDate.getMonth()+1) + "/" + selDate.getDate() + "/" + selDate.getFullYear();
				} else {
					dateInput.value = "";
				}
				dialog.hide();
			};
			function myCancelHandler(type,args,obj){
				dialog.hide();
				return false;
			}

			dialog_div = document.createElement("div");
			document.body.appendChild(dialog_div);

			calendar_wrapper_div = document.createElement("div");
			dialog_div.appendChild(calendar_wrapper_div);
			
			calendar_wrapper_div.innerHTML = " ";
			calendar_div = document.createElement("div");
			calendar_wrapper_div.appendChild(calendar_div);

			dialog = new YAHOO.widget.Dialog(dialog_div, {
				context:[image, "tl", "tl"],
				// width:"16em",  // Sam Skin dialog needs to have a width defined (7*2em + 2*1em = 16em).
				draggable:true,
				visible: false,
				close:true
			});
			dialog.cancelEvent.subscribe(myCancelHandler, dialog, true);
			dialog.setHeader(popUpCaption);

			calendar = new YAHOO.widget.Calendar(calendar_div, {
				iframe:false,          // Turn iframe off, since container has iframe support.
				hide_blank_weeks:true  // Enable, to demonstrate how we handle changing height, using changeContent
			});

			calendar.renderEvent.subscribe(function() {
				dialog.fireEvent("changeContent");
			});

			dialog.render();
			calendar.selectEvent.subscribe(mySelectHandler, calendar, true);

			image.onclick = function(){
				if(dateInput.value)
				{
					calendar.select(dateInput.value);
					var selectedDates = calendar.getSelectedDates();
					if(selectedDates == "Invalid Date")
					{
						calendar.select(new Date());
						selectedDates = calendar.getSelectedDates();
					}
					if (selectedDates.length > 0) {
						var firstDate = selectedDates[0];
						calendar.cfg.setProperty("pagedate", (firstDate.getMonth()+1) + "/" + firstDate.getFullYear());
					}
				}
				calendar.render();
				dialog.show();
			}
			image.onclick();
		}
		Element.insert(dateInput, {after: image});
	}
});