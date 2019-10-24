/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redipsInit variable
var redipsInit;
//var queues = ['Integration: 2_Backlog', 'Integration: 3_Next', 'Integration: 4_Väntar på återkoppling från 3:e part/kund', 'Integration: 5_WIP', 'Integration: 6_För kundgodkännande', 'Integration: 7_Done']

// redips initialization
redipsInit = function () {

    // reference to the REDIPS.drag library and message line
    var	rd = REDIPS.drag,
    msg;
    // initialization
    rd.init();
    rd.scroll.speed = 35;
    rd.tableEditor = 'tblEditor';
    // set hover color for TD and TR
    rd.hover.colorTd = '#FFFFFF';
    rd.hover.colorTr = '#9BB3DA';
    // set hover border for current TD and TR
    rd.hover.borderTd = '1px solid #32568E';
    rd.hover.borderTr = '0px none #32568E';
    // drop row after highlighted row (if row is dropped to other tables)
    rd.rowDropMode = 'after';
	
	
    // row was clicked - event handler
    
    rd.style.rowEmptyColor = "rgba( 240, 240, 247, 0 )";

    rd.event.clicked = function() {
		rd.obj.className += ' lifted';
    }
    rd.event.notMoved = function() {
		rd.obj.className = rd.obj.className.replace(" lifted", "")
    }
	
    rd.event.dropped = function(targetCell) {
		rd.obj.className = rd.obj.className.replace(" lifted", "")
		// Need to update in RT which queue this task resides in
		var pos = rd.getPosition();
		console.log( "pos = " + pos );
		
			if ( 1 ) {  // pos[0] == pos[3] &&  pos[1] == pos[4]
				if ( pos[0] != pos[3] ||  pos[1] != pos[4] || pos[2] != pos[5] ) {
					// changed only column..
					console.log("Changed only column..");
					//RT_updateTicketColumn( taskid, kanbanqueues[pos[2]-1] );
					var taskid = rd.obj.innerHTML;
					console.log( taskid );
					var searchstring = "daylite4://ShowObject/Opportunity/";
					var i = taskid.indexOf( searchstring );
					if ( i==-1 ) searchstring="daylite4://ShowObject/Project/";
					i = taskid.indexOf( searchstring );
					i += searchstring.length;
					var j = taskid.indexOf("\">");
					console.log( i );
					console.log( j );
					taskid = taskid.substring( j, i );
					var stage = "";
					
					console.log( "currentPipeline = " + currentPipeline);
					var destinationPipeline = currentPipeline;
					console.log( "pos = " + pos);
					var pipelineName = "";
					if ( currentPipeline == "All" ) {
						// need to extract the current pipeline from the pipeline list
						var tablearray = Object.keys(pipeline_map);
						tablearray.sort();
						console.log( tablearray );
						pipelineName = tablearray[pos[0]];
					} else {
						pipelineName = currentPipeline;
					}
					destinationPipeline = pipeline_map[pipelineName];
					stage = destinationPipeline[pos[2]-1];
					
					console.log( "move " + taskid );
					console.log( "to pipelinename " + pipelineName );
					console.log( "to pipeline " + destinationPipeline );
					console.log( "and stage " + stage );
					
					var pipeline = $("#pipelinelist").val();
					var person = $("#people").val();
					var month = $("#month").val();
					var url = window.baseURL+"/chart?initialPipeline="+pipeline+"&initialPerson="+person+"&initialMonth="+month+"&moveTicket="+taskid+"&movePipeline="+encodeURIComponent(pipelineName)+"&moveStage="+encodeURIComponent(stage);
					$.ajax( url );
					//console.log( url );
				}
			} else {
				
			}
		
    }
    rd.event.rowClicked = function () {
    };
    // row was moved - event handler
    rd.event.rowMoved = function () {
	};
    // row was not moved - event handler
    rd.event.rowNotMoved = function () {
				//msg.innerHTML = 'Not moved';
    };
    // row was dropped - event handler
    rd.event.rowDropped = function ( targetRow, sourceTable, sourceRowIndex ) {
				
    };
    // row was dropped to the source - event handler
    // mini table (cloned row) will be removed and source row should return to original state
    rd.event.rowDroppedSource = function () {
    };
    /*
    // how to cancel row drop to the table
    rd.event.rowDroppedBefore = function () {
    //
    // JS logic
    //
    // return source row to its original state
    rd.rowOpacity(rd.objOld, 100);
    // cancel row drop
    return false;
    }
    */
    // row position was changed - event handler
    rd.event.rowChanged = function () {
				// get target and source position (method returns positions as array)
				// display current table and current row
				//msg.innerHTML = 'Changed: ' + pos[0] + ' ' + pos[1];
    };
		
};


// add onload event listener
if (window.addEventListener) {
		window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
		window.attachEvent('onload', redipsInit);
}
