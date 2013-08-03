	$(document).ready(function() {
		getLinksFromBackground();
		getServersFromBackground();
		addActionsMenu();
		addSettingsButton();
	});
	
	var params = {
		currntUser: {},
		shouldNavigate: true,
		isPortal: false,
		millisecondsPerDay: 1000 * 60 * 60 * 24,
		bgPage : chrome.extension.getBackgroundPage(),
		oneDayAgo : {}
	};
	
	params.oneDayAgo = (new Date()).getTime() - params.millisecondsPerDay;
	
	function getMachineUsers(currentMachine,YPosition) {
		if ($('#' + currentMachine + 'Users').children().length != 0) {
			$('#' + currentMachine + 'Users').empty();
		}
		var currentMachineId = currentMachine -1;
		if (currentMachineId || currentMachineId == 0) {
			var allServers = JSON.parse(params.bgPage.localStorage.getItem('portalServers')),
				users = allServers[currentMachineId][1].users,
				ul = $('#' + currentMachine + 'Users'),
				name,
				button,
				userId;
			for (userId in users) {
				if(users.hasOwnProperty(userId)){
					name = users[userId].name;
					button = $('<button data-user="' + userId + '"data-machine="'+ currentMachine +'"class="userNameButton">' + name + '</button>');
					ul.append(button);	
				}
			}
			$('.userNameButton').bind('click', utils.loginToPortal);
			var topPosition = YPosition -15;
			ul.css({"top":topPosition});
			ul.show();
		}
	}
	
	function addActionsMenu(){
		var actionsDiv = $('<div id="actionsDiv">Actions</div>'),
			cont = $('#popupContent'),
			clearCookies = $('<span class="actionButton" style="display:none" id="clearCookies">Clear Cookies</span>'),
			clearCache =  $('<span class="actionButton" style="display:none" id="clearCache">Clear Cache</span>'),
			clearBoth =  $('<span class="actionButton" style="display:none" id="clearCache">Clear Cache & Cookies</span>'),
			icon = $('<span class="dropDownIcon"></span>');
		actionsDiv.append(icon, clearCache,clearCookies,clearBoth);
		actionsDiv.hover(function(){
			$(this).children('.actionButton').animate({height:'toggle'},300);
		},function(){
				if ($('#actionsDiv').hasClass('displayWaiting')){
					setTimeout(utils.hideActions,1000);
				}else{
					$(this).children('.actionButton').animate({height:'toggle'},300);
				}			
			});
		clearCookies.bind('click', utils.actions.clearCookies);
		clearCache.bind('click', utils.actions.clearCache);
		clearBoth.bind('click',utils.actions.clearBoth);
		cont.append(actionsDiv);
	}
	
	function getServersFromBackground() {
		var allServersString = params.bgPage.localStorage.getItem('portalServers'), 
			allServers = JSON.parse(allServersString), 
			cont = $('#popupContent'), 
			select = $('<div id="serversSelect">Portals</div>'),
			icon = $('<span class="dropDownIcon"></span>'),
			i;
		select.append(icon);
		params.allServers = allServers;
		for (i = 0; i < allServers.length; i++) {
			var host = allServers[i][1].host,
				port = allServers[i][1].port,
				fullUrl = allServers[i][1].fullUrl,
				option = $('<span style="display:none" id="' + allServers[i][0] + '" class="singleMachine" data-url="' + fullUrl + '">' + host + ':' + port + '</span>'),
				ul = $('<ul id="' + allServers[i][0] + 'Users" class="machineUsers" style="display:none"></ul>');
			option.append(ul);
			select.append(option);
		}
		cont.append(select);
		$('.singleMachine').bind('click', utils.openPortalUrl);
		select.hover(function(){
			var obj = $(this);
			obj.css('position','absolute');
			obj.animate({height: '280px'},5,function(){
					$(this).css('position',"");
					if ($(this).children().length >9){
						$(this).css("overflow-y","scroll");
					}
				});
			obj.children('.singleMachine').show();
			},
		function(){
			var obj = $(this);
			obj.animate({height: '25px'},400,function(){$(this).css("overflow-y","hidden");});
			obj.children('.singleMachine').hide();
		});
		
		$('.singleMachine').hover(function() {
			var position = $(this).position().top - $(this).scrollTop();
			getMachineUsers(this.id,position);
		}, function() {
			$(this).children('ul').hide();
		});	
	}
	
	function getLinksFromBackground() {
		var allLinksString = params.bgPage.localStorage.getItem('portalLinks'),
			allLinks = JSON.parse(allLinksString),
			title = $('<h5 class="linksTitle">Quick Links:</h5>'),
			cont = $('#linksDiv'),
			group,link;
		cont.append(title);
		for (group in allLinks) {
			if (allLinks.hasOwnProperty(group)){
				var groupSpan = $('<span class="groupSpan" id="' + group + '">' + group + '</span>'),
					groupIcon = $('<span class="groupIcon"><span>'),
					groupList = $('<ul id="' + group + 'List" class="groupList" style="display:none"></ul>');
				groupSpan.append(groupIcon, groupList);
				for (link in allLinks[group]) {
					if (allLinks[group].hasOwnProperty(link)){
						var listItem;
						if (allLinks[group][link].port == undefined && allLinks[group][link].query == undefined){
							listItem = $('<li class="linkListItem" data-path="' + allLinks[group][link].path + '">' + allLinks[group][link].name + '</li>');	
						}else if (allLinks[group][link].query == undefined) {
							listItem = $('<li class="linkListItem" data-path="' + allLinks[group][link].port + '">' + allLinks[group][link].name + '</li>');
						}else {
							listItem = $('<li class="linkListItem" data-path="' + allLinks[group][link].query + '">' + allLinks[group][link].name + '</li>');
						}
						groupList.append(listItem);	
					}
				}
				cont.append(groupSpan);	
			}
		}
		function show () {
			$(this).children('ul').animate({height:'toggle'},300);
		}
		function hide() {
			$(this).children('ul').animate({height:'toggle'},200);
		}
		var config = {
			over: show,     
			timeout: 500,
			out: hide
	    };
		$('.groupSpan').hoverIntent(config);
		$('.linkListItem').bind('click', utils.openPortalLink);
	}
	function addSettingsButton(){
		var cont = $('#popupContent'),
			settings = $('<span id="settingsButton" title="Set Quick Login User"></span>'),
			about = $('<span id="aboutButton" title="About SIN"></span>');
		settings.bind('click',openSettings);
		about.bind('click',openAbout);
		cont.append(settings, about);
	}
	function openSettings(){
		if ($('#settingsDiv').length == 0){
		var topDiv = $('<div id="settingsDiv"></div>'),
			quickUser = $('<div id="quickUser"></div>'),
			p = $('<p class="selectUserText">Enter user details for quick login</p>'),
			name = $('<span>User Name:</span><input tabindex=0 class="settingInput" type="text" id="userName"/>'),
			password = $('<span>User Password:</span><input tabindex=0 class="settingInput" type="text" id="userPassword"/></br>'),
			save = $('<input type="button" class="settingButton" tabindex=0 value="Save"/>'),
			cancel = $('<input type="button" class="settingButton" tabindex=0 value="Cancel"/>');
			save.bind('click',utils.saveQuickLogin);
			cancel.bind('click',function(){
				$('#settingsDiv').hide();
				$('#popupContent').show();
			});
			quickUser.append(p,name,password,save,cancel);
			topDiv.append(quickUser);
			$('#popupContent').hide();
			$('body').append(topDiv);
			$("#userName").focus();
		}else{
			$('#settingsDiv').show();
			$('#popupContent').hide();
		}
	}
	
	/*************************************************
	 *					UTILS 
	**************************************************/
	
	var utils = {
		hideActions : function (){
			$('#actionsDiv').mouseleave();
		},
		openPortalLink : function (){
			var link = $(this).attr('data-path');
			chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.sendMessage(tab.id, {openLink : link}, function(response){
						if(!response){
							utils.openLinkAndPortal(link);
						}
					});					
			});	
		},
		actions : {
			clearCookies : function() {
				var actionsDiv = $("#actionsDiv");
				actionsDiv.attr("data-content","clearing browser cookies...").addClass("displayWaiting");
				chrome.browsingData.remove({
					"since" : params.oneDayAgo
				}, {
					"cookies" : true
				}, function() {
					var actionsDiv = $("#actionsDiv");
					actionsDiv.attr("data-content","browser cookies cleared.");
					setTimeout(utils.removeWaiting,1500);
				});
			},
			clearCache : function() {
				var actionsDiv = $("#actionsDiv");
				actionsDiv.attr("data-content","clearing browser cache...").addClass("displayWaiting");
				chrome.browsingData.remove({
					"since" : params.oneDayAgo
				}, {
					"appcache" : true,
					"cache" : true
				}, function() {
					var actionsDiv = $("#actionsDiv");
					actionsDiv.attr("data-content","browser cache cleared.");
					setTimeout(utils.removeWaiting,1500);
				});
			},
			clearBoth : function() {
				var actionsDiv = $("#actionsDiv");
				actionsDiv.attr("data-content","clearing browser cookies and cache...").addClass("displayWaiting");
				chrome.browsingData.remove({
					"since" : params.oneDayAgo
				}, {
					"appcache" : true,
					"cache" : true,
					"cookies" : true
				}, function() {
					var actionsDiv = $("#actionsDiv");
					actionsDiv.attr("data-content","cookies and cache cleared.");
					setTimeout(utils.removeWaiting,1500);
				});
			}
		},
		removeWaiting : function removeWaiting (){
			var actionsDiv = $("#actionsDiv");
			actionsDiv.removeClass("displayWaiting");	
		},
		isSamePortal : function (currentMachineId, host, port) {
			var machineUrl = params.allServers[currentMachineId][1].fullUrl;
			return (machineUrl.indexOf(host) != -1 && machineUrl.indexOf(port) != -1); 
		},
		loginToPortal : function(){
			params.shouldNavigate = false;
			var id = $(this).attr('data-machine');
			if(id != 1){
				params.bgPage.portalLogin.setServerToFirst(id);
			}
			var currentMachineId = $(this).attr('data-machine') -1,
				userId = $(this).attr('data-user');
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendMessage(tab.id, {
					isPortal : 'check'
				}, function(response) {
					if (response) {
						params.isPortal = response.result;
						var samePortal = utils.isSamePortal(currentMachineId, response.host, response.port);
						if (params.isPortal && params.isPortal == true && samePortal == true) {
							params.currentUser = utils.getUser(userId, currentMachineId);
							chrome.tabs.getSelected(null, function(tab) {
								user = params.currentUser;
								chrome.tabs.sendMessage(tab.id, user, function() {
								});
								window.close();
							});
						} else {
							var url = params.allServers[currentMachineId][1].fullUrl,
								loginPath = "?j_user=" + params.allServers[currentMachineId][1].users[userId].name + "&j_password=" + params.allServers[currentMachineId][1].users[userId].password,
								fullUrl = url + loginPath;
							utils.openTab(fullUrl);
						}
						setTimeout(utils.setToTrue, 700);
					} else {
						var url = params.allServers[currentMachineId][1].fullUrl,
							loginPath = "?j_user=" + params.allServers[currentMachineId][1].users[userId].name + "&j_password=" + params.allServers[currentMachineId][1].users[userId].password,
							fullUrl = url + loginPath;
						utils.openTab(fullUrl);
					}
				});
			});
		},
		openPortalUrl : function(){
			if (params.shouldNavigate) {
				params.bgPage.portalLogin.setServerToFirst(this.id);
				var portalUrl = $(this).attr('data-url'),currentTabUrl,currentTabId;
				utils.openTab(portalUrl);				
			}	
		},
		setToTrue : function (){
			params.shouldNavigate = true;
		},
		getUser : function (userId, machineId) {
			var allServers = JSON.parse(localStorage.getItem('portalServers')), 
			usersObj = allServers[machineId][1].users;
			return usersObj[userId];
		},
		saveQuickLogin : function(){
			var name = $('#userName').val(),
				password = $('#userPassword').val(),
				users = JSON.parse(params.bgPage.localStorage.getItem('portalUsers'));
			if(name !="" && password !=""){
				users.user1.name = name;
				users.user1.password = password;
				params.bgPage.localStorage.setItem('portalUsers', JSON.stringify(users));
				$('#settingsDiv').hide();
				$('#popupContent').show();
			}else{
				alert('please insert user details.');
			}
		},
		openTab:function(portalUrl){
			var currentTabUrl, currentTabId;
				chrome.tabs.getSelected(function(tab) {
				currentTabUrl = tab.url;
				currentTabId = tab.id;
				if (currentTabUrl.indexOf("chrome://newtab/") != -1){
					chrome.tabs.update(currentTabId,{'url':portalUrl},function(){});
				}else{
					chrome.tabs.create({
						'url' : portalUrl
					});	
				}
			});
		},
		openLinkAndPortal: function(link){
			var firstMachineUrl = $('#1').attr('data-url'),
			fullUrl = firstMachineUrl.replace('irj/portal',link);
			utils.openTab(fullUrl);			
		}
		
	};
