
var pipeline_raw_map = projpipeline_raw_map.concat( opppipeline_raw_map );
var pipeline_map = {};
var tablemap = {};
var pipekeys = [];
var projpipekeys = [];
var opppipekeys = [];
var customers = [];
var keywords = [];

var user_note_count = {};
for (var u in users) {
	user_note_count[users[u]] = 0;
}

for (var p in pipeline_raw_map) {
	pipeline_map[ pipeline_raw_map[p]["name"] ] = pipeline_raw_map[p]["stages"];
	tablemap[ pipeline_raw_map[p]["name"] ] = "reporttable"+p;
	pipekeys.push( pipeline_raw_map[p]["name"] );
}
pipekeys.sort();

for (var p in projpipeline_raw_map) {
	projpipekeys.push( projpipeline_raw_map[p]["name"] );
}
projpipekeys.sort();

for (var p in opppipeline_raw_map) {
	opppipekeys.push( opppipeline_raw_map[p]["name"] );
}
opppipekeys.sort();

for ( var o in opps ) {
	if ( opps[o]["customer"] != "" && customers.indexOf( opps[o]["customer"] ) == -1 )
		customers.push( opps[o]["customer"] );
	if ( opps[o]["keyword"] != "" && keywords.indexOf( opps[o]["keyword"] ) == -1 )
		keywords.push( opps[o]["keyword"] );
}
customers.sort();
keywords.sort();

var currentPipeline = "All";


var months = [ "Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];


function getIdFromOpp( opp ) {
    var s = 0;
	var pipeline = pipeline_map[ opp["pipeline"] ];
	s = pipeline.indexOf( opp["stage"] );
	if (s == "-1" ) s = 99;
    return s;
}

function removeAllOldTables() {
	for ( i in tablemap )
		$("#"+tablemap[i]).remove();
}

var projTableBG = "#9ABEDC";
var projCellBG = "#C2D8EA";

var oppTableBG = "#A3B76D";
var oppCellBG = "#D1DBB6";

function createReportTable( hashtag, pipelinestr ) {
	var project=false;
	var typestring="Opportunities";
	var tablecolor=oppTableBG;
	var bordercolor=oppCellBG;
	var oppul="oppul";
	if ( $.inArray( pipelinestr, projpipekeys ) != -1 ) {
		project=true;
		oppul="projul";
		typestring="Projects";
		tablecolor=projTableBG;
		bordercolor=projCellBG;
	}
	bordercolor = "#ddd";
	var pipeline = pipeline_map[ pipelinestr ];
	var table = $('<table  id="'+hashtag+'" class="pipelinetable" style="table-layout:fixed; margin-bottom:20px;"></table>');


	// Pipeline heading:
	row = $('<tr></tr>');
	row.append( $('<th style="border-top-left-radius: 4px;   border-top-right-radius: 4px; background-color:'+tablecolor+';padding:7px;  " align="left" colspan="200" ><span style="font-size:16pt;font-weight:500; color: white;">&nbsp;'+typestring+": "+pipelinestr+'</span></th>') );
	table.append(row); // header row

	// Pipeline stage headings:
	row = $('<tr style="min-height:50px;"></tr>');
	// Prio heading:
	row.append( $('<th class="mark"  style="min-width:61px;max-width:61px;width:61px;background-color:'+tablecolor+';border:solid 1px '+bordercolor+'; border-top:solid 1px '+bordercolor+'; border-bottom:solid 0px #fff;border-left:solid 0px #fff; color:white;">Stage</th>') );
	// Stage missing heading:
	row.append( $('<th class="mark" style="min-width:162px;max-width:162px;background-color:'+tablecolor+';border:solid 1px '+bordercolor+'; border-top:solid 1px '+bordercolor+'; border-bottom:solid 0px #fff; color: white;"> <i>unknown stage</i> </th>') );
	// Each pipeline stage headings:
	$.each( pipeline, function(i, val) {
		row.append( $('<th class="mark" style="min-width:162px;max-width:162px;background-color:'+tablecolor+';border:solid 1px '+bordercolor+'; border-top:solid 1px '+bordercolor+'; border-right: solid 0px #fff; border-bottom:solid 0px #fff; color:white;">'+this+'</th>') );
	});
	table.append(row); // header row



	// total money counts:
	row = $('<tr style="min-height:50px;"></tr>');
	// Prio heading:
	row.append( $('<th class="mark"  style="min-width:61px;max-width:61px;width:61px;background-color:'+tablecolor+';border:solid 1px '+bordercolor+'; border-top:solid 1px '+bordercolor+'; border-bottom:solid 0px #fff;border-left:solid 0px #fff; color:white;">Prio</th>') );
	// Stage missing heading:
	row.append( $('<th id="'+hashtag+'_SEK_'+99+'" class="mark" style="min-width:162px;max-width:162px;background-color:'+tablecolor+';border:solid 1px '+bordercolor+'; border-top:solid 1px '+bordercolor+'; border-bottom:solid 0px #fff; color: white;"> 0 </th>') );
	// Each pipeline stage headings:
	$.each( pipeline, function(i, val) {
		row.append( $('<th id="'+hashtag+'_SEK_'+i+'" class="mark" style="min-width:162px;max-width:162px;background-color:'+tablecolor+';border:solid 1px '+bordercolor+'; border-top:solid 1px '+bordercolor+'; border-right: solid 0px #fff; border-bottom:solid 0px #fff; color:white;">0</th>') );
	});
	table.append(row); // header row



	prios = ["High", "Med", "Low"];
	for ( p in prios ) {
		row = $('<tr class="tr_'+prios[p]+'"></tr>');
		var bottomcode="";
		var rightcode="";

		if (p==3)
			bottomcode= "border-bottom: solid 0px #fff;";

		row.append( $('<td style="vertical-align:top; color: #666; border:solid 1px '+bordercolor+'; '+bottomcode+'"><center>'+prios[p]+'</center></td>') );

		row.append( $('<td style="min-width:61px;max-width:61px;width:61px;background-color:#fbfbfb; border:solid 1px '+bordercolor+';'+bottomcode+'"><ul id="'+hashtag+'_pipeline_99_'+prios[p]+'" class="'+oppul+'" style="height:100%; list-style-type: none; float: left; margin: 0px; padding: 0px; " ></ul></td>').addClass('postitcell') );
		$.each( pipeline, function( index ) {
			if (index==pipeline.length-1)
				rightcode="";
			row.append( $('<td style="min-width:162px;max-width:162px; border:solid 1px '+bordercolor+';'+bottomcode+' '+rightcode+'"><ul id="'+hashtag+'_pipeline_'+index+'_'+prios[p]+'" class="'+oppul+'" style="height:100%; width:100%; list-style-type: none; float: left; margin: 0px; padding: 0px;" ></ul></td>').addClass('postitcell') );
		});

		table.append(row); // opportunities row
	}

	$('#reportholder').append(table);

}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}



function loadPipeline( pipeline, person, customer, keyword ) {
	currentPipeline = pipeline;

	removeAllOldTables();
	loadPipelineSub( pipeline, person, customer, keyword );

    $( ".oppul" ).sortable({
         connectWith: ".oppul",
		 placeholder: "oppplaceholder",
		 forcePlaceholderSize: true,
		 start: taskMoveStart,
		 stop: taskMoveAbort,
		 update: taskMoveEnd,
         beforeStop: function(ev, ui) {
			 data = ui.item.parent().attr('id').split("_");
			 console.log("*** data = " + data);
			 console.log("*** data[2] = " + data[2]);
			 if (data[2] == "99") {
 				ui.item.removeClass('lifted');
                $(this).sortable('cancel');
			}
         }
    });
	$( ".oppul" ).disableSelection();
    $( ".projul" ).sortable({
         connectWith: ".projul",
		 placeholder: "projplaceholder",
		 forcePlaceholderSize: true,
		 start: taskMoveStart,
		 stop: taskMoveAbort,
		 update: taskMoveEnd,
         beforeStop: function(ev, ui) {
			 data = ui.item.parent().attr('id').split("_");
			 if (data[2] == "99") {
 				ui.item.removeClass('lifted');
                $(this).sortable('cancel');
			}
         }
    });
	$( ".projul" ).disableSelection();
}

function taskMoveStart( event, ui ) {
	ui.item.addClass('lifted');
	// make oppplaceholder right size
	$(".oppplaceholder").css("{min-height:25px; height:25px;}");
}

function taskMoveAbort( event, ui ) {
	ui.item.removeClass('lifted');
}

function taskMoveEnd( event, ui ) {
	if(ui.sender != null) {
		console.log( "Update the sender column...");
		console.log( ui.sender );
	} else {
		console.log( "Update the destination column...");
		console.log( ui.item );
		// 88014

		taskid = ui.item.attr('id').split("_")[1];
		tasktype = ui.item.attr('id').split("_")[2];
		if ( tasktype == "o" ) tasktype = 0; else tasktype = 1;
		data = ui.item.parent().attr('id').split("_");

		var key = Object.keys(tablemap).filter(function(key) {return tablemap[key] === data[0]})[0];

		prio = 1;
		if ( data[3] == "High" ) prio = 9;
		else if (data[3] == "Med" ) prio = 5;

		var url = window.baseURL+"/chart?moveTicket="+taskid+"&moveTicketType="+tasktype+"&movePrio="+prio+"&movePipeline="+encodeURIComponent(key)+"&moveStage="+encodeURIComponent(pipeline_map[key][data[2]]);
		$.ajax( url );

		// Need to get the before and after ids
		var index = ui.item.index();
		var movedBefore = 0;
		var movedAfter = 0;
		if ( index > 0 ) {
			var child = ui.item.parent().children()[index-1];
			console.log( "CHILD = " + child);
			console.log( "CHILD id = " + child.id );
			movedBefore = child.id.split("_")[1];
			console.log("MOVEDBEFORE = " + movedBefore);
		}
		if ( index+1 < ui.item.parent().children().length ) {
			var child = ui.item.parent().children()[index+1];
			console.log( "CHILD = " + child);
			console.log( "CHILD id = " + child.id );
			movedAfter = child.id.split("_")[1];
			console.log("MOVEDAFTER = " + movedAfter);
		}

		url = baseURL+"/reorder?movedTicket="+taskid+"&movedTicketType="+tasktype+"&movedBefore="+movedBefore+"&movedAfter="+movedAfter;
		$.ajax( url );

	}
}

function printPostit( printpage ) {
	$( "#" + printpage ).printThis( {
   	  	debug: false,
      	importCSS: true,
        printContainer: true,
        loadCSS: resourcesURL+"/print.css",
        pageTitle: "",
        removeInline: false,
        printDelay: 333,
        header: null
    } );

}



function loadPipelineSub( pipeline, person, customer, keyword ) {

	if ( pipeline=="All" ) {
		for ( i in opppipekeys )
			if ( pipelineFilter[opppipekeys[i]] != "1" )
				loadPipelineSub( opppipekeys[i], person, customer, keyword );
		for ( i in projpipekeys )
			if ( pipelineFilter[projpipekeys[i]] != "1" )
				loadPipelineSub( projpipekeys[i], person, customer, keyword );

	} else {
		var hashtag = tablemap[pipeline];
	    createReportTable( hashtag, pipeline );

		var popups = [];
	    $.each( opps, function(opp) {

			var iconstring = "<a id='go' rel='leanModal' title='Click for detailed info' name='signup' href='#popup_"+this["oppId"]+"'><span class='info-icon'>i</span></a>";

			iconstring = "<a id='go' rel='leanModal' title='Click for detailed info' name='signup' href='#popup_"+this["oppId"]+"'><img src='"+resourcesURL+"/21-wrench.png' class='info-icon'></img></a>";
			if ( this["type"] != "Opportunity" && this["leveransDatum"] != '' && this["leveransDatum"] != 'undefined' ) iconstring += "<img src='"+resourcesURL+"/83-calendar.png' style='padding-right:5px;' class='info-icon'  ></img>";
			else if ( this["type"] == "Opportunity" && this["leveransDatum"] != '' && this["leveransDatum"] != 'undefined' ) iconstring += "<img src='"+resourcesURL+"/83-calendar.png' style='padding-right:5px;' class='info-icon'  ></img>";


			var popupbody = "<div>";
			popupbody +="<table class='signup-table'>";
			popupbody +="<tr><td style='width:75px;' align='right'><b>details:</b></td><td><textarea id='details_"+this["oppId"]+"' rows='15' cols='65' type='text'>"+this["details"]+"</textarea></td></tr>";
			if ( this["type"] == "Project" )
				popupbody +="<tr><td align='right'><b>total:</b></td><td><input id='total_"+this["oppId"]+"' type='text' value='"+parseInt(this["total"]) + "'></input> SEK</td></tr>";
			else
				popupbody +="<tr><td align='right'><b>total:</b></td><td><input id='total_"+this["oppId"]+"' disabled type='text' value='"+parseInt(this["total"]) + "'></input> SEK</td></tr>";
			if ( this["type"] == "Opportunity" ) {
				popupbody +="<tr><td align='right'><b>Prognosdag:</b></td><td><input type='text' class='datepicker' id='datepicker_"+this["oppId"]+"'></input></td></tr>";
			} else {
				var leveransDatum = this["leveransDatum"].split(" ")[0];

				if ( username=="Michel" || username=="mark" || this["stage"] != "Fakturerat" ) {
					popupbody +="<tr><td align='right'><b>Leveransdatum:</b></td><td><input type='text' class='datepicker' id='datepicker_"+this["oppId"]+"' value='"+leveransDatum+"'></input></td></tr>";
				} else {
					popupbody +="<tr><td align='right'><b>Leveransdatum:</b></td><td><input disabled type='text' class='datepicker' id='datepicker_"+this["oppId"]+"' value='"+this["leveransDatum"]+"'></input></td></tr>";
				}
			}
			if ( username=="Michel" || username=="mark" ) {
				if ( this["type"] == "Project" ) {
					popupbody +="<tr><td align='right'><b>Done:</b></td><td><input type='checkbox' id='popup_makedone_"+this["oppId"]+"'></input> (OBS: då försvinner den från kanban tavlan!)</td></tr>";
				} else {
					popupbody +="<tr><td align='right'><b>State:</b></td><td><input type='radio' name='state_"+this["oppId"]+"' value='open' checked >Open</input><br/><input id='popup_makewon_"+this["oppId"]+"' type='radio' value='won' name='state_"+this["oppId"]+"'>Won</input><br/><input id='popup_makelost_"+this["oppId"]+"' type='radio' value='lost'name='state_"+this["oppId"]+"'>Lost</input> </td></tr>";
				}

			}
			popupbody +="<input id='objType_"+this["oppId"]+"' type='hidden' name='type' value='"+this["type"]+"'>";
			popupbody +="</table></div>";
			popupbody += "<button class='modal_save_button'>Save</button><button class='modal_cancel_button'>Cancel</button>";
			var url="";
			var oppId = this["oppId"].split("_")[0];
			if ( this["type"] == "Opportunity" ) {
				url = "daylite4://ShowObject/Opportunity/" + oppId;
				popups.push( "<div id='popup_"+this["oppId"]+"' class='popup'><div class='popup-header-opp'><h4 class='popup-header'><a title='"+this["details"]+"' href='"+url+"'>"+this["name"]+" ("+this["type"]+")</a></h4></div>"+popupbody+"</div>" );
			} else {
				url = "daylite4://ShowObject/Project/" + oppId;
				popups.push( "<div id='popup_"+this["oppId"]+"' class='popup'><div class='popup-header-proj'><h4 class='popup-header'><a title='"+this["details"]+"' href='"+url+"'>"+this["name"]+" ("+this["type"]+")</a></h4></div>"+popupbody+"</div>" );
			}

			var prio="Med";
			if ( ( this["state"] == "Open" || this["state"] == "New" || this["state"] == "In Progress" )
				&& this["pipeline"] == pipeline && ( person=="Everybody" || this["person"]==person )
				&& (customer=="All" || customer==this["customer"] )
				&& (keyword=="All" || keyword==this["keyword"] ) ) {

					var initials = this["person"].split(' ').map(function (s) { return s.charAt(0); }).join('');
					if ( this["prio"] > 7 ) prio="High";
					else if ( this["prio"] > 4 ) prio="Med"
					else prio="Med";

					var total = this["total"];
					if (total.replace) total = total.replace(/[^0-9,\.\-]+/g,'')
					var value = totalAsCurrency(parseInt(total)||0);

					var bgcolor = "";

					if ( this["color"] != "" ) bgcolor = " style='background-color:"+this["color"]+"'";


					if ( this["type"] == "Opportunity" ) {
						var pid = getIdFromOpp( this );
						var extraclass = "";
						//if ( Math.round(this["total"]).toLocaleString() == "0" ) value = "";
						var oppId = this["oppId"].split("_")[0];

						$("#"+hashtag+"_pipeline_"+pid+"_"+prio).append("<li id='id_"+this["oppId"]+"' class='task drag oppColor "+extraclass+"'><center><div class='taskheader'"+bgcolor+"><span style='float:left;'>["+initials+"]</span><span id='taskvalue_"+this["oppId"]+"'> "+value+"</span> "+iconstring+" </div></center><div class='taskbody'><a class='taskBodyText' title='"+this["details"]+"' href='daylite4://ShowObject/Opportunity/"+oppId+"'>"+this["name"]+"</a></div></li>" );
					}
					if ( this["type"] == "Project" ) {
						var pid = getIdFromOpp( this );
						var days = 0;
						if ( this["estimatedTime"] <= (9*60*60) ) {
							days = (this["estimatedTime"]/(60*60*8));
						} else {
							days = (this["estimatedTime"]/(60*60*24));
						}
						days = (Math.round(days * 4) / 4);//.toFixed(2);
						var daystr = days;
						if ( this["estimatedTime"] == 0 ) daystr = "";
						else if ( days == 1 ) daystr = "(" + days + " day)";
						else daystr = "(" + days + " days)";

						var oppId = this["oppId"].split("_")[0];
						$("#"+hashtag+"_pipeline_"+pid+"_"+prio).append("<li id='id_"+this["oppId"]+"' class='task drag projColor'><center><div class='taskheader'"+bgcolor+"><span style='float:left;'> ["+initials+"]</span><span id='taskvalue_"+this["oppId"]+"'> "+value+"</span> "+iconstring+"  </div></center><div class='taskbody'><a class='taskBodyText' title='"+this["details"]+"' href='daylite4://ShowObject/Project/"+oppId+"'>"+this["name"]+"</a><br/><span style='float:right;font-size: 8pt;font-weight:400'>"+daystr+"</span></div></li>" );
					}
					var pid = getIdFromOpp( this );
					if ( this["total"] != "0" ) {
						var ammount = $("#"+hashtag+"_SEK_"+pid).text();
						ammount = parseInt( ammount.replace(/\./g,"") ) + (parseInt(total)||0);
						$("#"+hashtag+"_SEK_"+pid).html( totalAsCurrency( ammount ) );
					}
			}
	    });

		document.getElementById('popups').innerHTML = popups.join('');
	}


	$(".task").mouseenter( function() {
		$(this).find(".info-icon").fadeTo(50, 0.75);
	} );
	$(".task").mouseleave( function() {
		$(this).find(".info-icon").fadeTo(50, 0.25);
	} );
}



$( document ).on( "focus", "input.datepicker:not(.hasDatepicker)", function() {
    console.log( "Initializing " + this.id );
	$( this ).datepicker({ dateFormat: 'yy-mm-dd' });
	$( this ).each(function() {
		var dateval = $(this).val();
		if ( dateval != "" && dateval != "undefined" )
    		$(this).datepicker('setDate', dateval);
    });


});


function totalAsCurrency(x) {
    var numstr = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " SEK";
	if (x<=0)
		numstr = "<span style='color:red'>" + numstr + '</span>';
	return numstr;
}

$(document).ready(function(){
    //$( document ).tooltip();
	getCustomers();
	getKeywords();

	// Create the menus
	for ( i in pipekeys ) {
		if ( $.inArray( pipekeys[i], projpipekeys ) != -1 )
			$("#pipelinelistProjects").append('<option value="'+pipekeys[i]+'">'+pipekeys[i]+'</option>');
		else
			$("#pipelinelistOpportunities").append('<option value="'+pipekeys[i]+'">'+pipekeys[i]+'</option>');

		var checked = "checked";
		if ( pipelineFilter[pipekeys[i]] == "1") checked = "";
		if ( $.inArray( pipekeys[i], projpipekeys ) != -1 )
			$("#settings-pipeline-table-proj").append("<tr><td style='width:75px;' align='right'><input type='checkbox' name='"+pipekeys[i]+"' value='"+pipekeys[i]+"' "+checked+"></input></td><td width='100%'>"+pipekeys[i]+"</td></tr>");
		else
			$("#settings-pipeline-table-opp").append("<tr><td style='width:75px;' align='right'><input type='checkbox' name='"+pipekeys[i]+"' value='"+pipekeys[i]+"' "+checked+"></input></td><td width='100%'>"+pipekeys[i]+"</td></tr>");
	}

	$.each( opps, function(opp) {
		user_note_count[ this["person"] ] += 1;
	});

	for ( i in users ) {
		$("#people").append('<option style="width:25px" value="'+users[i]+'">'+users[i]+' ('+user_note_count[users[i]]+')</option>');
	}

	// update selection boxes to current selection...
	if ( defaultPipeline != "All" )
		$('#pipelinelist').val(defaultPipeline);
	$('#people').val(defaultPerson);
	$('#customer').val(initialCustomer);
	$('#keyword').val(initialKeyword);

    loadPipeline( defaultPipeline, defaultPerson, initialCustomer, initialKeyword );

	if ( defaultFilterLow == 0 ) {
		$("#filter_Low").attr('checked', null);
		$('.tr_Low').hide();
	}
	if ( defaultFilterMed == 0 ) {
		$("#filter_Med").attr('checked', null);
		$('.tr_Med').hide();
	}
	if ( defaultFilterHigh == 0 ) {
		$("#filter_High").attr('checked', null);
		$('.tr_High').hide();
	}

	$('#filter_Low').click( function(){  if ( $(this).is(':checked') ) $('.tr_Low').show(); else $('.tr_Low').hide(); } );
	$('#filter_Med').click( function(){  if ( $(this).is(':checked') ) $('.tr_Med').show(); else $('.tr_Med').hide(); } );
	$('#filter_High').click( function(){  if ( $(this).is(':checked') ) $('.tr_High').show(); else $('.tr_High').hide(); } );

	updateRunCount();

	$("a[rel*=leanModal]").leanModal({ top : 150, right: 100, overlay : 0.5, saveButton: ".modal_save_button", saveCallback: popupSave, closeButton: ".modal_cancel_button" });

});



function getCustomers( ) {
	for ( i in customers ) {
		var name = customers[i];
		var selected = (name==initialCustomer?"selected":"");
		$("#customer").append('<option '+selected+' value="'+name+'">'+name+'</option>');
	}
	$("#customer").prepend('<option id="selectcustomer" value="All" '+selected+'>All customers</option>');
}

function getKeywords( ) {
	for ( i in keywords ) {
		var name = keywords[i];
		var selected = (name==initialKeyword?"selected":"");
		$("#keyword").append('<option '+selected+' value="'+name+'">'+name+'</option>');
	}
	$("#keyword").prepend('<option id="selectkeyword" value="All" '+selected+'>All keywords</option>');
}


function popupSave( event ) {
	console.log("popupSave()");
	console.log(this);
	var nodeid =  event.currentTarget.parentElement.getAttribute('id').replace("popup_", "");
	var nodeidtrimmed =  event.currentTarget.parentElement.getAttribute('id').split("_")[1];
	console.log( nodeid );
	console.log
	var details = $( "#details_"+nodeid ).val();
	var total = $( "#total_"+nodeid ).val();
	var objType = $( "#objType_"+nodeid ).val();

	var makeDone = '';
	if ( $( "#popup_makedone_"+nodeid ).is(':checked') ) makeDone = '1';
	var makeWon = '';
	if ( $( "#popup_makewon_"+nodeid ).is(':checked') ) makeWon = '1';
	var makeLost = '';
	if ( $( "#popup_makelost_"+nodeid ).is(':checked') ) makeLost = '1';
	var leveransdatum = $( "#datepicker_"+nodeid ).val();

	console.log( details );
	console.log( total );

	$('#taskvalue_'+nodeid).html( totalAsCurrency( total ) );
	var url = window.baseURL+"/setDetails?";
	url += "type="+encodeURIComponent(objType);
	url += "&id="+nodeidtrimmed;
	url += "&total="+encodeURIComponent(total);
	url += "&details="+encodeURIComponent(details);
	url += "&makeDone="+encodeURIComponent(makeDone);
	url += "&makeWon="+encodeURIComponent(makeWon);
	url += "&makeLost="+encodeURIComponent(makeLost);
	url += "&leveransdatum="+encodeURIComponent(leveransdatum);

	$.ajax( { async:false, url:url } );

}

function reloadPipeline(pipeline, person, customer, keyword) {
	url = baseURL+"/chart?initialPipeline="+encodeURIComponent(pipeline)+"&initialPerson="+encodeURIComponent(person)+"&initialCustomer="+encodeURIComponent(customer)+"&initialKeyword="+encodeURIComponent(keyword);
	if ( $('#filter_Low').is(':checked') )  url += "&filterLow=1";  else url += "&filterLow=0";
	if ( $('#filter_Med').is(':checked') )  url += "&filterMed=1";  else url += "&filterMed=0";
	if ( $('#filter_High').is(':checked') ) url += "&filterHigh=1"; else url += "&filterHigh=0";
	console.log("reloading with..." + url)
	location.href = url;
}

if ( !localStorage.runCount ) {
	localStorage.runCount = 0;
}

function updateRunCount( )
{
	localStorage.runCount = parseInt( localStorage.runCount ) + 1;
}

function updatePipelineFilter()
{
	$('#settings-pipeline-table-opp tr').each( function(i,row) {
		console.log(row);
		var pipestr = $(row).find('td')[1].innerText;
		if ( $(row).find('input').is(':checked') )
			$.ajax( { async:false, url:window.baseURL+"/setFilter?value=0&pipeline="+encodeURIComponent(pipestr) } );
		else
			$.ajax( { async:false, url:window.baseURL+"/setFilter?value=1&pipeline="+encodeURIComponent(pipestr) } );
	});
	$('#settings-pipeline-table-proj tr').each( function(i,row) {
		console.log(row);
		var pipestr = $(row).find('td')[1].innerText;
		if ( $(row).find('input').is(':checked') )
			$.ajax( { async:false, url:window.baseURL+"/setFilter?value=0&pipeline="+encodeURIComponent(pipestr) } );
		else
			$.ajax( { async:false, url:window.baseURL+"/setFilter?value=1&pipeline="+encodeURIComponent(pipestr) } );
	});

	reloadPipeline(pipelinelist.value, people.value, customer.value, keyword.value);
}
