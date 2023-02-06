var originalAuthorId;
var originalAuthorUsername;
var previousAuthorId;
var lastUrl;
var lastRepliesUrl;
var tootReplyHtml;

function loadTootAccount(url, element) {
    var xmlhttp = new XMLHttpRequest();
    if (url.indexOf('/api/v') == -1) {
        if (url.indexOf('http') != 0) {
            // console.log("This doesn't look like a valid URL: " + url);
            url = 'https://' + url;
        }
        var splitUrl = url.split('/');
        // url = splitUrl[0] + '//' + splitUrl[2] + '/api/v1/statuses/';
	// GOAL: 'https://mastodon.social/api/v1/accounts/lookup?acct=patrickmcurry'
	url = splitUrl[0] + '//' + splitUrl[2] + '/api/v1/accounts/lookup?acct=' + splitUrl[3].replace('@','');

	/*** TODO:
        // support different URL syntaxes for links to toots
        if (splitUrl[3] && splitUrl[3] == 'users') {
            url += splitUrl[6];
        }
        else if (splitUrl[3] && splitUrl[3] == 'web') {
            url += splitUrl[5];
        } else {
            url += splitUrl[4];
        }
	***/

        lastUrl = url;
        // console.log(url);
    }

    xmlhttp.onreadystatechange = function() {
        //console.log('xmlhttp.onreadystatechange()');
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            loadTootAccountToots(myArr,element);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function loadTootAccountToots(arr, element) {
    url = arr.url;
    urlPieces = url.split('/');
    url = urlPieces[0] + urlPieces[1] + '//' + urlPieces[2] + '/api/v1/accounts/' + arr.id + '/statuses';
    console.log(url);

    var xmlhttp = new XMLHttpRequest();
    if (url.indexOf('/api/v') == -1) {
        if (url.indexOf('http') != 0) {
            // console.log("This doesn't look like a valid URL: " + url);
            url = 'https://' + url;
        }
	/***
        var splitUrl = url.split('/');
        url = splitUrl[0] + '//' + splitUrl[2] + '/api/v1/statuses/';
        // support different URL syntaxes for links to toots
        if (splitUrl[3] && splitUrl[3] == 'users') {
            url += splitUrl[6];
        }
        else if (splitUrl[3] && splitUrl[3] == 'web') {
            url += splitUrl[5];
        } else {
            url += splitUrl[4];
        }
        lastUrl = url;
        // console.log(url);
	***/
    }

    xmlhttp.onreadystatechange = function() {
        //console.log('xmlhttp.onreadystatechange()');
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            displayTootAccount(myArr,element); // was displayTootReplies
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function loadTootThread(url, element) {
    var xmlhttp = new XMLHttpRequest();
    if (url.indexOf('/api/v') == -1) {
        if (url.indexOf('http') != 0) {
            // console.log("This doesn't look like a valid URL: " + url);
            url = 'https://' + url;
        }
        var splitUrl = url.split('/');
        url = splitUrl[0] + '//' + splitUrl[2] + '/api/v1/statuses/';
        // support different URL syntaxes for links to toots
        if (splitUrl[3] && splitUrl[3] == 'users') {
            url += splitUrl[6];
        }
        else if (splitUrl[3] && splitUrl[3] == 'web') {
            url += splitUrl[5];
        } else {
            url += splitUrl[4];
        }
        lastUrl = url;
        // console.log(url);
    }

    xmlhttp.onreadystatechange = function() {
        //console.log('xmlhttp.onreadystatechange()');
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            displayToot(myArr,element);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function loadTootReplies(arr, element) {
    var xmlhttp = new XMLHttpRequest();

    // TODO: figure out the URL
    // var url = 'https://mastodon.social/api/v1/statuses/108195817029536656/context';
    var url = lastUrl + '/context';
    if (lastRepliesUrl == url) {
        // TODO: this is hinky when considering multiple different ways you can request original toot URL
        // return;
    }
    lastRepliesUrl = url;

    xmlhttp.onreadystatechange = function() {
        //console.log('xmlhttp.onreadystatechange()');
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            displayTootReplies(myArr,element);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function displayTootAccount(arr, element) {
    // TEMP
    var superArr = arr;
    arr = superArr[0];
    // END TEMP
    // var displayJson = JSON.stringify(arr, null, 2);
    var instanceName = arr.url.replaceAll('http://','').replaceAll('https://','').split('/')[0];
    originalAuthorId = arr.account.id;
    previousAuthorId = arr.account.id;
    originalAuthorUsername = arr.account.username;
    var displayToot;
    if (typeof element === 'string') {
        displayToot = document.getElementById(element);
    }
    // backup the reply template, then remove old replies
    if (!tootReplyHtml) {
        tootReplyHtml = document.getElementById('displayToot').outerHTML + '';
    }
    // document.getElementsByClassName('tootReplies')[0].innerHTML = '';
    function ge(cn) { return displayToot.getElementsByClassName(cn)[0]; }

    if (showReblogs) {
	if (arr.reblog != null) {
            // TODO: code to display reblogs
        }
    } else {
	if (arr.reblog != null) {
            document.getElementById('displayToot').style.display = 'none';
        }

    // ge('authorLink').href = arr.account.url;
    ge('avatarImg').src = '';
    ge('avatarImg').src = arr.account.avatar;
    ge('displayNameSpan').innerHTML = arr.account.display_name;
    ge('userNameSpan').innerHTML = '@' + arr.account.username;
    ge('instanceNameSpan').innerHTML = '@' + instanceName;
    ge('content').innerHTML = formatToot(arr.content);
    ge('createdAtLink').innerHTML = arr.created_at;
    ge('createdAtLink').href = arr.url;
    var links = document.getElementsByClassName('authorLink');
    for (var i=0; i < links.length; i++) {
        links[i].href = arr.account.url;
    }

    }

    // loadTootReplies(superArr, document.getElementsByClassName('tootReplies')[0]);

    displayTootReplies(superArr, document.getElementsByClassName('tootReplies')[0]);
    // console.log('Displayed original toot');
}

// TODO: display or link to attachments
function displayToot(arr, element) {
    // var displayJson = JSON.stringify(arr, null, 2);
    var instanceName = arr.url.replaceAll('http://','').replaceAll('https://','').split('/')[0];
    originalAuthorId = arr.account.id;
    previousAuthorId = arr.account.id;
    originalAuthorUsername = arr.account.username;
    var displayToot;
    if (typeof element === 'string') {
        displayToot = document.getElementById(element);
    }
    // backup the reply template, then remove old replies
    if (!tootReplyHtml) {
        tootReplyHtml = document.getElementById('displayTootTemplate').outerHTML + '';
    }
    document.getElementsByClassName('tootReplies')[0].innerHTML = '';
    function ge(cn) { return displayToot.getElementsByClassName(cn)[0]; }
    // ge('authorLink').href = arr.account.url;
    ge('avatarImg').src = '';
    ge('avatarImg').src = arr.account.avatar;
    ge('displayNameSpan').innerHTML = arr.account.display_name;
    ge('userNameSpan').innerHTML = '@' + arr.account.username;
    ge('instanceNameSpan').innerHTML = '@' + instanceName;
    ge('content').innerHTML = formatToot(arr.content);
    ge('createdAtLink').innerHTML = arr.created_at;
    ge('createdAtLink').href = arr.url;
    var links = document.getElementsByClassName('authorLink');
    for (var i=0; i < links.length; i++) {
        links[i].href = arr.account.url;
    }
    loadTootReplies(arr, document.getElementsByClassName('tootReplies')[0]);
    // console.log('Displayed original toot');
}

var combineRepliesFromSameAuthor = false; // don't combine when displaying an account
var showReplies = true;
var showReblogs = false;

// TODO: using this function when it should be its own displayTootStream or displayTootsFromAccount
function displayTootReplies(threadArr, element) {
    // var displayJson = JSON.stringify(arr, null, 2);
    var arr;
    var baseElement;
    var indentCount = 0;
    var previousTootId = -1;
    if (typeof element === 'string') {
        baseElement = document.getElementById(element);
    } else {
        baseElement = element;
    }
    //console.log(baseElement);

    var streamArr;
    if (threadArr.descendants) {
	streamArr = threadArr.descendants;
    } else {
	streamArr = threadArr;
    }

    // starting with 1 to skip re-displaying first element
    for (var i=1; i < streamArr.length; i++) {
        arr = streamArr[i];
	// skip retweets/retoots/reposts...
	if (!showReblogs && arr.reblog != null) {
		// don't show reblogs if desired to skip
		continue;
	} else {
		// TODO: code to display reblogs
	}
	if (!showReplies && (arr.in_reply_to_id != null || arr.in_reply_to_account_id != null)) {
		// don't show replies
		continue;
	} else if (!showReplies && arr.content.replace('<p>','').replace('<span>','').indexOf('@') == 0) {
		// don't show posts that look like replies either
		continue;
	} else {
		// no special code needed
	}
        var instanceName = arr.url.replaceAll('http://','').replaceAll('https://','').split('/')[0];
        // var displayToot;
        // if (typeof element === 'string') {
        //    displayToot = document.getElementById(element);
        // }
        var displayToot = document.createElement('div');
        displayToot.innerHTML = tootReplyHtml;
        // console.log(displayToot);
        function ge(cn) { return displayToot.getElementsByClassName(cn)[0]; }
        ge('content').innerHTML = formatToot(arr.content);
        // console.log(displayToot);
        baseElement.appendChild(displayToot);
        // when someone else comments and jumps into the thread, show their info
        if ( !(combineRepliesFromSameAuthor && arr.account.id == previousAuthorId) ) {
            /***
            // && arr.account.id != originalAuthorId || arr.account.username != originalAuthorUsername || arr.in_reply_to_account_id != originalAuthorId ) {
            // the API returns the list of replies chronologically, like classic Twitter
            // to make them threaded, would need to re-order each toot, putting it under and indenting to the one it replies to
            if (arr.in_reply_to_id != previousTootId) {
                indentCount++;
            } else {
                indentCount--;
            }
            ***/
            displayToot.style.marginLeft = (indentCount*10) + 'px';
            ge('author').style.display = 'grid';
            ge('authorLink').href = arr.account.url;
            ge('avatarImg').src = arr.account.avatar;
            ge('displayName').innerHTML = arr.account.display_name;
            ge('userNameSpan').innerHTML = '@' + arr.account.username;
            ge('instanceNameSpan').innerHTML = '@' + instanceName;
            ge('createdAtLink').innerHTML = arr.created_at;
            ge('createdAtLink').href = arr.url;
        } else {
            ge('author').style.display = 'none';
        }
        previousAuthorId = arr.account.id;
        previousTootId = arr.id;
        displayToot.style.display = 'block';
    }
    // console.log('Displayed ' + threadArr.descendants.length + ' replies');
    // hide all but the top author box
    var authorBoxes = document.getElementsByClassName('author');
    var oneVisible = false;
    for (var i=0; i < authorBoxes.length; i++) {
        if (oneVisible) {
            authorBoxes[i].style.display = 'none';
        }
        if (isVisible(authorBoxes[i])) {
            oneVisible = true;
        }
    }
}

function isVisible(obj) {
    return obj.offsetWidth > 0 && obj.offsetHeight > 0;
}

function formatToot(html) {
    if (html.indexOf('<p>') != 0) {
        html = '<p>' + html + '</p>';
    }
    html = html.replaceAll('<br>','</p><p>');
    return html;
}

function getHashVariable(variable) {
    query = window.location.hash.substr(1);
    vars = query.split('&');
    for (i = 0; i < vars.length; i++) {
        pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    //console.log('Hash variable %s not found', variable);
    return("");
}

// Examples:
// loadToot('https://mastodon.social/@patrickmcurry/108195817029536656','displayToot'); // Load via user-face URL
// loadToot('https://mastodon.social/api/v1/statuses/108195817029536656','displayToot'); // Load via API URL
// https://mastodon.social/api/v1/accounts/lookup?acct=patrickmcurry

function processHash() {
    var url = getHashVariable('url');
    if (url != '' && url != lastUrl) {
        lastUrl = url;
        loadTootAccount(url,'displayToot');
    } else {
        // loadTootThread('https://mastodon.social/@patrickmcurry/108139550806578067','displayToot');
        // loadTootAccount('https://mastodon.social/api/v1/accounts/821111/statuses','displayToot');
	loadTootAccount('https://phpc.social/api/v1/accounts/lookup?acct=grmpyprogrammer', 'displayToot');
    }
}

window.onload = processHash;
window.onhashchange = function(){ location.reload(); }
// processHash;

