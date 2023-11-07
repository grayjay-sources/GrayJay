const PLATFORM = "Patreon";
const PLATFORM_CLAIMTYPE = 12;

const BASE_URL = "https://www.patreon.com";
const BASE_URL_API = "https://www.patreon.com/api";
const URL_HOME = BASE_URL + "/home";
const URL_POSTS = BASE_URL_API + "/posts";
const URL_SEARCH_CREATORS = BASE_URL_API + "/search";

const REGEX_CHANNEL_DETAILS = /Object\.assign\(window\.patreon\.bootstrap, ({.*?})\);/s
const REGEX_CHANNEL_DETAILS2 = /window\.patreon = ({.*?});/s
const REGEX_CHANNEL_URL = /https:\/\/(?:www\.)?patreon.com\/(.+)/s

const REGEX_MEMBERSHIPS = /<ul aria-label="Memberships".*?>(.*?)<\/ul>/s
const REGEX_MEMBERSHIPS_URLS = /<a href="(.*?)"/g
const REGEX_URL_ID = /https:\/\/(?:www\.)?patreon.com\/posts\/.*-(.*)\/?/s

var config = {};

let _channelCache = {};


//Source Methods
source.enable = function(conf, settings, savedState){
	config = conf ?? {};
	
}
source.getHome = function() {
	return new ContentPager([], false);
};

source.searchSuggestions = function(query) {
	return [];
};
source.getSearchCapabilities = () => {
	return {
		types: [Type.Feed.Mixed],
		sorts: [Type.Order.Chronological],
		filters: [ ]
	};
};
source.search = function (query, type, order, filters) {
	return new ContentPager([]. false);
};
source.getSearchChannelContentsCapabilities = function () {
	return {
		types: [Type.Feed.Mixed],
		sorts: [Type.Order.Chronological],
		filters: []
	};
};
source.searchChannelContents = function (channelUrl, query, type, order, filters) {
	throw new ScriptException("This is a sample");
};

source.searchChannels = function (query) {
	return new SearchChannelPager(query);
};
class SearchChannelPager extends ChannelPager {
	constructor(query) {
		super(searchChannels(query, 1))
		this.query = query;
		this.page = 1;
	}
	nextPage() {
		this.page = this.page + 1;
		this.results = searchChannels(query, this.page + 1);
		this.hasMore = this.results.length > 0;
		return this;
	}
}

//Channel
source.isChannelUrl = function(url) {
	return REGEX_CHANNEL_URL.test(url);
};
source.getChannel = function(url) {
	const channelResp = http.GET(url, {}, false);
	if(!channelResp.isOk)
		throw new ScriptException("Failed to get channel");

	let channelJson = REGEX_CHANNEL_DETAILS.exec(channelResp.body);
	let channel = null;
	if(!channelJson || channelJson.length != 2) {
	    channelJson = REGEX_CHANNEL_DETAILS2.exec(channelResp.body);
	    if(channelJson && channelJson.length == 2) {
	        channel = JSON.parse(channelJson[1]);

	        if(channel && channel.bootstrap)
	            channel = channel.bootstrap;
	        else
		        throw new ScriptException("Failed to parse channel");
	    }
	    else
		    throw new ScriptException("Failed to extract channel");
	}
	else
	    channel = JSON.parse(channelJson[1]);
	
	const result = new PlatformChannel({
		id: new PlatformID(config.name, channel?.campaign?.data?.id, config.id, PLATFORM_CLAIMTYPE),
		name: channel?.campaign?.data?.attributes?.name,
		description: channel?.campaign?.data?.attributes?.description,
		url: channel?.campaign?.data?.attributes?.url,
		subscribers: channel?.campaign?.data?.attributes?.patron_count,
		banner: channel?.campaign?.data?.attributes?.image_url,
		thumbnail: channel?.campaign?.data?.attributes?.avatar_photo_url
	});

	_channelCache[url] = result;
	return result;
};
source.getChannelContents = function(url) {
	const channel = (_channelCache[url]) ? _channelCache[url] : source.getChannel(url);
	_channelCache[url] = channel;
	return new ChannelContentPager(channel.id.value, channel);
};
class ChannelContentPager extends ContentPager {
	constructor(campaignId, channel) {
		const initialResults = getPosts(campaignId, channel);
		super(initialResults.results, true);
		this.nextPageUrl = initialResults.nextPage;
		this.hasMore = !!this.nextPageUrl;
		this.campaignId = campaignId;
		this.channel = channel;
	}
	nextPage() {
		if(!this.nextPage)
			throw new ScriptException("No next page");
		const newResults = getPosts(this.campaignId, this.channel, this.nextPageUrl) ?? [];
		this.results = newResults.results;
		this.nextPageUrl = newResults.nextPage;
		this.hasMore = !!newResults.nextPage;
		return this;
	}
}

source.getChannelTemplateByClaimMap = () => {
    return {
        //Patreon
        12: {
            0: URL_BASE + "/{{CLAIMVALUE}}"
        }
    };
};

//Video
source.isContentDetailsUrl = function(url) {
	return REGEX_URL_ID.test(url);
};
source.getContentDetails = function(url) {
	throw new ScriptException("This is a sample");
};

//Comments
source.getComments = function (url, page = 0) {
	const idMatch = REGEX_URL_ID.exec(url) ?? [];
	if(idMatch.length != 2)
		return new CommentPager([], false);
	const id = idMatch[1];
	const commentsResp = http.GET("https://www.patreon.com/api/posts/" + id + "/comments" + 
		"?include=include_replies%2Ccommenter%2Creplies%2Creplies.commenter" + 
		"&fields[comment]=body%2Ccreated%2Cvote_sum%2Creply_count" + 
		"&fields[post]=comment_count" + 
		"&fields[user]=image_url%2Cfull_name%2Curl" + 
		"&fields[flair]=image_tiny_url%2Cname" + 
		"&page[count]=10" + 
		"&sort=-created" + 
		"&json-api-use-default-includes=false" + 
		"&json-api-version=1.0", {}, true);
	if(!commentsResp.isOk)
		throw new ScriptException("Failed to get comments [" + commentsResp.code + "]");
	
	return new PatreonCommentPager(url, JSON.parse(commentsResp.body));
}
source.getSubComments = function (comment) {
	return new CommentPager([], false);
}

class PatreonCommentPager extends CommentPager {

	constructor(url, resp) {
		if(IS_TESTING)
			console.log("CommentPager resp:", resp);

		const nextUrl = resp?.links?.next;
		super([], !!nextUrl);
		this.contextUrl = url;
		this.results = this.parseResponse(resp);
		this.nextPageUrl = nextUrl;
	}

	nextPage() {
		const resp = http.GET(this.nextPageUrl, {}, true);
		if(!resp.isOk)
			throw new ScriptException("Failed to get next comment page [" + resp.code + "]")
		this.results = this.parseResponse(JSON.parse(resp.body));
		this.nextPageUrl = resp?.links?.next;
		this.hasMore = !!this.nextPageUrl;
	}

	parseResponse(resp) {
		return resp.data.map(x=> this.parseComment(x, resp)).filter(x=>x != null)
	}
	parseComment(comment, resp) {
		const commenterId = comment?.relationships?.commenter?.data?.id;
		if(!commenterId)
			return null;
		const commenter = resp.included?.find(y=>y.id == commenterId);
		if(!commenter)
			return null;

		return new PatreonComment({
			contextUrl: this.contextUrl,
			author: new PlatformAuthorLink(new PlatformID(config.platform, comment.id, PLATFORM_CLAIMTYPE), commenter.attributes.full_name, commenter.attributes.url, commenter.attributes.image_url),
			message: comment.attributes.body,
			rating: new RatingLikes(comment.attributes.vote_sum),
			date: parseInt(Date.parse(comment.attributes.created) / 1000),
			replyCount: comment.attributes.reply_count ?? 0,
			subComments: comment.relationships.replies?.data
				?.map(y=>resp.included?.find(z=>z.id == y.id))
				?.map(y=>this.parseComment(y, resp))
				?.filter(z=>z != null) ?? []
		});
	}
}

class PatreonComment extends Comment {
	constructor(obj) {
		super(obj);

		if(obj.subComments)
			this.subComments = obj.subComments;
		else
			this.subComments = [];
	}

	getReplies() {
		return new CommentPager(this.subComments, false);
	}
}

source.getUserSubscriptions = function() {
	const homePageResp = http.GET(URL_HOME, {}, true);
	if(!homePageResp.isOk)
		throw new ScriptException("Failed to get home page");

	const membershipMatch = REGEX_MEMBERSHIPS.exec(homePageResp.body) ?? [];
	if(membershipMatch.length != 2)
		throw new ScriptException("Memberships not found");
	
	const membershipHtml = membershipMatch[1];
	const membershipAnkors = membershipHtml.matchAll(REGEX_MEMBERSHIPS_URLS);

	const subs = [];
	for(let membershipAnkor of membershipAnkors) {
		const match = /.*href=\"(.*?)\"/.exec(membershipAnkor);
		if(match && match.length == 2)
			subs.push(match[1]);
	}
	return subs;
}

function getPosts(campaign, context, nextPage) {
	const dataResp = http.GET((!nextPage) ? BASE_URL_API + "/posts" + 
		"?filter[campaign_id]=" + campaign + 
		"&include=images" +
		"&filter[contains_exclusive_posts]=true" + 
		"&sort=-published_at" : nextPage, {}, true);

	if(!dataResp.isOk)
		throw new ScriptException("Failed to get posts");
	const data = JSON.parse(dataResp.body);

	if(IS_TESTING)
		console.log("getPosts data:", data);

	
	const maxDescriptionLength = 500;
	const contents = [];
	for(let item of data.data) {
		if(item?.attributes?.embed)
		contents.push(new PlatformNestedMediaContent({
				id: new PlatformID(config.name, item?.id, config.id),
				name: item?.attributes?.title,
				author: getPlatformAuthorLink(item, context),
				datetime: (Date.parse(item?.attributes?.published_at) / 1000),
				url: item?.attributes?.url,
				contentUrl: item?.attributes?.embed?.url,
				contentName: item?.attributes?.embed?.subject,
				contentDescription: item?.attributes?.embed?.description,
				contentProvider: item?.attributes?.embed?.provider,
				contentThumbnails: new Thumbnails([
					new Thumbnail(item?.attributes?.thumbnail?.large, 1)
				].filter(x=>x.url))
			}));
		else if(item?.attributes?.current_user_can_view) {
			switch(item?.attributes?.post_type) {
				case "text_only":
					if(item?.attributes?.content) {
						let description = item?.attributes?.teaser_text ?? "";
						if(item.attributes.content) {
							const text = domParser.parseFromString(item.attributes.content).text;
							if(text.length > maxDescriptionLength)
								description = text.substring(0, maxDescriptionLength) + "...";
							else
								description = text;
						}
						contents.push(new PlatformPostDetails({
							id: new PlatformID(config.name, item?.id, config.id),
							name: item?.attributes?.title,
							author: getPlatformAuthorLink(item, context),
							datetime: (Date.parse(item?.attributes?.published_at) / 1000),
							url: item?.attributes?.url,
							rating: new RatingLikes(item?.attributes?.like_count ?? 0),
							description: description,
							textType: Type.Text.HTML,
							content: item.attributes.content,
							images: [],
							thumbnails: [],
						}));
					}
				break;
				case "image_file":
					if(item?.attributes?.post_metadata && item.attributes.post_metadata.image_order) {
						const images = item.attributes.post_metadata.image_order
							.map(x=> data.included?.find(y=>y.id == x))
							.filter(x=>x && x.attributes.image_urls);
						let description = item?.attributes?.teaser_text ?? "";
						if(item.attributes.content) {
							const text = domParser.parseFromString(item.attributes.content).text;
							if(text.length > maxDescriptionLength)
								description = text.substring(0, maxDescriptionLength) + "...";
							else
								description = text;
						}

						contents.push(new PlatformPostDetails({
							id: new PlatformID(config.name, item?.id, config.id),
							name: item?.attributes?.title,
							author: getPlatformAuthorLink(item, context),
							datetime: (Date.parse(item?.attributes?.published_at) / 1000),
							url: item?.attributes?.url,
							rating: new RatingLikes(item?.attributes?.like_count),
							description: description,
							textType: Type.Text.HTML,
							content: item.attributes.content,
							images: images.map(x=>x.attributes.image_urls.original),
							thumbnails: images.map(x=>(x.attributes.image_urls.thumbnail) ? new Thumbnails([
								new Thumbnail(x.attributes.image_urls.thumbnail, 1)
							]) : null)
						}));
					}
				break;
				case "video_external_file":
					if(item?.attributes?.post_file)
						contents.push(new PlatformVideoDetails({
							id: new PlatformID(config.name, item?.id, config.id),
							name: item?.attributes?.title,
							author: getPlatformAuthorLink(item, context),
							datetime: (Date.parse(item?.attributes?.published_at) / 1000),
							url: item?.attributes?.url,
							duration: item?.attributes?.post_file?.duration,
							description: item?.attributes?.teaser_text,
							rating: new RatingLikes(item?.attributes?.like_count),
							thumbnails: new Thumbnails([
								new Thumbnail(item?.attributes?.thumbnail?.url, 1)
							]),
							video: new VideoSourceDescriptor([
								new HLSSource({
									name: "Original",
									duration: item?.attributes?.post_file?.duration,
									url: item?.attributes?.post_file?.url
								})
							])
						}));
					break;
			}
		}
	}
	return {
		results: contents.filter(x=>x != null),
		nextPage: data?.links?.next
	};
}

function getPlatformAuthorLink(item, context) {
	return new PlatformAuthorLink(new PlatformID(config.name, item?.relationships?.campaign?.data?.id, config.id, PLATFORM_CLAIMTYPE),
		context?.name,
		context?.url,
		context?.thumbnail,
		context?.subscribers ?? 0)
}

function searchChannels(query, page) {
	const dataResp = http.GET(URL_SEARCH_CREATORS + 
		"?q=" + query + 
		"&page[number]=" + page +
		"&json-api-version=1.0&includes=[]", {}, false);

	if(!dataResp.isOk)
		throw new ScriptException("Failed to search creators");
	const data = JSON.parse(dataResp.body);

	const channels = [];
	for(let item of data.data) {
		const id = item.id;
		if(id.startsWith("campaign_"))
			channels.push(new PlatformAuthorLink(new PlatformID(config.name, id.substring("campaign_".length), config.id, PLATFORM_CLAIMTYPE),
				item.attributes.name, 
				item.attributes.url, 
				item.attributes.avatar_photo_url,
				item.attributes.patron_count));
	}

	return channels.filter(x=>x != null);
}

console.log("LOADED");