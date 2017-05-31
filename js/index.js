var View = {

  activeSide : '#side1',

  feedContainers : {
    $side1: $('#side1'),
    $side2: $('#side2')
  },

  switchActiveSide : function() {
    this.activeSide = this.activeSide === '#side2' ? '#side1' : '#side2';
  },

  sourceSlider : {
    sliderInitValue: 50,
    sliderDirction: "",
    listenForSliderDirection: function() {
      $('#source-slider').on('change', function(){
        if ($(this).val() >= View.sourceSlider.sliderInitValue) {
          View.sourceSlider.sliderDirction = 'right';
        } else {
          View.sourceSlider.sliderDirction = 'left';
        }
        View.sourceSlider.sliderInitValue = $(this).val();
        console.log(View.sourceSlider.sliderDirction);
      });
    }
  }

};

var State = {
  currentPublication : 'null'
}

var FEED_DIRECTORY = {

  /*
  The Guardian - implemented
  The Independent
  The Mirror
  The Metro
  Financial Times
  The Times - no rss 
  Daily Telegraph - http://www.telegraph.co.uk/news/rss.xml
  The Sun
  Daily Mail - implemented
  Daily Star
  Daily Express- http://feeds.feedburner.com/daily-express-news-showbiz?format=xml handle pics
   */
  'guardian'  : {
    mainStories : {
      rssUrl : 'https://www.theguardian.com/theguardian/mainsection/topstories/rss',
      $cacheElement : $('#cache .src1')
    }
  },
  'dailyTelegraph' : {
    mainStories : {
      rssUrl: 'http://www.telegraph.co.uk/news/rss.xml',
      $cacheElement : $('#cache .src2')
    }
  },
  'dailyMail' : {
    mainStories : {
      rssUrl: 'http://www.dailymail.co.uk/articles.rss',
      $cacheElement : $('#cache .src3')
    }
  },
  'dailyExpress' : {
    mainStories: {
      rssUrl: 'http://feeds.feedburner.com/daily-express-news-showbiz?format=xml',
      $cacheElement : $('#cache .src4')
    }
  }
};

var loopThroughEntries = function(entries, $destination) {
  
  $destination.html('');
  
  for(var i = 0; i < entries.length; i++){
    var entry = entries[i];
    
    renderStory( entry.title, entry.summary, $destination );
    
  }
  
};

var renderStory = function(title, summary, $destination) {
  $destination.append($('<div class="panel panel-default"><div class="panel-heading">'+title+'</div><div class="panel-body">'+summary+'<\/div><\/div>'));
};

var initFeed = function(feedUrl, $destination) {
  View.switchActiveSide();

  
  feednami.load(feedUrl, function(result) {
    if (result.error) {
        console.log(result.error);
    } else {
        var entries = result.feed.entries;
        loopThroughEntries(entries, $destination);
        console.log(entries);
    }
  });

};

var reverseFlipOrNot = function() {
  if (View.activeSide === '#side1' && View.sourceSlider.sliderDirction === 'left' || View.activeSide === '#side2' && View.sourceSlider.sliderDirction === 'right') {
    return true;
  } else {
    return false;
  }
};

var flipFeedSourceView = function() {
  var reverseFlipOption = reverseFlipOrNot();
  // slide 2 always flips to the left
  // side 1 always flips to the right
  
  // if View.activeSide === #side1
    // if srolling right
       // flip normally
    // if scrollign to theleft
      // flip rev
  // if View.activeSide === #side2
    // if srolling right
       // flip rev
    // if scrollign to theleft
      // flip normally

  console.log(reverseFlipOption);
  //$(".flip").flip({ reverse : reverseFlipOrNot() });
  $(".flip").flip({reverse: reverseFlipOrNot()});
  $(".flip").flip('toggle');
  //$(".flip").flip({ reverse : false });

};

var changeFeedSource = function(publicationSource) {
  var $thisCachedData = FEED_DIRECTORY[publicationSource].mainStories.$cacheElement;

  if (publicationSource !== State.currentPublication) {
    console.log('switching to ' + publicationSource)
    var destination = View.activeSide === '#side2' ? '#side1' : '#side2';
    $(destination).html( $thisCachedData.clone() );

    $(".flip").addClass('flipping');
    flipFeedSourceView();
    
    State.currentPublication = publicationSource;
    View.switchActiveSide();
  }
};

var sourceSliderChanged = function(value) {
  //if value
  console.log(value);
  var catagoryForValue;
  if (value <= 24) {
    changeFeedSource('guardian');
  }
  else if (value > 25 && value < 50) {
    changeFeedSource('dailyTelegraph');
  }
  else if (value > 51 && value < 75) {
    changeFeedSource('dailyMail');
  }
  else if (value >= 75) {
    changeFeedSource('dailyExpress');
  }
};


$(document).ready(function() {
    
  initFeed( FEED_DIRECTORY.guardian.mainStories.rssUrl, FEED_DIRECTORY.guardian.mainStories.$cacheElement );
  initFeed( FEED_DIRECTORY.dailyTelegraph.mainStories.rssUrl, FEED_DIRECTORY.dailyTelegraph.mainStories.$cacheElement );
  initFeed( FEED_DIRECTORY.dailyMail.mainStories.rssUrl, FEED_DIRECTORY.dailyMail.mainStories.$cacheElement );
  initFeed( FEED_DIRECTORY.dailyExpress.mainStories.rssUrl, FEED_DIRECTORY.dailyExpress.mainStories.$cacheElement );

  $(".flip").flip( {trigger:'manual', speed: 400});
  $(".flip").on('flip:done', function(){
      $(this).removeClass('flipping');
    });

  View.sourceSlider.listenForSliderDirection();
  $('#source-slider').slider();
  
  $('#source-slider').on('change', function(){
    
    sourceSliderChanged( $(this).val() );
  });
   
});