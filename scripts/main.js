function checkIfPortal() {
	return (($('body').hasClass('prtlBody') || document.title.indexOf('SAP') != -1));
}

var isPortalWindow = checkIfPortal();

if (isPortalWindow) {
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		if ( request.name && request.password) {
			loginPortal(request.name, request.password);
		} else if (request.url) {
			navigate(request.url);
		} else if (request.openLink) {
			openLink(request.openLink);
			sendResponse("link opened");
		} else if (request.isPortal) {
			var result = isPortalResponse();
			sendResponse(result);
		} else if(request.portal){
			var loginDetails = getUserCredentials();
			sendResponse(loginDetails)
		}else if (request.logoff){
			logoff();
		}
	});
/**************************************************
				 Quick Login
 **************************************************/
	$(document).ready(function() {
		var ctrlDown = false, shiftDown = false;
		var ctrlKey = 17, aKey = 65, shiftKey = 16;
		$(document).keydown(function(e) {
			if (e.keyCode == ctrlKey) {
				ctrlDown = true
			}
		}).keyup(function(e) {
			if (e.keyCode == ctrlKey)
				ctrlDown = false;
		});
		$(document).keydown(function(e) {
			if (e.keyCode == shiftKey) {
				shiftDown = true
			}
		}).keyup(function(e) {
			if (e.keyCode == shiftKey)
				shiftDown = false;
		});
		$(document).keydown(function(e) {
			if (e.keyCode == aKey && shiftDown && ctrlDown) {
				var loginDetails = {
					host : window.location.host,
					port : window.location.port,
					fullUrl : trimUrl(window.location.href),
					getUser : 'quickLogin'
				};
				chrome.extension.sendMessage(loginDetails, function(response) {
					var name = response.name, pass = response.password;
					loginPortal(name, pass);
				});
			}
		});
	});
}

function navigate (url){
	window.location.href = url;
}

function openLink(link){
	if (link != "50013" && link.indexOf('?') == -1){
		var url = location.href;
		if (url.indexOf("?") != -1){
			var completeUrl = location.origin + '/' + link;
			location.href = completeUrl;
		}else{
			location.pathname = link;	
		}
	}else if (link.indexOf('?') != -1){
		if (location.search != ""){
			var newLink = link.replace('?','&'),
				completeUrl = location.href + newLink ;
			location.href = completeUrl;
		}else{
			var completeUrl = location.href + link;
				location.href = completeUrl;	
		}
	}else{
		var url = location.host,
			pos = url.indexOf(':') +1,
			oldPort = url.substring(pos),
			newUrl = url.replace(oldPort,link);
		location.href = 'http://' + newUrl;				
	}
}

function loginPortal(userName, userPass) {
	$('#logonuidfield').val(userName);
	$('#logonpassfield').val(userPass);
	if ($('#logonForm').length != 0) {
		$('#logonForm').submit();
	} else if ($('#certLogonForm').length != 0){
		$('#certLogonForm').submit()
	}
}

function getUserCredentials (){
	return {
		userName : $('#logonuidfield').val(),
		userPass : $('#logonpassfield').val(),
		host : window.location.host,
		port : window.location.port,
		url : trimUrl(window.location.href)
	};
}

function isPortalResponse() {
	return {
		'result' : isPortalWindow,
		host : window.location.host,
		port : window.location.port
	};
}
function trimUrl(url){
	if (url.indexOf('?') != -1){
		var trimmed = url.substring(0,url.indexOf('?'));
		return trimmed;	
	}else{
		return url;
	}
}
