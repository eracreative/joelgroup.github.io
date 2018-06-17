$("document").ready(function(){
    title = $("meta[name=title]").attr("content");
    description = $("meta[name=description]").attr("content");
    base_url = window.location.origin;
    imgsrc = "";
    url = window.location.href;
    social_count = new Object();
    social_count.facebook = function () {
        count_url = "https://api.facebook.com/method/links.getStats?format=json&urls="+url;
        $.getJSON(count_url, function (response) {
            console.log(response)
            $('.count.facebook').html(response[0]["share_count"])
        });
        return 0;
    };
    social_count.linkedin = function () {
        count_url = "https://www.linkedin.com/countserv/count/share?format=jsonp&callback=?&url="+url;
        $.getJSON(count_url, function (response) {
                $('.count.linkedin').html(response.count)
        });
        return 0;
    };
    social_count.pinterest = function () {
        count_url = "http://api.pinterest.com/v1/urls/count.json?callback=?&url="+url
        $.getJSON(count_url, function (response) {
                $('.count.pinterest').html(response.count)
        });
        return 0;
    };
    social_count.reddit = function () {
        count_url = 'http://www.reddit.com/api/info.json?callback=?&url='+url
        $.ajax({
            url: count_url,
            type: "GET",
            dataType: 'text/html',
            cache: true,
            success: function (response, status, error) {
                response = JSON.parse(response);
              if (response.children.count() > 0) {
                first_child = response.children[0];
                alert(first_child.score);
                $('.count.pinterest').html(first_child.score)
              }
                },
                error: function (data, status, error) {
                  console.log('error', data, status, error);
                }
        });
        return 0;
    };
    social_count.tumblr = function () {
        count_url = "https://api.tumblr.com/v2/share/stats?callback=?&url="+url;
        $.getJSON(count_url, function (response) {
            $('.count.tumblr').html(response.response.note_count)
        });
        return 0;
    };

    social_count.googleplus = function () {
        $.ajax({
          type: 'POST',
          url: 'https://clients6.google.com/rpc',
          processData: true,
          contentType: 'application/json',
          data: JSON.stringify({
            'method': 'pos.plusones.get',
            'id': url,
            'params': {
              'nolog': true,
              'id': url,
              'source': 'widget',
              'userId': '@viewer',
              'groupId': '@self'
            },
            'jsonrpc': '2.0',
            'key': 'p',
            'apiVersion': 'v1'
          }),
          success: function(response) {
              $('.count.googleplus').html(response.result.metadata.globalCounts.count)
          }
        });
        return 0;
    };
	social_data = {
        "facebook": {
            "class":"fa fa-facebook",
            "background": "#5d8aa8",
            "url": "https://www.facebook.com/sharer/sharer.php?u="+url,
            "count": social_count.facebook()
        },
        "googleplus": {
            "class":"fa fa-google-plus",
            "background": "#d34836",
            "url": "https://plus.google.com/share?url="+url,
            "count": social_count.googleplus()
        },
        "reddit": {
            "class":"fa fa-reddit",
            "background": "#2edd17",
            "url": "http://www.reddit.com/submit?url="+url+"&title="+title,
            "count": social_count.reddit()
        },
        "tumblr": {
            "class":"fa fa-reddit",
            "background": "#ec4d13",
            "url": "http://www.tumblr.com/share/link?url="+url+"&description="+description,
            "count": social_count.tumblr()
        },
        "twitter": {
            "class":"fa fa-twitter",
            "background": "#0084b4",
            "url": "https://twitter.com/intent/tweet?text="+title+"&url="+url+"&via=TWITTER-HANDLE",
            "count": 10
        },
        "pinterest": {
            "class":"fa fa-pinterest",
            "background": "#cb2027",
            "url": "https://pinterest.com/pin/create/button/?url="+url+"&description="+description+"&media="+imgsrc,
            "count": social_count.pinterest()
        },
        "linkedin": {
            "class":"fa fa-linkedin",
            "background": "#0077B5",
            "url": "https://www.linkedin.com/shareArticle?mini=true&url"+url+"&title="+title+"&summary="+description+"&source="+base_url,
            "count": social_count.linkedin()
        }
    };
    $.social_share = function(socialmedia_list) {
		$social_container = $("<div></div>").addClass("social-container")
        $social_icon = $("<div><span style='display: none;cursor: pointer;'>Show</span><span style='display: block;cursor: pointer;'>Hide</span></div>").addClass("social-icon")
        $social_icon.on("click", function () {
            $social_container.find(".social-icon").toggle();
            $(this).find("span").toggle();
            $(this).show()
        });
        $social_container.append($social_icon);
		$.each(socialmedia_list, function(index, media){
            sicon = social_data[media];
			$social_icon = $("<div></div>").addClass("social-icon");
            $link = $("<a target=\"_blank\"></a>");
            $link.attr("href", sicon.url);
			$symbol = $("<i></i>").addClass(sicon.class);
			$count = $("<div></div>").addClass("count "+media).html(sicon.count);
			$social_icon.append($symbol).append($count);
			$social_icon.css("background", sicon.background);
            $link.append($social_icon);
			$social_container.append($link)
		});
		$("body").append($social_container)
	};
});
