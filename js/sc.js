/*Если ты разработчик то не стоит смотреть этот кривой код) про все ошибки в данном коде я знаю и вскоре он будет улучшен. */

var aclasses = ["Нападение", "Оборона", "Мистицизм", "Волшебство", "Воодушевление", "Гипноз", "Сопротивление", "Преследование", "Скрытность", "Исцеление", "Гнев"];
var code = [["0","H","i","j","x","f","P","1"],["000","001","010","011","100","101","110","111"]];
var skillslist = [];
var toggle = 0;
var version = "570";
$(function() {

    $("#version").children().click(function() {
        if($(this).attr("data-status") != "1") {
            $("#version").children().attr("data-status", "0");
            $(this).attr("data-status", "1");
            $("#main").attr("class", "version-"+$(this).attr("class"))
            skillslist = [];
            version = $(this).attr("class");
            xmlParser(version);
        }
    });

	$("#basic .selection div").click(function() {
		if($(this).attr("data-status") == "0") {
			var data = "#" + $(this).parent().parent().attr("id");
			var type = $(this).attr("data-type");

			$(data).attr("class", "type" + type);
			$(data + " .name").text($(this).text());

			$(data).children().hide().next().stop(true, true).fadeIn();

			refreshBlockName(type, 0);
			checkSkills();
			getprof();
		}
	});

	$("#eferund .selection").children().click(function() {
	    if($(this).attr("data-status") == 0) {
	        $("#eferund .selection").children().attr("data-status", "0");
	        $(this).attr("data-status", "1");
    	    $("#eferund .skills").children().each(function() {
    	        if($(this).attr("class") != "eferund") {
    	            $(this).stop(true, true).hide();
    	        }
    	    });

    	    var data = $(this).attr("data-type");
    	    $("#eferund .eferund-" + data).stop(true, true).fadeIn();

    	    $("#eferund").attr("class", "null");
    	    $("#circle").attr("class", "null");
            clearColumn();
	    }
	});

	$(".return").click(function() {
		var data = "#" + $(this).parent().parent().parent().attr("id");
		refreshBlockName($(data).attr("class").charAt(4), 1);

		$(data).children().next().hide().prev().stop(true, true).fadeIn();
		$(data).attr("class", "null");

		resetBlock(data);
		getprof();
	});

	$(".cls").click(function() {
		var data = "#" + $(this).parent().parent().parent().attr("id");
		if($(this).children().html() == "" && $(".points").html() > 0 && $(this).attr("data-status") == "0") {
			$(this).attr("data-status", "1").children().stop(true, true).fadeOut();
		} else {
			$(this).attr("data-status", "0").children().stop(true, true).fadeIn();
		}
		checkPoints(data);
		togglePoints(data);
		refreshPoints();
	});
	$(".skill").hover(function() {
		var index = $(this).attr("class").split("-");
		var type = $(this).parent().parent().parent().attr("class").charAt(4);

		var aid = $(this).attr("data-q");
		if($(this).attr("data-q") > 0) {
		    $("#Skills-detail").html(skillslist[type+type+index[1]+aid]);
		} else {
		    $("#Skills-detail").html(skillslist[type+index[1]]);
		}

		var offset = $(this).offset();
		detailposition(offset);

	}, function() {
		$("#Skills-detail").hide().empty();
	});
	$(".reset").click(function() {
		var data = "#" + $(this).parent().parent().parent().attr("id");
		resetBlock(data);
	});

	$(".bSkill").hover(function() {
	    var type = $(this).parent().attr("class").split("-");
	    var sid = $(this).attr("class").split("-");
	    var aid = $(this).attr("data-status");
	    if(aid == "0") {
	        $("#Skills-detail").html(skillslist[type[1]+sid[1]]);
	    } else {
	        $("#Skills-detail").html(skillslist[type[1]+type[1]+sid[1]+aid]);
	    }

	    var offset = $(this).offset();
		detailposition(offset);
	}, function() {
		$("#Skills-detail").hide().empty();
	});
	$(".mSkill").hover(function() {
	    var type = $("#eferund").attr("class").charAt(4);
	    var sid = $("#circle").attr("class").split("-");
	    var aid = $(this).attr("data-cid");
	    if(aid == "0") {
	        $("#Skills-detail").html(skillslist[type+sid[1]]);
	    } else {
	        $("#Skills-detail").html(skillslist[type+type+sid[1]+aid]);
	    }

	    var offset = $(this).offset();
		detailposition(offset);
	}, function() {
		$("#Skills-detail").hide().empty();
	});
	$(".mSkill").click(function() {
	    var msid = $("#circle").attr("class").split("-");

		var type = $("#eferund").attr("class").charAt(4);

		if($(this).attr("data-status") == "0") {
			var cid = $(this).attr("data-cid");
			clearColumn();
			$(this).attr("data-status", "1").children().stop(true, true).fadeOut();

			$(".eferund-" + type + " .bSkill").each(function() {
			    var sid = $(this).attr("class").split("-");
				if( msid[1] == sid[1]) {
					$(this).attr("data-status", cid).children().stop(true, true).fadeOut();
				}
			});
		} else {
			clearColumn();

			$(".eferund-" + type + " .bSkill").each(function() {
			    var sid = $(this).attr("class").split("-");
				if( msid[1] == sid[1] ) {
					$(this).attr("data-status", "0").children().stop(true, true).show();
				}
			});

			$(".skill").attr("data-q", "0");
		}
		checkPointsEferund();
		checkSkills();
	});
	$(".bSkill").click(function() {
		var sid = $(this).attr("class").split("-");
		var csid = $("#circle").attr("class").split("-");

		var type = $(this).parent().attr("class").split("-");
		var status = $(this).attr("data-status");

		if(type[1] != $("#eferund").attr("class").charAt(4) || sid[1] != csid[1]) {
			clearColumn();

			$("#eferund .overlay").stop(true, true).hide().fadeIn(200);
			$("#eferund").attr("class", "type" + type[1]);
			$("#circle").attr("class", "sid-" + sid[1]);

			if(status != "0") {
				$(".mSkill").each(function(index) {
					if($(this).css("display") == "block" && status == $(this).attr("data-cid")) {
						$(this).attr("data-status", "1").children().stop(true, true).fadeOut();
					}
				});
			}
		}
	});
	$(".points").click(function() {
		resetAll();
	});
	$("#eferund .refresh").click(function() {
	    clearColumn();
	    $(".bSkill").attr("data-status", "0").children().stop(true, true).fadeIn();
        $(".skill").attr("data-q", "0");
        checkPointsEferund();
	});
	/* $(".random").click(function() {

	}); */
	$(".toggle").click(function() {
		if(toggle == 0) {
			$("#basic").hide();
			$("#options .points").hide();
			$("#eferund").stop(true, true).fadeIn();
			toggle++;
			$(".toggle").text("Назад");
		} else {
			$("#eferund").hide();
			$("#options .points").show();
			$("#basic").stop(true, true).fadeIn();
			toggle--;
			$(".toggle").text("Эферунд");
		}
	});
	$(".save").click(function() {
		$("#popup").fadeIn();
		encryptLink();
	});
	$("#popup-bg").click(function() {
	   $("#popup").fadeOut();
	});
	$("#close-alink").click(function() {
	    $("#popup").fadeOut();
	})

	var url = location.href;
    var newUrl = url.split("?");
    if(newUrl[1] != undefined && newUrl[1] != "") {
        var debugUrl = newUrl[1].replace("%23", "#");
        var alink = debugUrl.split("#");
        xmlParser(alink[0]);
        $("#main").attr("class", "version-"+alink[0]);
        $("#version").children().attr("data-status", "0");
        $("#version").find("."+alink[0]).attr("data-status", "1");

        if(alink[1] != undefined || alink[2] != undefined) {
            decryptLink(alink);
        }
    } else {
        xmlParser(version);
    }
});
function detailposition(offset) {
	var wd = $("#Skills-detail").width() + 30; //30px padding
	var hd = $("#Skills-detail").height() + 20; //20px padding

    console.log($(window).scrollTop());
	var hb = $("body").height();
	var wb = $("body").width();

	if (offset.top + hd > hb ) {
	    if (offset.left + wd > wb ) {
	        $("#Skills-detail").css({
    			"left":offset.left - wd - 6,
    			"top":hb - hd - 10
    	    }).stop(true, true).fadeIn();
	    } else {
	        $("#Skills-detail").css({
    			"left":offset.left + 54,
    			"top":hb - hd - 10
	        }).stop(true, true).fadeIn();
	    }
	} else {
	    if (offset.left + wd > wb ) {
	        $("#Skills-detail").css({
    			"left":offset.left - wd - 6,
    			"top":offset.top
    	    }).stop(true, true).fadeIn();
	    } else {
	        $("#Skills-detail").css({
    			"left":offset.left + 54,
    			"top":offset.top
	        }).stop(true, true).fadeIn();
	    }
	}
}

function resetBlock(data) {
	$(data + " .skill").attr("data-q", "0");
	$(data + " .skill").attr("data-status", "0").children().fadeIn();
	$(data + " .reset").text(0);
	checkPoints(data);
	togglePoints(data);
	refreshPoints();
}
function refreshBlockName(type, flag) {
	$("#basic .selection div").each(function() {
		if($(this).attr("data-type") ==  type) {
			if(flag == 1) {
				$(this).attr("data-status", "0").show();
			} else {
				$(this).attr("data-status", "1").hide();
			}
		}
	});
}
function refreshPoints() {
	var pnt = 18 - ($("#basic-1 .reset").text()*1 +
						$("#basic-2 .reset").text()*1 +
							$("#basic-3 .reset").text()*1 );
	$(".points").text(pnt);
}
function resetAll() {
	$("#basic .skill").attr("data-q", "0");
	$("#basic .skill").attr("data-status", "0").children().show();

	$("#basic .tog").each(function() {
	    var point = $(this).attr("data-point");
		$(this).children().text(point);
	})
	$("#basic .passive .skill").each(function() {
		var point = $(this).attr("data-point");
		$(this).children().text(point);
	});
	$("#basic .reset").text("0");
	refreshPoints();

	$("#basic .skills").hide().prev().stop(true, true).fadeIn();
	$("#basic .selection").children().attr("data-status", "0").stop(true, true).fadeIn();
	$("#basic").children().attr("class", "null"); // ненужный кусок кода, но на всякий случай пусть будет

	getprof();
}
function togglePoints(data) {
	var allActive = 0;
	var preActive = 0;
	$(data + " .tog").each(function() {
		if($(this).attr("data-status") == "1") {
			allActive++;
		}
	});
	$(data + " .tog").each(function(index) {

		if( $(this).attr("data-status") == "1") {
			preActive++;
		}
		var postActive = allActive*1 - preActive*1;
		var activeActive = $(data + " .reset").text()*1 - postActive;

		if($(this).attr("data-status") == "1" && $(this).attr("data-point")*1 >= activeActive) {
			$(this).attr("data-status", "0").children().stop(true, true).fadeIn();
			checkPoints(data);
			$(this).children().text($(this).attr("data-point")*1 - activeActive+1);
		} else {
			$(this).children().text($(this).attr("data-point")*1 - $(data + " .reset").text()*1);
		}

		if($(this).children().text() <= 0) {
			$(this).children().text("");
		}
	});
	var treset = $(data + " .reset").text()*1;
	$(data + " .passive .skill").each(function() {
	    var tpoint = $(this).attr("data-point") - treset;
		if(tpoint > 0) {
		    $(this).children().html(tpoint).stop(true, true).fadeIn();
		} else {
		    $(this).children().text("").stop(true, true).fadeOut();
		}
	});
}
function checkPoints(data) {
	var counter = 0;
	$(data + " .skill").each(function() {
		if($(this).attr("data-status") == "1") {
			counter++;
		}
		$(data + " .reset").text(counter);
	});
}
function checkSkills() {
	$(".bSkill").each(function() {
		if($(this).attr("data-status") != "0") {
			var ctype = $(this).parent().attr("class").split("-");
			var sid = $(this).attr("class").split("-");
			var cstatus = $(this).attr("data-status");
			$("#basic .type" + ctype[1] + " .sid-" + sid[1]).each(function() {
				$(this).attr("data-q", cstatus);
			});
		}
	});
}
function checkPointsEferund() {
    var counter = 0;
    $("#eferund .bSkill").each(function() {
        if($(this).attr("data-status") > "0") {
            counter++;
        }
    });
    $("#eferund .refresh").children().text(counter);
}

function getprof() {
	var prof = "";
	$("#basic-1 .selection div").each(function(index) {
		if($(this).attr("data-status") == "1") {
			prof = prof + $(this).attr("data-type");
		}
	});
	if(prof.length == 3) {
    	$.ajax({
    		type: "GET",
    		url: "/xml/classes.xml?100",
    		dataType: "xml",
    		success: function(xml){
    	        $(xml).find("class").each(function() {
                	if($(this).find("index").text() == prof) {
                    	$("#className").text( $(this).find("name").text() );

                    }
    	        });
    		}
    	});
	} else {
	    $("#className").text("Не определён");
	}
}

function xmlParser(version) {
    var type = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "g"];

    for(var count = 0; count < type.length; count++) {
        ajaxParser(version, type[count]);
    }
}
function ajaxParser(version, type) {
    $.ajax({
		type: "GET",
		url: "/xml/" +version+ "/type" +type+ ".xml?106",
		dataType: "xml",
		success: function(xml){
	        $(xml).find("skill").each(function() {
            	var index = $(this).find("index").text();
            	var desc = $(this).find("desc").text();
            	skillslist[type+index] = desc;
        	});
		}
	})
}

function clearColumn() {
	$(".mSkill").each(function() {
		if($(this).attr("data-status") == "1" && $(this).attr("data-cid") != "0") {
			$(this).attr("data-status", "0").children().stop(true, true).show();
		}
	});
}

function encryptLink() {
    var cryptLink = "";

	for(var i = 1; i <=3; i++) {
	    var preLink = "";
    	var attr = "";

    	var type = $("#basic-"+i).attr("class").charAt(4);
		if($("#basic-"+i).attr("class") != "null") {
		    if(cryptLink != "") {
		        cryptLink = cryptLink + ":";
		    }
			cryptLink = cryptLink + type;
			$("#basic-"+i+" .cls.skill").each(function(index) {
        		if($(this).attr("data-status") == 1) {
					preLink = preLink + 1;
				} else {
					preLink = preLink + 0;
				}
			});
			for(var count = 0; count <= preLink.length; count++) {
    			var symbol = preLink[count];
    			if(attr.length != 3) {
    				attr = attr + symbol;
    			} else {
    				for(var x = 0; x <= 7; x++) {
    					if(attr == code[1][x]) {
    						cryptLink = cryptLink + code[0][x];
    						attr = "";
    						attr = attr + symbol;
    					}
    				}
    			}
    		}
		}
	}
	console.log(cryptLink);
	if($("#eferund .refresh").children().text() != 0) {
	    cryptLink = cryptLink + "#";
    	var bool = 0;
    	for(var a = 0; a <=9; a++) {
    	    $(".eferund-" + a + " .bSkill").each(function(index) {
    	        var b = $(this).attr("data-status");
    	        if (b != 0 && bool == 1) {
    	            cryptLink = cryptLink + ":";
    	        }
    	        if (b != 0 && bool == 0) {
    	            bool++;
    	        }
    	        if(b != 0) {
    	            cryptLink = cryptLink + a + index + b;
    	        }
    	    });
    	}
    	$(".eferund-g .bSkill").each(function(index) {
    	    var b = $(this).attr("data-status");
            if (b != 0 && bool == 1) {
                cryptLink = cryptLink + ":";
            }
            if (b != 0 && bool == 0) {
                bool++;
            }
            if(b != 0) {
                cryptLink = cryptLink + "g" + index + b;
            }
    	});
	}
	if(cryptLink != "") {
	    $("#alink").val("https://aa.cloudu.ru/calc?" +version+ "#" +cryptLink).select();
	} else {
	    $("#alink").val("https://aa.cloudu.ru/calc?" +version).select();
	}
}

function decryptLink(alink) {
	if(alink[1] != undefined && alink[1] != "") {
	    var prelink = alink[1].split(":");

    	for(var i = 1; i <= 3; i++) {
    	    var skills = "";
    	    if (prelink[i-1] != null) {
    	        if(prelink[i-1].charAt(0) == "g") {
    			    $("#basic-" + i + " .data .name").html(aclasses[10]);
    			} else {
    			    $("#basic-" + i + " .data .name").html(aclasses[prelink[i-1].charAt(0)]);
    			}

    	        $("#basic-"+i).attr("class", "type"+prelink[i-1].charAt(0))
    			.children().hide().next().show();

    			for(var pre = 1; pre <= prelink[i-1].length; pre++) {
    			    var symbol = prelink[i-1].charAt(pre);
    			    for(var prex = 0; prex <= 7; prex++) {
    					if(symbol === code[0][prex]) {
    						skills = skills + code[1][prex];
    					}
    				}
    			}
        		for(var s = 1; s <= 18; s++) {
        			if (skills.charAt(s-1) != 0) {
        			    $("#basic-"+i+" .sid-"+s).attr("data-status", "1").children().hide();
        			}
        		}
        		checkPoints("#basic-" + i);
    			refreshPoints();
    			togglePoints("#basic-" + i);
    			refreshBlockName(prelink[i-1].charAt(0), 0);
    			getprof();
    	    }
    	}
	}
	if(alink[2] != undefined && alink[2] != "") {
	    var efen = alink[2].split(":");

	    for(var e = 0; e < efen.length; e++) {
	        var type = efen[e].charAt(0);
	        var id = efen[e].charAt(1);
	        var aid = efen[e].charAt(2);
	        $(".eferund-" + type + " .bSkill").each(function(index) {
	           if(index == id) {
	               $(this).attr("data-status", aid).children().hide();
	           }
	        });
	    }
	    checkPointsEferund();
	    checkSkills();
	}
}
//copyright © Tikimim 2018
