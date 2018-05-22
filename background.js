const re = new RegExp('^https://www.hotstar.com.*');
const CODE = `setInterval(function(){localStorage.clear();},0);setInterval(function(){window.location.reload(true);},840000);`;

function getChromeTab(cb) {
	chrome.tabs.query({
		'active': true,
		'windowId': chrome.windows.WINDOW_ID_CURRENT
	}, function (tabs) {
		cb(tabs[0]);
	});
}

function inject(tab, cmd, cb) {
	chrome.tabs.executeScript(tab.id, {
		code: cmd
	}, cb);
}

function exploit(tab) {
	if (tab && re.test(tab.url)) {
		inject(tab, CODE, function (out) {
			console.log('Bam!', out);
		});
	} else {
		console.error('Oops');
	}
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	exploit(tab);
});
chrome.browserAction.onClicked.addListener(function () {
	getChromeTab(function (tab) {
		exploit(tab);
	});
});
